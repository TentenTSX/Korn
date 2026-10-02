import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useCartContext } from "../../contexts/CartContext";
import type { ShippingInput, StripeCheckoutStatus } from "../../hooks/useCart";
import { apiRequest } from "../../services/api";
import "./Checkout.css";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    user,
    isAuthLoading,
    items,
    isLoading,
    error: cartError,
    checkout,
  } = useCartContext();
  const stripeSessionId = searchParams.get("session_id");
  const isPaymentCancelled = searchParams.get("cancelled") === "1";
  const [shipping, setShipping] = useState<ShippingInput>({
    customer_email: "",
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    shipping_country: "France",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] =
    useState<StripeCheckoutStatus | null>(null);
  const total = items.reduce(
    (sum, item) => sum + Number(item.price_unit) * item.quantity,
    0,
  );

  useEffect(() => {
    if (!user) return;
    setShipping((current) => ({
      ...current,
      customer_email: current.customer_email || user.email,
      shipping_first_name: current.shipping_first_name || user.first_name,
      shipping_last_name: current.shipping_last_name || user.last_name,
    }));
  }, [user]);

  useEffect(() => {
    if (!stripeSessionId) return;
    let isCurrent = true;
    setIsCheckingPayment(true);
    setError(null);
    apiRequest<StripeCheckoutStatus>(
      `/api/payments/stripe/session?session_id=${encodeURIComponent(stripeSessionId)}`,
    )
      .then((result) => {
        if (isCurrent) setPaymentResult(result);
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Impossible de vérifier le paiement.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsCheckingPayment(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [stripeSessionId]);

  const handleChange =
    (field: keyof ShippingInput) => (event: ChangeEvent<HTMLInputElement>) => {
      setShipping((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await checkout(shipping);
      window.location.assign(session.url);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "La commande n'a pas pu être enregistrée.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading || isCheckingPayment) {
    return (
      <main className="checkout-page">
        <p>Chargement de votre commande...</p>
      </main>
    );
  }

  if (stripeSessionId && !paymentResult && !error) {
    return (
      <main className="checkout-page">
        <p>Vérification du paiement Stripe...</p>
      </main>
    );
  }

  if (paymentResult) {
    return (
      <main className="checkout-page">
        <section
          className="checkout-confirmation"
          aria-labelledby="checkout-title"
        >
          <span className="checkout-kicker">
            {paymentResult.paymentStatus === "paid"
              ? "Paiement confirmé"
              : "Paiement en cours"}
          </span>
          <h1 id="checkout-title">
            Merci{user ? `, ${user.first_name}` : ""}.
          </h1>
          <p>
            Commande <strong>#{paymentResult.orderId}</strong>.
          </p>
          <p className="checkout-payment-note">
            {paymentResult.paymentStatus === "paid"
              ? "Stripe a confirmé le paiement. Un reçu sera envoyé par email."
              : "Stripe traite encore votre paiement. Votre commande sera mise à jour dès confirmation."}
          </p>
          <strong className="checkout-confirmation-total">
            {currency.format(paymentResult.totalPrice)}
          </strong>
          <div className="checkout-confirmation-actions">
            {user && (
              <Link className="checkout-primary-link" to="/profile/dashboard">
                Voir mes commandes
              </Link>
            )}
            <Link className="checkout-secondary-link" to="/collection">
              Continuer mes achats
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cartError && items.length === 0) {
    return (
      <main className="checkout-page">
        <p className="checkout-error" role="alert">
          {cartError}
        </p>
      </main>
    );
  }

  if (error && stripeSessionId) {
    return (
      <main className="checkout-page">
        <p className="checkout-error" role="alert">
          {error}
        </p>
        <Link className="checkout-secondary-link" to="/collection">
          Continuer mes achats
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page checkout-empty">
        <h1>Votre panier est vide.</h1>
        <Link className="checkout-primary-link" to="/collection">
          Découvrir la collection
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link to="/collection" aria-label="Retour à la collection">
          Korn
        </Link>
        <span>Commande sécurisée</span>
      </header>

      <div className="checkout-layout">
        <section
          className="checkout-form-section"
          aria-labelledby="checkout-title"
        >
          <button
            className="checkout-back-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            Retour au panier
          </button>
          <span className="checkout-kicker">Votre commande</span>
          <h1 id="checkout-title">Livraison et paiement</h1>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Contact et adresse de livraison</legend>
              <div className="checkout-field-grid">
                <label className="checkout-field-wide">
                  Email de confirmation
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={shipping.customer_email}
                    onChange={handleChange("customer_email")}
                  />
                </label>
                <label>
                  Prénom
                  <input
                    required
                    autoComplete="given-name"
                    value={shipping.shipping_first_name}
                    onChange={handleChange("shipping_first_name")}
                  />
                </label>
                <label>
                  Nom
                  <input
                    required
                    autoComplete="family-name"
                    value={shipping.shipping_last_name}
                    onChange={handleChange("shipping_last_name")}
                  />
                </label>
                <label className="checkout-field-wide">
                  Adresse
                  <input
                    required
                    autoComplete="street-address"
                    value={shipping.shipping_address}
                    onChange={handleChange("shipping_address")}
                  />
                </label>
                <label>
                  Ville
                  <input
                    required
                    autoComplete="address-level2"
                    value={shipping.shipping_city}
                    onChange={handleChange("shipping_city")}
                  />
                </label>
                <label>
                  Code postal
                  <input
                    required
                    autoComplete="postal-code"
                    value={shipping.shipping_postal_code}
                    onChange={handleChange("shipping_postal_code")}
                  />
                </label>
                <label className="checkout-field-wide">
                  Pays
                  <input
                    required
                    autoComplete="country-name"
                    value={shipping.shipping_country}
                    onChange={handleChange("shipping_country")}
                  />
                </label>
              </div>
            </fieldset>

            <section
              className="checkout-payment-section"
              aria-labelledby="payment-title"
            >
              <h2 id="payment-title">Paiement</h2>
              <p>
                Vous serez redirigé vers la page sécurisée de Stripe pour payer
                par carte.
              </p>
            </section>

            {isPaymentCancelled && (
              <output className="checkout-payment-note">
                Le paiement a été annulé. Votre panier est conservé.
              </output>
            )}
            {error && (
              <p className="checkout-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="checkout-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Ouverture de Stripe..."
                : `Payer avec Stripe · ${currency.format(total)}`}
            </button>
          </form>
        </section>

        <aside className="checkout-summary" aria-labelledby="summary-title">
          <h2 id="summary-title">
            Récapitulatif <span>({items.length})</span>
          </h2>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <article
                className="checkout-summary-item"
                key={item.id_cart_item}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="checkout-image-placeholder" />
                )}
                <div>
                  <h3>{item.name}</h3>
                  <p>{[item.color, item.size].filter(Boolean).join(" · ")}</p>
                  <p>Quantité : {item.quantity}</p>
                </div>
                <strong>
                  {currency.format(Number(item.price_unit) * item.quantity)}
                </strong>
              </article>
            ))}
          </div>
          <div className="checkout-summary-total">
            <span>Total produits</span>
            <strong>{currency.format(total)}</strong>
          </div>
          <p className="checkout-summary-footnote">
            Les frais de livraison seront précisés avant la mise en place du
            paiement.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
