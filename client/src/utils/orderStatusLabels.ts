export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente de paiement",
  paid: "Payée, en préparation",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  checkout_failed: "Paiement à reprendre",
  checkout_expired: "Paiement expiré",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: "Payé",
  pending: "En attente",
  failed: "Échec",
  refunded: "Remboursé",
};
