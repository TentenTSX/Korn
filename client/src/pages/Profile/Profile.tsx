import { useEffect } from "react";
import { useNavigate } from "react-router";
import ProfileLogin from "../../components/profile/ProfileLogin/ProfileLogin";
import { useCartContext } from "../../contexts/CartContext";

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthLoading, login, register } = useCartContext();

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/profile/dashboard", { replace: true });
    }
  }, [isAuthLoading, navigate, user]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/profile/dashboard", { replace: true });
    }
  }, [isAuthLoading, navigate, user]);

  const handleLogin = async (email: string, password: string) => {
    await login({ email, password });
    navigate("/profile/dashboard");
  };

  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    await register({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    navigate("/profile/dashboard");
  };

  return (
    <main>
      <ProfileLogin onLogin={handleLogin} onRegister={handleRegister} />
    </main>
  );
}

export default Profile;
