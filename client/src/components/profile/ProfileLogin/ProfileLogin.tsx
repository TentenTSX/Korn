import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import "./ProfileLogin.css";

type ProfileLoginProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  onRequestPasswordReset: (email: string) => Promise<void>;
};

type ProfileMode = "login" | "register" | "forgot";

function ProfileLogin({
  onLogin,
  onRegister,
  onRequestPasswordReset,
}: ProfileLoginProps) {
  const [mode, setMode] = useState<ProfileMode>("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "forgot") {
      if (!email) {
        setError("Renseignez votre adresse email.");
        return;
      }
      setError("");
      setIsSubmitting(true);
      try {
        await onRequestPasswordReset(email);
        setResetRequested(true);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "La demande n'a pas pu aboutir.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (
      !email ||
      !password ||
      (mode === "register" &&
        (!firstName || !lastName || !passwordConfirmation))
    ) {
      setError("Renseignez tous les champs obligatoires.");
      return;
    }

    if (mode === "register" && password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onRegister(firstName, lastName, email, password);
      }
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
    <section className="profile-login" aria-labelledby="profile-login-title">
      <div className="profile-login-intro">
        <span className="profile-eyebrow">Espace personnel</span>
        <h1 id="profile-login-title">Bienvenue chez Korn.</h1>
        <p>
          {mode === "login" &&
            "Connectez-vous pour retrouver vos commandes, vos factures et vos informations personnelles."}
          {mode === "register" &&
            "Créez votre espace Korn pour suivre vos commandes et retrouver vos factures."}
          {mode === "forgot" &&
            "Indiquez votre adresse email pour recevoir un lien de réinitialisation."}
        </p>
      </div>

      <form className="profile-login-form" onSubmit={handleSubmit}>
        {mode === "forgot" ? (
          <button
            className="profile-forgot-back"
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setResetRequested(false);
            }}
          >
            ← Retour à la connexion
          </button>
        ) : (
          <div
            className="profile-mode-switch"
            role="tablist"
            aria-label="Accès au compte"
          >
            <button
              className={mode === "login" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Connexion
            </button>
            <button
              className={mode === "register" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Inscription
            </button>
          </div>
        )}

        {mode === "forgot" && resetRequested ? (
          <output className="profile-forgot-success">
            Si un compte existe avec cet email, un lien de réinitialisation
            vient d'être envoyé.
          </output>
        ) : (
          <>
            {mode === "register" && (
              <>
                <div className="profile-field">
                  <label htmlFor="profile-first-name">Prénom</label>
                  <div className="profile-input-wrapper">
                    <input
                      id="profile-first-name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Votre prénom"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                    />
                  </div>
                </div>
                <div className="profile-field">
                  <label htmlFor="profile-last-name">Nom</label>
                  <div className="profile-input-wrapper">
                    <input
                      id="profile-last-name"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Votre nom"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="profile-field">
              <label htmlFor="profile-email">Adresse email</label>
              <div className="profile-input-wrapper">
                <Mail size={17} aria-hidden="true" />
                <input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="profile-field">
                <label htmlFor="profile-password-confirmation">
                  Confirmer le mot de passe
                </label>
                <div className="profile-input-wrapper">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="profile-password-confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    className="profile-password-toggle"
                    type="button"
                    aria-label={
                      showPasswordConfirmation
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    onClick={() =>
                      setShowPasswordConfirmation((visible) => !visible)
                    }
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode !== "forgot" && (
              <div className="profile-field">
                <label htmlFor="profile-password">Mot de passe</label>
                <div className="profile-input-wrapper">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="profile-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Votre mot de passe"
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
            )}

            {error && <p className="profile-form-error">{error}</p>}

            <button
              className="profile-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Veuillez patienter..."
                : mode === "login"
                  ? "Se connecter"
                  : mode === "register"
                    ? "Créer mon compte"
                    : "Envoyer le lien"}
            </button>

            {mode === "login" && (
              <button
                className="profile-forgot-link"
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                }}
              >
                Mot de passe oublié ?
              </button>
            )}
          </>
        )}
      </form>
    </section>
  );
}

export default ProfileLogin;
