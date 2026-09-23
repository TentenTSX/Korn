import { useNavigate } from "react-router";
import ProfileDashboardView from "../../components/profile/ProfileDashboard/ProfileDashboard";

function ProfileDashboard() {
  const navigate = useNavigate();

  return (
    <main>
      <ProfileDashboardView
        email="visiteur@korn.fr"
        onLogout={() => navigate("/profile")}
      />
    </main>
  );
}

export default ProfileDashboard;
