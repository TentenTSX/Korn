import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import "./AddToCartButton.css";

type AddToCartButtonProps = {
  variantId?: number;
  stockQuantity?: number;
  label?: string;
};

function AddToCartButton({
  variantId,
  stockQuantity,
  label,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAvailable = Boolean(variantId && stockQuantity && stockQuantity > 0);

  const handleAdd = async () => {
    if (!variantId || !isAvailable) return;

    setError(null);
    setIsAdding(true);
    try {
      await addItem(variantId, 1);
      openCart();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Impossible d'ajouter cet article.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="add-to-cart-control">
      <button
        className="add-to-cart-button"
        type="button"
        disabled={!isAvailable || isAdding}
        onClick={handleAdd}
        aria-label={label ? `Ajouter au panier, ${label}` : "Ajouter au panier"}
        title={isAvailable ? "Ajouter au panier" : "Indisponible"}
      >
        <ShoppingBag size={16} aria-hidden="true" />
        <span>
          {isAdding
            ? "Ajout..."
            : isAvailable
              ? "Ajouter au panier"
              : "Indisponible"}
        </span>
      </button>
      {error && (
        <span className="add-to-cart-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default AddToCartButton;
