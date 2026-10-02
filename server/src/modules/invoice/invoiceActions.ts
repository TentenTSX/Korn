import ActionError from "../ActionError";
import orderRepository from "../order/orderRepository";
import { createInvoicePdf } from "./invoiceService";

const getInvoiceAction = async (userId: number, orderIdValue: number) => {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new ActionError("BAD_REQUEST", "Identifiant utilisateur invalide.");
  }
  const orderId = Number(orderIdValue);
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw new ActionError("BAD_REQUEST", "Identifiant commande invalide.");
  }

  const order = await orderRepository.findById(userId, orderId);
  if (!order) throw new ActionError("NOT_FOUND", "Commande introuvable.");
  if (order.status !== "paid") {
    throw new ActionError(
      "CONFLICT",
      "La facture sera disponible après paiement.",
    );
  }

  await orderRepository.ensureInvoiceNumber(orderId);
  const invoice = await orderRepository.findInvoiceByOrderId(orderId);
  if (!invoice) throw new ActionError("NOT_FOUND", "Facture introuvable.");
  return {
    invoiceNumber: invoice.invoice_number,
    pdf: await createInvoicePdf(invoice),
  };
};

export default { getInvoiceAction };
