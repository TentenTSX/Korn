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
    </>
  );
}

export default ProfileLoginFields;
