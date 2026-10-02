import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useCartContext } from "../../contexts/CartContext";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { useOrder } from "../../hooks/useOrder";
import "./OrderDetail.css";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const orderStatusLabels: Record<string, string> = {
  pending: "En attente de paiement",
  paid: "Payée, en préparation",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  checkout_failed: "Paiement à reprendre",
  checkout_expired: "Paiement expiré",
};

function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user, isAuthLoading } = useCartContext();
  const { order, isLoading, error } = useOrder(
    user?.id_user ?? null,
    orderId ? Number(orderId) : null,
  );
  useDocumentHead({
    title: order ? `Commande #${order.id_order}` : "Commande",
    description: "Détail de votre commande Korn.",
  });

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/profile", { replace: true });
  }, [isAuthLoading, navigate, user]);

  if (isAuthLoading || !user) return <main />;

  if (isLoading) return <main className="order-detail-page" />;

  if (error || !order) {
    return (
      <main className="order-detail-page">
        <p role="alert">{error ?? "Commande introuvable."}</p>
        <Link to="/profile/dashboard">Retour à mon espace</Link>
      </main>
    );
  }

  return (
    <main className="order-detail-page">
      <Link className="order-detail-back" to="/profile/dashboard">
        ← Retour à mon espace
      </Link>

      <header className="order-detail-header">
        <div>
          <span className="order-detail-eyebrow">
            {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </span>
          <h1>Commande #{order.id_order}</h1>
        </div>
        <span className="order-detail-status">
          {orderStatusLabels[order.status] ?? order.status}
        </span>
      </header>

      <div className="order-detail-layout">
        <section
          className="order-detail-items"
          aria-labelledby="order-detail-items-title"
        >
          <h2 id="order-detail-items-title">Articles</h2>
          {order.items.map((item) => (
            <article
              className="order-detail-item"
              key={`${item.id_product}-${item.size}-${item.color}`}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="order-detail-image-placeholder" />
              )}
              <div>
                <h3>{item.name}</h3>
                <p>{[item.color, item.size].filter(Boolean).join(" · ")}</p>
                <p>Quantité : {item.quantity}</p>
              </div>
              <strong>{money.format(Number(item.price_unit))}</strong>
            </article>
          ))}
        </section>

        <aside className="order-detail-summary">
          <h2>Résumé</h2>
          <div className="order-detail-total">
            <span>Total</span>
            <strong>{money.format(Number(order.total_price))}</strong>
          </div>

          {order.invoice_number && (
            <a
              className="order-detail-invoice-link"
              href={`/api/users/${user.id_user}/orders/${order.id_order}/invoice`}
            >
              Télécharger la facture
            </a>
          )}

          <h2>Livraison</h2>
          <address className="order-detail-address">
            {order.shipping_first_name} {order.shipping_last_name}
            <br />
            {order.shipping_address}
            <br />
            {order.shipping_postal_code} {order.shipping_city}
            <br />
            {order.shipping_country}
          </address>
        </aside>
      </div>
    </main>
  );
}

export default OrderDetail;
