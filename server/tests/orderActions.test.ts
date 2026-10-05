import cartRepository from "../src/modules/cart/cartRepository";
import orderActions from "../src/modules/order/orderActions";
import orderRepository from "../src/modules/order/orderRepository";

const validCheckoutInput = {
  customer_email: "ada@example.com",
  shipping_first_name: "Ada",
  shipping_last_name: "Lovelace",
  shipping_address: "1 rue de la Paix",
  shipping_city: "Paris",
  shipping_postal_code: "75000",
  shipping_country: "France",
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe("orderActions.getOrdersAction", () => {
  test("rejects when the authenticated user does not match", async () => {
    await expect(orderActions.getOrdersAction(1, 2)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  test("returns orders unchanged when none are missing an invoice", async () => {
    const orders = [{ id_order: 1, status: "pending", invoice_number: null }];
    jest
      .spyOn(orderRepository, "findAllByUser")
      .mockResolvedValue(orders as never);

    const result = await orderActions.getOrdersAction(1, 1);

    expect(result).toBe(orders);
  });

  test("backfills the invoice number for paid orders missing one", async () => {
    const initialOrders = [
      { id_order: 1, status: "paid", invoice_number: null },
    ];
    const refreshedOrders = [
      { id_order: 1, status: "paid", invoice_number: "INV-0001" },
    ];
    jest
      .spyOn(orderRepository, "findAllByUser")
      .mockResolvedValueOnce(initialOrders as never)
      .mockResolvedValueOnce(refreshedOrders as never);
    const ensureSpy = jest
      .spyOn(orderRepository, "ensureInvoiceNumber")
      .mockResolvedValue(undefined as never);

    const result = await orderActions.getOrdersAction(1, 1);

    expect(ensureSpy).toHaveBeenCalledWith(1);
    expect(result).toBe(refreshedOrders);
  });
});

describe("orderActions.getOrderAction", () => {
  test("rejects an invalid order id", async () => {
    await expect(orderActions.getOrderAction(1, 1, -1)).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  test("rejects when the order does not belong to the user", async () => {
    jest.spyOn(orderRepository, "findById").mockResolvedValue(undefined);

    await expect(orderActions.getOrderAction(1, 1, 1)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  test("returns the order when found", async () => {
    const order = { id_order: 1 };
    jest.spyOn(orderRepository, "findById").mockResolvedValue(order as never);

    await expect(orderActions.getOrderAction(1, 1, 1)).resolves.toBe(order);
  });
});

describe("orderActions.createOrderAction", () => {
  const userOwner = { kind: "user" as const, userId: 1 };

  test("rejects missing shipping or email fields", async () => {
    await expect(
      orderActions.createOrderAction(userOwner, {
        ...validCheckoutInput,
        customer_email: "not-an-email",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects a malformed guest cart token", async () => {
    await expect(
      orderActions.createOrderAction(
        { kind: "guest", guestTokenHash: "nope" },
        validCheckoutInput,
      ),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  test("rejects an empty cart", async () => {
    jest.spyOn(cartRepository, "findCheckoutItems").mockResolvedValue([]);

    await expect(
      orderActions.createOrderAction(userOwner, validCheckoutInput),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects when an item's stock changed since it was added", async () => {
    jest.spyOn(cartRepository, "findCheckoutItems").mockResolvedValue([
      {
        variant_id: 1,
        quantity: 5,
        price_unit: 10,
        stock_quantity: 2,
        name: "Tee",
        size: "M",
        color: "Noir",
      },
    ]);

    await expect(
      orderActions.createOrderAction(userOwner, validCheckoutInput),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  test("computes the total in cents and forwards it to the repository", async () => {
    jest.spyOn(cartRepository, "findCheckoutItems").mockResolvedValue([
      {
        variant_id: 1,
        quantity: 3,
        price_unit: "19.99",
        stock_quantity: 10,
        name: "Tee",
        size: "M",
        color: "Noir",
      },
    ]);
    const createSpy = jest
      .spyOn(orderRepository, "createWithItems")
      .mockResolvedValue(42);

    const result = await orderActions.createOrderAction(
      userOwner,
      validCheckoutInput,
    );

    // 19.99 * 3 computed in cents to avoid floating point drift (5997 cents = 59.97).
    expect(result).toEqual({
      orderId: 42,
      totalPrice: 59.97,
      items: [
        {
          variant_id: 1,
          quantity: 3,
          price_unit: 19.99,
          name: "Tee",
          size: "M",
          color: "Noir",
        },
      ],
    });
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 1,
        customer_email: "ada@example.com",
        total_price: 59.97,
      }),
      expect.any(Array),
    );
  });
});

describe("orderActions.updateOrderStatusAction", () => {
  test("rejects an invalid status", async () => {
    await expect(
      orderActions.updateOrderStatusAction(1, 1, 1, ""),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects when the order does not belong to the user", async () => {
    jest.spyOn(orderRepository, "updateStatus").mockResolvedValue(0);

    await expect(
      orderActions.updateOrderStatusAction(1, 1, 1, "shipped"),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  test("updates the status when the order belongs to the user", async () => {
    const updateSpy = jest
      .spyOn(orderRepository, "updateStatus")
      .mockResolvedValue(1);

    await orderActions.updateOrderStatusAction(1, 1, 1, "shipped");

    expect(updateSpy).toHaveBeenCalledWith(1, 1, "shipped");
  });
});
