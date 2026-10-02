import type { CartItem } from "../../types/cart";
import { currency } from "../../utils/currency";

type CheckoutSummaryProps = {
  items: CartItem[];
  total: number;
};

function CheckoutSummary({ items, total }: CheckoutSummaryProps) {
  return (
    <aside className="checkout-summary" aria-labelledby="summary-title">
      <h2 id="summary-title">
        Récapitulatif <span>({items.length})</span>
      </h2>
      <div className="checkout-summary-items">
        {items.map((item) => (
          <article className="checkout-summary-item" key={item.id_cart_item}>
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
  );
}

export default CheckoutSummary;
