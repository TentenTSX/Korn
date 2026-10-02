import ActionError from "../ActionError";
import orderRepository from "../order/orderRepository";
import type CartOwner from "./CartOwner";
import cartRepository from "./cartRepository";

type CartItemInput = { variant_id: number; quantity: number };

function validateOwner(owner: CartOwner) {
  if (
    owner.kind === "user" &&
    (!Number.isInteger(owner.userId) || owner.userId < 1)
  ) {
    throw new ActionError("BAD_REQUEST", "Identifiant utilisateur invalide.");
  }
  if (owner.kind === "guest" && !/^[a-f0-9]{64}$/i.test(owner.guestTokenHash)) {
    throw new ActionError("UNAUTHORIZED", "Session panier invalide.");
  }
}

function parsePositiveInteger(value: unknown, label: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ActionError("BAD_REQUEST", `${label} invalide.`);
  }
  return parsed;
}

const getCartAction = async (owner: CartOwner) => {
  validateOwner(owner);
  return cartRepository.findByOwner(owner);
};

const addCartItemAction = async (owner: CartOwner, input: CartItemInput) => {
  validateOwner(owner);
  const variantId = parsePositiveInteger(input?.variant_id, "Variant");
  const quantity = parsePositiveInteger(input?.quantity, "Quantité");
  const variant = await cartRepository.findVariant(variantId);
  if (!variant) throw new ActionError("NOT_FOUND", "Variant introuvable.");
  const existingItem = await cartRepository.findCartItemByVariant(
    owner,
    variantId,
  );
  if (quantity + (existingItem?.quantity ?? 0) > variant.stock_quantity) {
    throw new ActionError("BAD_REQUEST", "Stock insuffisant.");
  }
  await cartRepository.addItem(owner, variantId, quantity, variant.price);
};

const updateCartItemAction = async (
  owner: CartOwner,
  itemIdValue: number,
  quantityValue: number,
) => {
  validateOwner(owner);
  const itemId = parsePositiveInteger(itemIdValue, "Article");
  const quantity = parsePositiveInteger(quantityValue, "Quantité");
  const item = await cartRepository.findItemByOwner(owner, itemId);
  if (!item) throw new ActionError("NOT_FOUND", "Article introuvable.");
  const variant = await cartRepository.findVariant(item.variant_id);
  if (!variant) throw new ActionError("NOT_FOUND", "Variant introuvable.");
  if (quantity > variant.stock_quantity) {
    throw new ActionError("BAD_REQUEST", "Stock insuffisant.");
  }
  await cartRepository.updateItem(owner, itemId, quantity);
};

const deleteCartItemAction = async (owner: CartOwner, itemIdValue: number) => {
  validateOwner(owner);
  const itemId = parsePositiveInteger(itemIdValue, "Article");
  const affectedRows = await cartRepository.removeItem(owner, itemId);
  if (affectedRows === 0)
    throw new ActionError("NOT_FOUND", "Article introuvable.");
};

const mergeGuestCartAction = async (guestTokenHash: string, userId: number) => {
  validateOwner({ kind: "guest", guestTokenHash });
  parsePositiveInteger(userId, "Utilisateur");
  await cartRepository.mergeGuestCartIntoUser(guestTokenHash, userId);
  await orderRepository.transferGuestOrdersToUser(guestTokenHash, userId);
};

export default {
  getCartAction,
  addCartItemAction,
  updateCartItemAction,
  deleteCartItemAction,
  mergeGuestCartAction,
};
