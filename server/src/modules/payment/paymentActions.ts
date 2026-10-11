import ActionError from "../ActionError";
import orderRepository from "../order/orderRepository";
import paymentRepository from "./paymentRepository";

async function assertOrderOwner(userId: number, orderId: number) {
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw new ActionError("BAD_REQUEST", "Identifiant commande invalide.");
  }
  const order = await orderRepository.findOwnerById(orderId);
  if (!order) throw new ActionError("NOT_FOUND", "Commande introuvable.");
  if (order.user_id !== userId) {
    throw new ActionError("FORBIDDEN", "Accès interdit.");
  }
  return order;
}

const getPaymentsAction = async (userId: number, orderId: number) => {
  await assertOrderOwner(userId, orderId);
  return paymentRepository.findByOrder(orderId);
};

export default { getPaymentsAction };
