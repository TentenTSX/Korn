import "./ProfileDashboard.css";

type ProfileDashboardProps = {
  email: string;
  onLogout: () => void;
};

const orders = [
  {
    number: "KORN-2027-041",
    date: "12 juin 2027",
    status: "Expédiée",
    total: "124 €",
  },
  {
    number: "KORN-2027-018",
    date: "28 mai 2027",
    status: "Livrée",
    total: "89 €",
  },
];

function ProfileDashboard({ email, onLogout }: ProfileDashboardProps) {
  return (
    <section
      className="profile-dashboard"
      aria-labelledby="profile-dashboard-title"
    >
      <header className="profile-dashboard-header">
        <div>
          <span className="profile-eyebrow">Mon espace</span>
          <h1 id="profile-dashboard-title">Bonjour, bienvenue.</h1>
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
          <strong>1</strong>
          <p>Une commande est en route vers vous.</p>
        </article>
        <article className="profile-summary-card">
          <span>Factures disponibles</span>
          <strong>2</strong>
          <p>Retrouvez vos justificatifs à tout moment.</p>
        </article>
        <article className="profile-summary-card">
          <span>Adresse de livraison</span>
          <strong>01</strong>
          <p>Votre adresse principale est enregistrée.</p>
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
            {orders.map((order) => (
              <article className="profile-order-row" key={order.number}>
                <div>
                  <strong>{order.number}</strong>
                  <span>{order.date}</span>
                </div>
                <span className="profile-order-status">{order.status}</span>
                <strong>{order.total}</strong>
                <a href="/profile">Voir le détail</a>
              </article>
            ))}
          </div>
        </section>

        <aside className="profile-account-card">
          <span className="profile-eyebrow">Compte</span>
          <h2>Mes informations</h2>
          <p>Gérez vos coordonnées, vos adresses et vos préférences.</p>
          <button type="button">Modifier mes informations</button>
          <button type="button">Mes factures</button>
        </aside>
      </div>
    </section>
  );
}

export default ProfileDashboard;
