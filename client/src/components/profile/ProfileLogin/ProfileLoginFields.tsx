import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import type { ProfileMode } from "./ProfileLogin";

type ProfileLoginFieldsProps = {
  mode: ProfileMode;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  showPassword: boolean;
  showPasswordConfirmation: boolean;
  error: string;
  isSubmitting: boolean;
  resetRequested: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmationChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onToggleShowPasswordConfirmation: () => void;
  onForgotPassword: () => void;
};

function ProfileLoginFields({
  mode,
  firstName,
  lastName,
  email,
  password,
  passwordConfirmation,
  showPassword,
  showPasswordConfirmation,
  error,
  isSubmitting,
  resetRequested,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmationChange,
  onToggleShowPassword,
  onToggleShowPasswordConfirmation,
  onForgotPassword,
}: ProfileLoginFieldsProps) {
  if (mode === "forgot" && resetRequested) {
    return (
      <output className="profile-forgot-success">
        Si un compte existe avec cet email, un lien de réinitialisation vient
        d'être envoyé.
      </output>
    );
  }

  return (
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
                onChange={(event) => onFirstNameChange(event.target.value)}
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
                onChange={(event) => onLastNameChange(event.target.value)}
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
            onChange={(event) => onEmailChange(event.target.value)}
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
                onPasswordConfirmationChange(event.target.value)
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
              onClick={onToggleShowPasswordConfirmation}
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
              onChange={(event) => onPasswordChange(event.target.value)}
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
              onClick={onToggleShowPassword}
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
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
      )}

      <div className="profile-divider">
        <span>ou</span>
      </div>

      <a className="profile-google-button" href="/api/auth/google">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
        Continuer avec Google
      </a>
    </>
  );
}

export default ProfileLoginFields;
