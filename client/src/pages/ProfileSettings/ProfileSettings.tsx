import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import type { User } from "../../types/auth";
import "./ProfileSettings.css";

const DELETE_CONFIRMATION_PHRASE = "SUPPRIMER";

type InfoFormProps = {
  user: User;
  onSubmit: (
    input: Pick<User, "first_name" | "last_name" | "email">,
  ) => Promise<void>;
};

function InfoForm({ user, onSubmit }: InfoFormProps) {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await onSubmit({
        first_name: firstName,
        last_name: lastName,
        email,
      });
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "La mise à jour a échoué.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="profile-settings-section" aria-labelledby="info-title">
      <h2 id="info-title">Mes informations</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-field">
          <label htmlFor="settings-first-name">Prénom</label>
          <div className="profile-input-wrapper">
            <input
              id="settings-first-name"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
        </div>
        <div className="profile-field">
          <label htmlFor="settings-last-name">Nom</label>
          <div className="profile-input-wrapper">
            <input
              id="settings-last-name"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>
        <div className="profile-field">
          <label htmlFor="settings-email">Adresse email</label>
          <div className="profile-input-wrapper">
            <input
              id="settings-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        {error && (
          <p className="profile-form-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <output className="profile-settings-success">
            Vos informations ont été mises à jour.
          </output>
        )}
        <button
          className="profile-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </section>
  );
}

type PasswordFormProps = {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
};

function PasswordForm({ onSubmit }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== newPasswordConfirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Le changement de mot de passe a échoué.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="profile-settings-section"
      aria-labelledby="password-title"
    >
      <h2 id="password-title">Mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-field">
          <label htmlFor="settings-current-password">Mot de passe actuel</label>
          <div className="profile-input-wrapper">
            <input
              id="settings-current-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <button
              className="profile-password-toggle"
              type="button"
              aria-label={
                showPasswords
                  ? "Masquer les mots de passe"
                  : "Afficher les mots de passe"
              }
              onClick={() => setShowPasswords((current) => !current)}
            >
              {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <div className="profile-field">
          <label htmlFor="settings-new-password">Nouveau mot de passe</label>
          <div className="profile-input-wrapper">
            <input
              id="settings-new-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
        </div>
        <div className="profile-field">
          <label htmlFor="settings-new-password-confirmation">
            Confirmer le nouveau mot de passe
          </label>
          <div className="profile-input-wrapper">
            <input
              id="settings-new-password-confirmation"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPasswordConfirmation}
              onChange={(event) =>
                setNewPasswordConfirmation(event.target.value)
              }
            />
          </div>
        </div>
        <p className="profile-settings-hint">
          Mot de passe oublié ?{" "}
          <Link to="/profile">
            Réinitialisez-le depuis la page de connexion.
          </Link>
        </p>
        {error && (
          <p className="profile-form-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <output className="profile-settings-success">
            Votre mot de passe a été changé.
          </output>
        )}
        <button
          className="profile-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Changer mon mot de passe"}
        </button>
      </form>
    </section>
  );
}

type DeleteAccountFormProps = {
  onSubmit: (confirmation: string) => Promise<void>;
};

function DeleteAccountForm({ onSubmit }: DeleteAccountFormProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (confirmation !== DELETE_CONFIRMATION_PHRASE) {
      setError(
        `Merci de saisir « ${DELETE_CONFIRMATION_PHRASE} » pour confirmer.`,
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(confirmation);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "La suppression du compte a échoué.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="profile-settings-section profile-settings-section-danger"
      aria-labelledby="delete-title"
    >
      <h2 id="delete-title">Supprimer mon compte</h2>
      <p>
        Cette action est définitive. Vos informations personnelles seront
        supprimées ; vos commandes passées sont conservées de façon anonyme pour
        les obligations légales de facturation. Conformément au RGPD, vous
        disposez d'un droit de suppression sur vos données personnelles.
      </p>
      {!isConfirming ? (
        <button
          className="profile-settings-danger-button"
          type="button"
          onClick={() => setIsConfirming(true)}
        >
          Supprimer mon compte
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="profile-field">
            <label htmlFor="settings-delete-confirmation">
              Saisissez « {DELETE_CONFIRMATION_PHRASE} » pour confirmer
            </label>
            <div className="profile-input-wrapper">
              <input
                id="settings-delete-confirmation"
                type="text"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="profile-form-error" role="alert">
              {error}
            </p>
          )}
          <div className="profile-settings-danger-actions">
            <button
              className="profile-secondary-button"
              type="button"
              onClick={() => {
                setIsConfirming(false);
                setConfirmation("");
                setError(null);
              }}
            >
              Annuler
            </button>
            <button
              className="profile-settings-danger-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Confirmer la suppression"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function ProfileSettings() {
  const navigate = useNavigate();
  const {
    user,
    isLoading: isAuthLoading,
    updateProfile,
    changePassword,
    deleteAccount,
  } = useAuthContext();
  useDocumentHead({
    title: "Mes informations",
    description:
      "Modifiez vos informations, votre mot de passe ou supprimez votre compte Korn.",
  });

  useEffect(() => {
    if (!isAuthLoading && !user) navigate("/profile", { replace: true });
  }, [isAuthLoading, navigate, user]);

  if (isAuthLoading || !user) return <main />;

  return (
    <main className="profile-settings-page">
      <Link className="profile-settings-back" to="/profile/dashboard">
        ← Retour à mon espace
      </Link>
      <span className="profile-eyebrow">Mon espace</span>
      <h1>Mes informations</h1>

      <div className="profile-settings-sections">
        <InfoForm user={user} onSubmit={updateProfile} />
        <PasswordForm onSubmit={changePassword} />
        <DeleteAccountForm
          onSubmit={async (confirmation) => {
            await deleteAccount(confirmation);
            navigate("/");
          }}
        />
      </div>
    </main>
  );
}

export default ProfileSettings;
