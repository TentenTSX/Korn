import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import "./ProfileLogin.css";

type ProfileLoginProps = {
  onLogin: (email: string) => void;
};

type ProfileMode = "login" | "register";

function ProfileLogin({ onLogin }: ProfileLoginProps) {
  const [mode, setMode] = useState<ProfileMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password || (mode === "register" && !passwordConfirmation)) {
      setError("Renseignez tous les champs obligatoires.");
      return;
    }

    if (mode === "register" && password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    onLogin(email);
  };

  return (
    <section className="profile-login" aria-labelledby="profile-login-title">
      <div className="profile-login-intro">
        <span className="profile-eyebrow">Espace personnel</span>
        <h1 id="profile-login-title">Bienvenue chez Korn.</h1>
        <p>
          {mode === "login"
            ? "Connectez-vous pour retrouver vos commandes, vos factures et vos informations personnelles."
            : "Créez votre espace Korn pour suivre vos commandes et retrouver vos factures."}
        </p>
      </div>

      <form className="profile-login-form" onSubmit={handleSubmit}>
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

        {error && <p className="profile-form-error">{error}</p>}

        <button className="profile-submit-button" type="submit">
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        {mode === "login" && (
          <a className="profile-forgot-link" href="/profile">
            Mot de passe oublié ?
          </a>
        )}
      </form>
    </section>
  );
}

export default ProfileLogin;
