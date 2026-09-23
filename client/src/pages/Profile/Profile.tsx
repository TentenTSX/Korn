import { useNavigate } from "react-router";
import ProfileLogin from "../../components/profile/ProfileLogin/ProfileLogin";

const profileSessionKey = "korn-profile-email";

function Profile() {
  const navigate = useNavigate();

  const handleLogin = (email: string) => {
    localStorage.setItem(profileSessionKey, email);
    navigate("/profile/dashboard");
  };

  return (
    <main>
      <ProfileLogin onLogin={handleLogin} />
    </main>
  );
}

export default Profile;
