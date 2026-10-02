import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useCartContext } from "../../contexts/CartContext";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { apiRequest } from "../../services/api";
import type { ShippingInput, StripeCheckoutStatus } from "../../types/cart";
import CheckoutConfirmation from "./CheckoutConfirmation";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useDocumentHead({
    title: "Commande",
    description: "Finalisez votre commande Korn en toute sécurité avec Stripe.",
  });
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
        <CheckoutConfirmation
          paymentResult={paymentResult}
          isLoggedIn={!!user}
          userFirstName={user?.first_name}
        />
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

          <CheckoutForm
            shipping={shipping}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isPaymentCancelled={isPaymentCancelled}
            error={error}
            total={total}
          />
        </section>

        <CheckoutSummary items={items} total={total} />
      </div>
    </main>
  );
}

export default Checkout;
