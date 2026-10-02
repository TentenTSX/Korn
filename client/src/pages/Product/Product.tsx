import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import AddToCartButton from "../../components/cart/AddToCartButton";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { useProduct } from "../../hooks/useProduct";
import { currency as money } from "../../utils/currency";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const productId = id ? Number(id) : null;
  const { variants, isLoading, error } = useProduct(
    productId && Number.isInteger(productId) ? productId : null,
  );
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  const activeVariant = useMemo(() => {
    const selected = variants.find(
      (variant) => variant.id_variant === selectedVariantId,
    );
    return selected ?? variants[0];
  }, [variants, selectedVariantId]);

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

        {variants.length > 1 && (
          <fieldset className="product-page-variants">
            <legend>Choisir une variante</legend>
            {variants.map((variant) => (
              <button
                key={variant.id_variant ?? undefined}
                type="button"
                className={
                  variant.id_variant === activeVariant.id_variant
                    ? "product-page-variant product-page-variant-active"
                    : "product-page-variant"
                }
                disabled={!variant.id_variant || variant.stock_quantity <= 0}
                onClick={() => setSelectedVariantId(variant.id_variant)}
              >
                {[variant.color, variant.size].filter(Boolean).join(" · ") ||
                  "Standard"}
              </button>
            ))}
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
