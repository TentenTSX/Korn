import { useState } from "react";
import { useAdminOrderDetail } from "../../../hooks/useAdminOrderDetail";
import type { AdminOrderSummary } from "../../../types/order";
import { currency as money } from "../../../utils/currency";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "../../../utils/orderStatusLabels";
import "./AdminOrderRow.css";

const SETTABLE_STATUSES = ["paid", "processing", "shipped", "delivered"];

type AdminOrderRowProps = {
  order: AdminOrderSummary;
  onStatusChange: (orderId: number, status: string) => Promise<void>;
};

function AdminOrderRow({ order, onStatusChange }: AdminOrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { order: detail, isLoading: isDetailLoading } = useAdminOrderDetail(
    isExpanded ? order.id_order : null,
  );
  const canSetStatus = SETTABLE_STATUSES.includes(order.status);

  const handleStatusChange = async (status: string) => {
    setError(null);
    setIsUpdating(true);
    try {
      await onStatusChange(order.id_order, status);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "La mise à jour a échoué.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className="admin-order-row">
      <button
        className="admin-order-summary"
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <div>
          <strong>Commande #{order.id_order}</strong>
          <span>{new Date(order.created_at).toLocaleDateString("fr-FR")}</span>
        </div>
        <div>
          <strong>
            {order.shipping_first_name} {order.shipping_last_name}
          </strong>
          <span>{order.customer_email}</span>
        </div>
        <span>
          Paiement :{" "}
          {PAYMENT_STATUS_LABELS[order.payment_status ?? ""] ?? "Non confirmé"}
        </span>
        <strong>{money.format(Number(order.total_price))}</strong>
      </button>

      {canSetStatus ? (
        <label className="admin-order-status-select">
          <span className="sr-only">Statut de la commande</span>
          <select
            value={order.status}
            disabled={isUpdating}
            onChange={(event) => void handleStatusChange(event.target.value)}
          >
            {SETTABLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <span className="admin-order-status-readonly">
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      )}

      {error && (
        <p className="admin-order-error" role="alert">
          {error}
        </p>
      )}

      {isExpanded && (
        <div className="admin-order-details">
          {isDetailLoading ? (
            <p>Chargement...</p>
          ) : detail ? (
            <>
              <address>
                {detail.shipping_first_name} {detail.shipping_last_name}
                <br />
                {detail.shipping_address}
                <br />
                {detail.shipping_postal_code} {detail.shipping_city}
                <br />
                {detail.shipping_country}
              </address>
              <ul>
                {detail.items.map((item) => (
                  <li key={`${item.id_product}-${item.size}-${item.color}`}>
                    {item.name} (
                    {[item.color, item.size].filter(Boolean).join(" / ")}) ×{" "}
                    {item.quantity} —{" "}
                    {money.format(Number(item.price_unit) * item.quantity)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Détails indisponibles.</p>
          )}
        </div>
      )}
    </article>
  );
}

export default AdminOrderRow;
