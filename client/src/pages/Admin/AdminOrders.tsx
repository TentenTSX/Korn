import { useEffect } from "react";
import { useNavigate } from "react-router";
import AdminOrderRow from "../../components/admin/AdminOrderRow/AdminOrderRow";
import { useAuthContext } from "../../contexts/AuthContext";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { orders, isLoading, error, updateStatus } = useAdminOrders();
  useDocumentHead({
    title: "Gestion des commandes",
    description: "Espace admin Korn : suivi et gestion des commandes.",
  });

  useEffect(() => {
    if (!isAuthLoading && user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [isAuthLoading, navigate, user]);

  if (isAuthLoading || user?.role !== "admin") return <main />;

  return (
    <main className="admin-orders-page">
      <header className="admin-orders-header">
        <span className="admin-orders-eyebrow">Espace admin</span>
        <h1>Commandes</h1>
      </header>

      {isLoading ? (
        <p>Chargement des commandes...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <p className="admin-orders-empty">Aucune commande pour le moment.</p>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <AdminOrderRow
              key={order.id_order}
              order={order}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
