import cartActions from "../src/modules/cart/cartActions";
import cartRepository from "../src/modules/cart/cartRepository";
import orderRepository from "../src/modules/order/orderRepository";

const userOwner = { kind: "user" as const, userId: 1 };
const guestOwner = {
  kind: "guest" as const,
  guestTokenHash: "a".repeat(64),
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe("cartActions.getCartAction", () => {
  test("rejects an invalid user id", async () => {
    await expect(
      cartActions.getCartAction({ kind: "user", userId: -1 }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects a malformed guest token", async () => {
    await expect(
      cartActions.getCartAction({ kind: "guest", guestTokenHash: "nope" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  test("returns the cart for a valid owner", async () => {
    jest
      .spyOn(cartRepository, "findByOwner")
      .mockResolvedValue([{ id_cart_item: 1 }] as never);

    const result = await cartActions.getCartAction(userOwner);
    expect(result).toEqual([{ id_cart_item: 1 }]);
  });
});

describe("cartActions.addCartItemAction", () => {
  test("rejects a non-positive quantity", async () => {
    await expect(
      cartActions.addCartItemAction(userOwner, {
        variant_id: 1,
        quantity: 0,
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects when the variant does not exist", async () => {
    jest.spyOn(cartRepository, "findVariant").mockResolvedValue(undefined);

    await expect(
      cartActions.addCartItemAction(userOwner, {
        variant_id: 1,
        quantity: 1,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  test("rejects when the requested quantity exceeds stock", async () => {
    jest
      .spyOn(cartRepository, "findVariant")
      .mockResolvedValue({ id_variant: 1, price: 10, stock_quantity: 2 });
    jest
      .spyOn(cartRepository, "findCartItemByVariant")
      .mockResolvedValue({ quantity: 1 });

    await expect(
      cartActions.addCartItemAction(userOwner, {
        variant_id: 1,
        quantity: 2,
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("adds the item when stock allows it", async () => {
    jest
      .spyOn(cartRepository, "findVariant")
      .mockResolvedValue({ id_variant: 1, price: 10, stock_quantity: 5 });
    jest
      .spyOn(cartRepository, "findCartItemByVariant")
      .mockResolvedValue(undefined);
    const addSpy = jest
      .spyOn(cartRepository, "addItem")
      .mockResolvedValue(undefined);

    await cartActions.addCartItemAction(userOwner, {
      variant_id: 1,
      quantity: 2,
    });

    expect(addSpy).toHaveBeenCalledWith(userOwner, 1, 2, 10);
  });
});

describe("cartActions.updateCartItemAction", () => {
  test("rejects when the cart item does not belong to the owner", async () => {
    jest.spyOn(cartRepository, "findItemByOwner").mockResolvedValue(undefined);

    await expect(
      cartActions.updateCartItemAction(userOwner, 1, 2),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  test("rejects when the new quantity exceeds stock", async () => {
    jest
      .spyOn(cartRepository, "findItemByOwner")
      .mockResolvedValue({ variant_id: 1 });
    jest
      .spyOn(cartRepository, "findVariant")
      .mockResolvedValue({ id_variant: 1, price: 10, stock_quantity: 3 });

    await expect(
      cartActions.updateCartItemAction(userOwner, 1, 4),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("updates the quantity when stock allows it", async () => {
    jest
      .spyOn(cartRepository, "findItemByOwner")
      .mockResolvedValue({ variant_id: 1 });
    jest
      .spyOn(cartRepository, "findVariant")
      .mockResolvedValue({ id_variant: 1, price: 10, stock_quantity: 3 });
    const updateSpy = jest
      .spyOn(cartRepository, "updateItem")
      .mockResolvedValue(1);

    await cartActions.updateCartItemAction(userOwner, 1, 2);

    expect(updateSpy).toHaveBeenCalledWith(userOwner, 1, 2);
  });
});

describe("cartActions.deleteCartItemAction", () => {
  test("rejects when nothing was deleted", async () => {
    jest.spyOn(cartRepository, "removeItem").mockResolvedValue(0);

    await expect(
      cartActions.deleteCartItemAction(userOwner, 1),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  test("resolves when the item was deleted", async () => {
    jest.spyOn(cartRepository, "removeItem").mockResolvedValue(1);

    await expect(
      cartActions.deleteCartItemAction(userOwner, 1),
    ).resolves.toBeUndefined();
  });
});

describe("cartActions.mergeGuestCartAction", () => {
  test("rejects a malformed guest token", async () => {
    await expect(
      cartActions.mergeGuestCartAction("nope", 1, "user@example.com"),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  test("merges the guest cart and transfers guest orders matching the account email", async () => {
    const mergeSpy = jest
      .spyOn(cartRepository, "mergeGuestCartIntoUser")
      .mockResolvedValue(undefined);
    const transferSpy = jest
      .spyOn(orderRepository, "transferGuestOrdersToUser")
      .mockResolvedValue(undefined as never);

    await cartActions.mergeGuestCartAction(
      guestOwner.guestTokenHash,
      1,
      "user@example.com",
    );

    expect(mergeSpy).toHaveBeenCalledWith(guestOwner.guestTokenHash, 1);
    expect(transferSpy).toHaveBeenCalledWith(
      guestOwner.guestTokenHash,
      1,
      "user@example.com",
    );
  });
});
