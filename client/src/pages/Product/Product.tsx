import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import AddToCartButton from "../../components/cart/AddToCartButton";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { useProduct } from "../../hooks/useProduct";
import { currency as money } from "../../utils/currency";
import "./Product.css";

const COLOR_SWATCHES: Record<string, string> = {
  Noir: "#191817",
  Blanc: "#f7f5f1",
  Gris: "#9a9a9a",
  "Bleu Marine": "#1b2a4a",
  "Bleu Roi": "#2a4bd7",
  Bordeaux: "#6d1f2a",
  Vert: "#2f6b4f",
  Rose: "#e8a0b4",
  Lilas: "#b9a6d9",
  Moka: "#8a6a52",
  Rouge: "#c62828",
};

function Product() {
  const { id } = useParams();
  const productId = id ? Number(id) : null;
  const { variants, isLoading, error } = useProduct(
    productId && Number.isInteger(productId) ? productId : null,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const colors = useMemo(() => {
    const seen = new Set<string>();
    return variants
      .map((variant) => variant.color)
      .filter((color): color is string => {
        if (!color || seen.has(color)) return false;
        seen.add(color);
        return true;
      });
  }, [variants]);

  const activeColor =
    selectedColor && colors.includes(selectedColor)
      ? selectedColor
      : (colors[0] ?? null);

  const sizesForColor = useMemo(
    () => variants.filter((variant) => variant.color === activeColor),
    [variants, activeColor],
  );

  const activeVariant = useMemo(() => {
    const bySize = sizesForColor.find(
      (variant) => variant.size === selectedSize,
    );
    return bySize ?? sizesForColor[0] ?? variants[0];
  }, [sizesForColor, selectedSize, variants]);

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    const sizeStillAvailable = variants.some(
      (variant) => variant.color === color && variant.size === selectedSize,
    );
    if (!sizeStillAvailable) setSelectedSize(null);
  };

  useDocumentHead({
    title: activeVariant?.name ?? "Produit",
    description: activeVariant?.description ?? "Découvrez ce produit Korn.",
  });

  if (!productId || !Number.isInteger(productId)) {
    return (
      <main className="product-page">
        <p role="alert">Produit introuvable.</p>
      </main>
    );
  }

  if (isLoading) return <main className="product-page" />;

  if (error || !activeVariant) {
    return (
      <main className="product-page">
        <p role="alert">{error ?? "Produit introuvable."}</p>
        <Link to="/collection">Retour au catalogue</Link>
      </main>
    );
  }

  return (
    <main className="product-page">
      <div className="product-page-image">
        {activeVariant.image && (
          <img
            src={activeVariant.image}
            alt={activeVariant.alt_text ?? activeVariant.name}
          />
        )}
      </div>
      <div className="product-page-info">
        <span className="product-page-eyebrow">
          {activeVariant.category_name ?? "Korn"}
        </span>
        <h1>{activeVariant.name}</h1>
        {activeVariant.description && <p>{activeVariant.description}</p>}
        <strong className="product-page-price">
          {money.format(activeVariant.price)}
        </strong>

        {colors.length > 1 && (
          <fieldset className="product-page-colors">
            <legend>Couleur · {activeColor}</legend>
            <div className="product-page-color-pins">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={
                    color === activeColor
                      ? "product-color-pin product-color-pin-active"
                      : "product-color-pin"
                  }
                  style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#ccc" }}
                  aria-label={color}
                  aria-pressed={color === activeColor}
                  title={color}
                  onClick={() => handleSelectColor(color)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {sizesForColor.length > 1 && (
          <fieldset className="product-page-sizes">
            <legend>Taille</legend>
            <div className="product-page-size-options">
              {sizesForColor.map((variant) => (
                <button
                  key={variant.id_variant ?? undefined}
                  type="button"
                  className={
                    variant.id_variant === activeVariant.id_variant
                      ? "product-size-button product-size-button-active"
                      : "product-size-button"
                  }
                  disabled={!variant.id_variant || variant.stock_quantity <= 0}
                  onClick={() => variant.size && setSelectedSize(variant.size)}
                >
                  {variant.size ?? "Unique"}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <AddToCartButton
          variantId={activeVariant.id_variant ?? undefined}
          stockQuantity={activeVariant.stock_quantity}
          label={activeVariant.name}
        />

        <Link className="product-page-back" to="/collection">
          ← Retour au catalogue
        </Link>
      </div>
    </main>
  );
}

export default Product;
