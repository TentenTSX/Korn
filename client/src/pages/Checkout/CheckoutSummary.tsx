import type { CartItem } from "../../types/cart";
import { currency } from "../../utils/currency";

type CheckoutSummaryProps = {
  items: CartItem[];
  subtotal: number;
  shippingFee: number | null;
};

function CheckoutSummary({
  items,
  subtotal,
  shippingFee,
}: CheckoutSummaryProps) {
  return (
    <aside className="checkout-summary" aria-labelledby="summary-title">
      <h2 id="summary-title">
        Récapitulatif <span>({items.length})</span>
      </h2>
      <div className="checkout-summary-items">
        {items.map((item) => (
          <article className="checkout-summary-item" key={item.id_cart_item}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                width={1920}
                height={2862}
                loading="lazy"
              />
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
      <div className="checkout-summary-lines">
        <div className="checkout-summary-line">
          <span>Sous-total produits</span>
          <strong>{currency.format(subtotal)}</strong>
        </div>
        <div className="checkout-summary-line">
          <span>Frais de livraison</span>
          <strong>
            {shippingFee !== null ? currency.format(shippingFee) : "…"}
          </strong>
        </div>
      </div>
      <div className="checkout-summary-total">
        <span>Total</span>
        <strong>{currency.format(subtotal + (shippingFee ?? 0))}</strong>
      </div>
    </aside>
  );
}

export default CheckoutSummary;
