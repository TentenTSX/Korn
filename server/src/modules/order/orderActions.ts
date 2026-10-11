import ActionError from "../ActionError";
import type CartOwner from "../cart/CartOwner";
import cartRepository from "../cart/cartRepository";
import orderRepository from "./orderRepository";
import { SHIPPING_FEE_EUR } from "./shippingFee";

type CheckoutInput = {
  customer_email: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
};

function assertOwner(userId: number, authenticatedUserId: number) {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new ActionError("BAD_REQUEST", "Identifiant utilisateur invalide.");
  }
  if (userId !== authenticatedUserId) {
    throw new ActionError("FORBIDDEN", "Accès interdit.");
  }
}

function parseId(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new ActionError("BAD_REQUEST", `${label} invalide.`);
  }
  return value;
}

const getOrdersAction = async (userId: number, authenticatedUserId: number) => {
  assertOwner(userId, authenticatedUserId);
  return orderRepository.findAllByUser(userId);
};

const getOrderAction = async (
  userId: number,
  authenticatedUserId: number,
  orderIdValue: number,
) => {
  assertOwner(userId, authenticatedUserId);
  const orderId = parseId(orderIdValue, "Commande");
  const order = await orderRepository.findById(userId, orderId);
  if (!order) throw new ActionError("NOT_FOUND", "Commande introuvable.");
  return order;
};

const createOrderAction = async (owner: CartOwner, input: CheckoutInput) => {
  if (owner.kind === "user") parseId(owner.userId, "Utilisateur");
  const shippingFields = [
    input?.shipping_first_name,
    input?.shipping_last_name,
    input?.shipping_address,
    input?.shipping_city,
    input?.shipping_postal_code,
    input?.shipping_country,
  ];
  if (owner.kind === "guest" && !/^[a-f0-9]{64}$/i.test(owner.guestTokenHash)) {
    throw new ActionError("UNAUTHORIZED", "Session panier invalide.");
  }
  if (
    typeof input?.customer_email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(input.customer_email.trim()) ||
    shippingFields.some((field) => typeof field !== "string" || !field.trim())
  ) {
    throw new ActionError(
      "BAD_REQUEST",
      "Email et informations de livraison valides requis.",
    );
  }

  const cartItems = await cartRepository.findCheckoutItems(owner);
  if (cartItems.length === 0) {
    throw new ActionError("BAD_REQUEST", "Le panier est vide.");
  }

  let totalCents = 0;
  const orderItems = cartItems.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.price_unit);
    const stockQuantity = Number(item.stock_quantity);
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      throw new ActionError("CONFLICT", "Un article du panier est invalide.");
    }
    if (quantity > stockQuantity) {
      throw new ActionError(
        "CONFLICT",
        "Le stock a changé pour un article du panier.",
      );
    }
    const unitPriceCents = Math.round(unitPrice * 100);
    totalCents += unitPriceCents * quantity;
    return {
      variant_id: item.variant_id,
      quantity,
      price_unit: unitPriceCents / 100,
      name: item.name,
      size: item.size,
      color: item.color,
    };
  });

  const shippingFeeCents = Math.round(SHIPPING_FEE_EUR * 100);
  const totalPrice = (totalCents + shippingFeeCents) / 100;
  const orderId = await orderRepository.createWithItems(
    {
      user_id: owner.kind === "user" ? owner.userId : null,
      customer_email: input.customer_email.trim().toLowerCase(),
      guest_cart_token_hash:
        owner.kind === "guest" ? owner.guestTokenHash : null,
      total_price: totalPrice,
      shipping_fee: shippingFeeCents / 100,
      shipping_first_name: input.shipping_first_name.trim(),
      shipping_last_name: input.shipping_last_name.trim(),
      shipping_address: input.shipping_address.trim(),
      shipping_city: input.shipping_city.trim(),
      shipping_postal_code: input.shipping_postal_code.trim(),
      shipping_country: input.shipping_country.trim(),
    },
    orderItems,
  );
  return {
    orderId,
    totalPrice,
    shippingFee: shippingFeeCents / 100,
    items: orderItems,
  };
};

const getShippingFeeAction = () => ({ shippingFee: SHIPPING_FEE_EUR });

export default {
  getOrdersAction,
  getOrderAction,
  createOrderAction,
  getShippingFeeAction,
};
