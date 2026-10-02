import type { ProfileMode } from "./ProfileLogin";

type ProfileModeTabsProps = {
  mode: ProfileMode;
  onChangeMode: (mode: ProfileMode) => void;
};

function ProfileModeTabs({ mode, onChangeMode }: ProfileModeTabsProps) {
  if (mode === "forgot") {
    return (
      <button
        className="profile-forgot-back"
        type="button"
        onClick={() => onChangeMode("login")}
      >
        ← Retour à la connexion
      </button>
    );
  }

  return (
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
        onClick={() => onChangeMode("login")}
      >
        Connexion
      </button>
      <button
        className={mode === "register" ? "is-active" : ""}
        type="button"
        role="tab"
        aria-selected={mode === "register"}
        onClick={() => onChangeMode("register")}
      >
        Inscription
      </button>
    </div>
  );
}

export default ProfileModeTabs;
