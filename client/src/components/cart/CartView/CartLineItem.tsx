import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../../types/cart";
import { currency } from "../../../utils/currency";

type CartLineItemProps = {
  item: CartItem;
  isBusy: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

function CartLineItem({
  item,
  isBusy,
  onIncrement,
  onDecrement,
  onRemove,
}: CartLineItemProps) {
  return (
    <article className="cart-view-item">
      {item.image ? (
        <img src={item.image} alt={item.name} />
      ) : (
        <div className="cart-item-image-placeholder" />
      )}
      <div className="cart-item-details">
        <h2>{item.name}</h2>
        <p>{[item.color, item.size].filter(Boolean).join(" · ")}</p>
        <div
          className="cart-quantity-control"
          aria-label={`Quantité de ${item.name}`}
        >
          <button
            type="button"
            aria-label="Diminuer la quantité"
            title="Diminuer"
            disabled={item.quantity <= 1 || isBusy}
            onClick={onDecrement}
          >
            <Minus size={14} />
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            aria-label="Augmenter la quantité"
            title="Augmenter"
            disabled={item.quantity >= item.stock_quantity || isBusy}
            onClick={onIncrement}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="cart-item-total">
        <strong>
          {currency.format(Number(item.price_unit) * item.quantity)}
        </strong>
        <button
          className="cart-icon-button cart-remove-button"
          type="button"
          aria-label={`Supprimer ${item.name} du panier`}
          title="Supprimer"
          disabled={isBusy}
          onClick={onRemove}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

export default CartLineItem;
