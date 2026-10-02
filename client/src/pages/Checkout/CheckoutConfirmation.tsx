import { Link } from "react-router";
import type { StripeCheckoutStatus } from "../../types/cart";
import { currency } from "../../utils/currency";

type CheckoutConfirmationProps = {
  paymentResult: StripeCheckoutStatus;
  isLoggedIn: boolean;
  userFirstName?: string;
};

function CheckoutConfirmation({
  paymentResult,
  isLoggedIn,
  userFirstName,
}: CheckoutConfirmationProps) {
  return (
    <section className="checkout-confirmation" aria-labelledby="checkout-title">
      <span className="checkout-kicker">
        {paymentResult.paymentStatus === "paid"
          ? "Paiement confirmé"
          : "Paiement en cours"}
      </span>
      <h1 id="checkout-title">
        Merci{isLoggedIn ? `, ${userFirstName ?? ""}` : ""}.
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
        {isLoggedIn && (
          <Link className="checkout-primary-link" to="/profile/dashboard">
            Voir mes commandes
          </Link>
        )}
        <Link className="checkout-secondary-link" to="/collection">
          Continuer mes achats
        </Link>
      </div>
    </section>
  );
}

export default CheckoutConfirmation;
