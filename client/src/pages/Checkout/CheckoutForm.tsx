import type { ChangeEvent, FormEvent } from "react";
import type { ShippingInput } from "../../types/cart";
import { currency } from "../../utils/currency";

type CheckoutFormProps = {
  shipping: ShippingInput;
  onChange: (
    field: keyof ShippingInput,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isPaymentCancelled: boolean;
  error: string | null;
  total: number;
};

function CheckoutForm({
  shipping,
  onChange,
  onSubmit,
  isSubmitting,
  isPaymentCancelled,
  error,
  total,
}: CheckoutFormProps) {
  return (
    <form className="checkout-form" onSubmit={onSubmit}>
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
              onChange={onChange("customer_email")}
            />
          </label>
          <label>
            Prénom
            <input
              required
              autoComplete="given-name"
              value={shipping.shipping_first_name}
              onChange={onChange("shipping_first_name")}
            />
          </label>
          <label>
            Nom
            <input
              required
              autoComplete="family-name"
              value={shipping.shipping_last_name}
              onChange={onChange("shipping_last_name")}
            />
          </label>
          <label className="checkout-field-wide">
            Adresse
            <input
              required
              autoComplete="street-address"
              value={shipping.shipping_address}
              onChange={onChange("shipping_address")}
            />
          </label>
          <label>
            Ville
            <input
              required
              autoComplete="address-level2"
              value={shipping.shipping_city}
              onChange={onChange("shipping_city")}
            />
          </label>
          <label>
            Code postal
            <input
              required
              autoComplete="postal-code"
              value={shipping.shipping_postal_code}
              onChange={onChange("shipping_postal_code")}
            />
          </label>
          <label className="checkout-field-wide">
            Pays
            <input
              required
              autoComplete="country-name"
              value={shipping.shipping_country}
              onChange={onChange("shipping_country")}
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
          Vous serez redirigé vers la page sécurisée de Stripe pour payer par
          carte.
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
  );
}

export default CheckoutForm;
