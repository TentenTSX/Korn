import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import ProfileLogin from "../../components/profile/ProfileLogin/ProfileLogin";
import { useCartContext } from "../../contexts/CartContext";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { apiRequest } from "../../services/api";

function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthLoading, login, register } = useCartContext();
  useDocumentHead({
    title: "Connexion",
    description:
      "Connectez-vous ou créez votre compte Korn pour suivre vos commandes et vos factures.",
  });
  const [googleError] = useState(() => searchParams.get("error") === "google");

  useEffect(() => {
    if (googleError) setSearchParams({}, { replace: true });
  }, [googleError, setSearchParams]);

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

  const handleRequestPasswordReset = async (email: string) => {
    await apiRequest<void>("/api/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return (
    <main>
      {googleError && (
        <p className="profile-form-error" role="alert">
          La connexion avec Google a échoué. Merci de réessayer.
        </p>
      )}
      <ProfileLogin
        onLogin={handleLogin}
        onRegister={handleRegister}
        onRequestPasswordReset={handleRequestPasswordReset}
      />
    </main>
  );
}

export default Profile;
