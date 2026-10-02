import { Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartContext } from "../../../contexts/CartContext";
import "./CartView.css";

type CartViewProps = {
  onClose: () => void;
  onCheckout: () => void;
  asPage?: boolean;
};

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function CartView({ onClose, onCheckout, asPage = false }: CartViewProps) {
  const {
    user,
    isAuthLoading,
    items,
    isLoading,
    error,
    updateItem,
    removeItem,
  } = useCartContext();
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const total = items.reduce(
    (sum, item) => sum + Number(item.price_unit) * item.quantity,
    0,
  );

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
              <article className="cart-view-item" key={item.id_cart_item}>
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
                      disabled={
                        item.quantity <= 1 || busyItemId === item.id_cart_item
                      }
                      onClick={() =>
                        void changeQuantity(
                          item.id_cart_item,
                          item.quantity - 1,
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      title="Augmenter"
                      disabled={
                        item.quantity >= item.stock_quantity ||
                        busyItemId === item.id_cart_item
                      }
                      onClick={() =>
                        void changeQuantity(
                          item.id_cart_item,
                          item.quantity + 1,
                        )
                      }
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
                    disabled={busyItemId === item.id_cart_item}
                    onClick={() => void deleteItem(item.id_cart_item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
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
