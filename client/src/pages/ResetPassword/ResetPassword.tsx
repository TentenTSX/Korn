import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import "../../components/profile/ProfileLogin/ProfileLogin.css";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { apiRequest } from "../../services/api";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  useDocumentHead({
    title: "Nouveau mot de passe",
    description: "Choisissez un nouveau mot de passe pour votre compte Korn.",
  });
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Ce lien de réinitialisation est invalide.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await apiRequest<void>("/api/auth/password-reset/confirm", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setIsDone(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "La demande n'a pas pu aboutir.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="reset-password-page">
      <div className="reset-password-intro profile-login-intro">
        <span className="profile-eyebrow">Espace personnel</span>
        <h1>
          Choisissez un
          <br />
          nouveau mot
          <br />
          de passe.
        </h1>
        <p>
          Pour votre sécurité, choisissez un mot de passe d'au moins 8
          caractères que vous n'utilisez pas ailleurs.
        </p>
      </div>

      <div className="profile-login-form reset-password-card">
        {!token ? (
          <p className="reset-password-message" role="alert">
            Ce lien de réinitialisation est invalide. Demandez-en un nouveau
            depuis la page de connexion.
            <Link to="/profile">Retour à la connexion</Link>
          </p>
        ) : isDone ? (
          <output className="reset-password-message">
            Votre mot de passe a été mis à jour.
            <Link to="/profile">Se connecter</Link>
          </output>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="profile-field">
              <label htmlFor="reset-password">Nouveau mot de passe</label>
              <div className="profile-input-wrapper">
                <LockKeyhole size={17} aria-hidden="true" />
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Votre nouveau mot de passe"
                />
                <button
                  className="profile-password-toggle"
                  type="button"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="reset-password-confirmation">
                Confirmer le mot de passe
              </label>
              <div className="profile-input-wrapper">
                <LockKeyhole size={17} aria-hidden="true" />
                <input
                  id="reset-password-confirmation"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  placeholder="Confirmez votre nouveau mot de passe"
                />
              </div>
            </div>

            {error && <p className="profile-form-error">{error}</p>}

            <button
              className="profile-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Veuillez patienter..."
                : "Changer mon mot de passe"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;
