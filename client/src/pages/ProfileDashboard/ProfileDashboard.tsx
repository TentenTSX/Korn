import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProfileDashboardView from "../../components/profile/ProfileDashboard/ProfileDashboard";
import { useCartContext } from "../../contexts/CartContext";
import { useOrders } from "../../hooks/useOrders";

function ProfileDashboard() {
  const navigate = useNavigate();
  const { user, isAuthLoading, logout } = useCartContext();
  const {
    orders,
    isLoading: areOrdersLoading,
    error: ordersError,
  } = useOrders(user?.id_user ?? null);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/profile", { replace: true });
  }, [isAuthLoading, navigate, user]);

  if (isAuthLoading || !user) return <main />;

  return (
    <main>
      {ordersError && <p role="alert">{ordersError}</p>}
      {logoutError && <p role="alert">{logoutError}</p>}
      <ProfileDashboardView
        userId={user.id_user}
        firstName={user.first_name}
        email={user.email}
        orders={orders}
        isLoading={areOrdersLoading}
        onLogout={async () => {
          try {
            await logout();
            navigate("/profile");
          } catch (error) {
            setLogoutError(
              error instanceof Error
                ? error.message
                : "La déconnexion a échoué.",
            );
          }
        }}
      />
    </main>
  );
}

export default ProfileDashboard;
