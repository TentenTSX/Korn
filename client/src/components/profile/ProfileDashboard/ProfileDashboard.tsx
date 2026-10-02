import "./ProfileDashboard.css";

type ProfileDashboardProps = {
  userId: number;
  firstName: string;
  email: string;
  isLoading: boolean;
  orders?: Array<{
    id_order: number;
    created_at: string;
    status: string;
    total_price: number | string;
    payment_status: string | null;
    invoice_number: string | null;
  }>;
  onLogout: () => void;
};

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

const paymentStatusLabels: Record<string, string> = {
  paid: "Payé",
  pending: "En attente",
  failed: "Échec",
  refunded: "Remboursé",
};

function ProfileDashboard({
  userId,
  firstName,
  email,
  isLoading,
  orders: remoteOrders,
  onLogout,
}: ProfileDashboardProps) {
  const orders = remoteOrders ?? [];
  const inProgressCount = orders.filter((order) =>
    ["paid", "processing", "shipped"].includes(order.status),
  ).length;
  const invoiceCount = orders.filter((order) => order.invoice_number).length;
  const pendingPaymentCount = orders.filter(
    (order) => order.status === "pending" || order.payment_status === "pending",
  ).length;

  return (
    <section
      className="profile-dashboard"
      aria-labelledby="profile-dashboard-title"
    >
      <header className="profile-dashboard-header">
        <div>
          <span className="profile-eyebrow">Mon espace</span>
          <h1 id="profile-dashboard-title">Bonjour, {firstName}.</h1>
          <p>{email}</p>
        </div>
        <button
          className="profile-logout-button"
          type="button"
          onClick={onLogout}
        >
          Se déconnecter
        </button>
      </header>

      <div className="profile-dashboard-grid">
        <article className="profile-summary-card profile-summary-card-highlight">
          <span>Commandes en cours</span>
          <strong>{inProgressCount}</strong>
          <p>
            {inProgressCount === 1
              ? "Une commande payée est en cours de préparation ou de livraison."
              : "Commandes payées en préparation ou en livraison."}
          </p>
        </article>
        <article className="profile-summary-card">
          <span>Factures disponibles</span>
          <strong>{invoiceCount}</strong>
          <p>Factures disponibles après confirmation du paiement.</p>
        </article>
        <article className="profile-summary-card">
          <span>Paiements en attente</span>
          <strong>{pendingPaymentCount}</strong>
          <p>Commandes qui attendent encore une confirmation de paiement.</p>
        </article>
      </div>

      <div className="profile-dashboard-sections">
        <section
          className="profile-orders"
          aria-labelledby="profile-orders-title"
        >
          <div className="profile-section-heading">
            <div>
              <span className="profile-eyebrow">Historique</span>
              <h2 id="profile-orders-title">Mes commandes</h2>
            </div>
            <a href="/collection">Continuer mes achats</a>
          </div>

          <div className="profile-orders-list">
            {isLoading ? (
              <p>Chargement de vos commandes...</p>
            ) : orders.length === 0 ? (
              <p className="profile-orders-empty">
                Aucune commande pour le moment.
              </p>
            ) : (
              orders.map((order) => (
                <article className="profile-order-row" key={order.id_order}>
                  <div>
                    <strong>Commande #{order.id_order}</strong>
                    <span>
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="profile-order-payment">
                    <span className="profile-order-status">
                      {orderStatusLabels[order.status] ?? order.status}
                    </span>
                    <span>
                      Paiement :{" "}
                      {paymentStatusLabels[order.payment_status ?? ""] ??
                        "Non confirmé"}
                    </span>
                  </div>
                  <strong>{money.format(Number(order.total_price))}</strong>
                  {order.invoice_number ? (
                    <a
                      href={`/api/users/${userId}/orders/${order.id_order}/invoice`}
                      aria-label={`Télécharger la facture ${order.invoice_number}`}
                    >
                      Télécharger la facture
                    </a>
                  ) : (
                    <span className="profile-invoice-pending">
                      Facture après paiement
                    </span>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="profile-account-card">
          <span className="profile-eyebrow">Compte</span>
          <h2>Coordonnées</h2>
          <p>{email}</p>
          <p>
            Les factures payées sont disponibles dans l’historique des
            commandes.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default ProfileDashboard;
