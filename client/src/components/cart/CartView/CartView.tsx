import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useCartContext } from "../../../contexts/CartContext";
import { usePromoCode } from "../../../hooks/usePromoCode";
import { currency } from "../../../utils/currency";
import CartLineItem from "./CartLineItem";
import "./CartView.css";

type CartViewProps = {
  onClose: () => void;
  onCheckout: () => void;
  asPage?: boolean;
};

function CartView({ onClose, onCheckout, asPage = false }: CartViewProps) {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { items, isLoading, error, updateItem, removeItem, refresh } =
    useCartContext();
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const promo = usePromoCode();
  const total = items.reduce(
    (sum, item) => sum + Number(item.price_unit) * item.quantity,
    0,
  );

  const handleApplyPromoCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    const success = await promo.applyCode(promoInput.trim());
    setIsApplyingPromo(false);
    if (success) {
      setPromoInput("");
      await refresh();
    }
  };

  const handleRemovePromoCode = async () => {
    await promo.removeCode();
    await refresh();
  };

  useEffect(() => {
    if (asPage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [asPage, onClose]);

  const changeQuantity = async (itemId: number, quantity: number) => {
    setActionError(null);
    setBusyItemId(itemId);
    try {
      await updateItem(itemId, quantity);
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : "Impossible de modifier la quantité.",
      );
    } finally {
      setBusyItemId(null);
    }
  };

  const deleteItem = async (itemId: number) => {
    setActionError(null);
    setBusyItemId(itemId);
    try {
      await removeItem(itemId);
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : "Impossible de supprimer cet article.",
      );
    } finally {
      setBusyItemId(null);
    }
  };

  const panelContent = (
    <>
      <header className="cart-modal-header">
        <div>
          <span className="cart-view-eyebrow">Votre sélection</span>
          <h1 id="cart-title">
            Panier <span>({items.length})</span>
          </h1>
        </div>
        {!asPage && (
          <button
            className="cart-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Fermer le panier"
            title="Fermer"
          >
            <X size={20} />
          </button>
        )}
      </header>

      <div className="cart-modal-body">
        {isAuthLoading || isLoading ? (
          <p>Chargement de votre panier...</p>
        ) : error ? (
          <p className="cart-message-error" role="alert">
            {error}
          </p>
        ) : items.length === 0 ? (
          <div className="cart-empty-state">
            <p>Votre panier est actuellement vide.</p>
            <button
              className="cart-secondary-button"
              type="button"
              onClick={onClose}
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          <div className="cart-view-items">
            {items.map((item) => (
              <CartLineItem
                key={item.id_cart_item}
                item={item}
                isBusy={busyItemId === item.id_cart_item}
                onIncrement={() =>
                  void changeQuantity(item.id_cart_item, item.quantity + 1)
                }
                onDecrement={() =>
                  void changeQuantity(item.id_cart_item, item.quantity - 1)
                }
                onRemove={() => void deleteItem(item.id_cart_item)}
              />
            ))}
          </div>
        )}
        {(actionError || error) && (
          <p className="cart-message-error" role="alert">
            {actionError ?? error}
          </p>
        )}
      </div>

      {items.length > 0 && (
        <footer className="cart-modal-footer">
          <div className="cart-promo-code">
            {promo.code ? (
              <div className="cart-promo-code-applied">
                <span>
                  Code <strong>{promo.code}</strong> appliqué (-
                  {promo.discountPercent}%)
                </span>
                <button
                  type="button"
                  onClick={() => void handleRemovePromoCode()}
                >
                  Retirer
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromoCode}>
                <label className="sr-only" htmlFor="cart-promo-input">
                  Code promo
                </label>
                <input
                  id="cart-promo-input"
                  type="text"
                  placeholder="Code promo"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                />
                <button type="submit" disabled={isApplyingPromo}>
                  {isApplyingPromo ? "..." : "Appliquer"}
                </button>
              </form>
            )}
            {promo.error && (
              <p className="cart-message-error" role="alert">
                {promo.error}
              </p>
            )}
          </div>
          <div className="cart-subtotal">
            <span>Sous-total</span>
            <strong>{currency.format(total)}</strong>
          </div>
          <p>
            {user
              ? "Livraison et paiement calculés à l’étape suivante."
              : "Votre panier invité est conservé dans ce navigateur."}
          </p>
          <button
            className="cart-checkout-button"
            type="button"
            onClick={onCheckout}
          >
            Passer au paiement
          </button>
        </footer>
      )}
    </>
  );

  if (asPage) {
    return (
      <main className="cart-page">
        <div className="cart-page-panel">{panelContent}</div>
      </main>
    );
  }

  return (
    <div className="cart-modal-backdrop" onMouseDown={onClose}>
      <dialog
        open
        className="cart-modal-panel"
        aria-modal="true"
        aria-labelledby="cart-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {panelContent}
      </dialog>
    </div>
  );
}

export default CartView;
