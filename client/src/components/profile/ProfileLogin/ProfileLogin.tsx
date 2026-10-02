import { useState } from "react";
import type { FormEvent } from "react";
import ProfileLoginFields from "./ProfileLoginFields";
import ProfileModeTabs from "./ProfileModeTabs";
import "./ProfileLogin.css";

export type ProfileMode = "login" | "register" | "forgot";

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

  const handleChangeMode = (nextMode: ProfileMode) => {
    setMode(nextMode);
    setError("");
    setResetRequested(false);
  };

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
        <ProfileModeTabs mode={mode} onChangeMode={handleChangeMode} />

        <ProfileLoginFields
          mode={mode}
          firstName={firstName}
          lastName={lastName}
          email={email}
          password={password}
          passwordConfirmation={passwordConfirmation}
          showPassword={showPassword}
          showPasswordConfirmation={showPasswordConfirmation}
          error={error}
          isSubmitting={isSubmitting}
          resetRequested={resetRequested}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onPasswordConfirmationChange={setPasswordConfirmation}
          onToggleShowPassword={() => setShowPassword((visible) => !visible)}
          onToggleShowPasswordConfirmation={() =>
            setShowPasswordConfirmation((visible) => !visible)
          }
          onForgotPassword={() => handleChangeMode("forgot")}
        />
      </form>
    </section>
  );
}

export default ProfileLogin;
