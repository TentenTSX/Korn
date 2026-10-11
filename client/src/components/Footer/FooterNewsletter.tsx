import { useState } from "react";
import type { FormEvent } from "react";
import { useNewsletterSubscribe } from "../../hooks/useNewsletterSubscribe";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const { status, error, subscribe } = useNewsletterSubscribe();

  const handleSubscribe = async (event: FormEvent) => {
    event.preventDefault();
    const success = await subscribe(email);
    if (success) setEmail("");
  };

  return (
    <div className="site-footer-newsletter">
      <div className="newsletter-header">
        <span className="newsletter-letter">K</span>
        <h2>REJOIGNEZ LA COMMUNAUTÉ</h2>
      </div>

      <p className="newsletter-copy">
        Accédez en avant-première aux nouvelles collections, drops exclusifs et
        offres membres.
      </p>

      {status === "done" ? (
        <output className="newsletter-success">
          Merci ! Vérifiez votre boîte mail.
        </output>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <label className="sr-only" htmlFor="newsletter-email">
            Votre adresse email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="VOTRE ADRESSE EMAIL"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Inscription..." : "S'INSCRIRE"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="newsletter-error" role="alert">
          {error}
        </p>
      )}

      <p className="newsletter-note">
        Pas de spam. Désinscription à tout moment.
      </p>
    </div>
  );
}

export default FooterNewsletter;
