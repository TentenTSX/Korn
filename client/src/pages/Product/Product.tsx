import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import AddToCartButton from "../../components/cart/AddToCartButton";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { useProduct } from "../../hooks/useProduct";
import { COLOR_SWATCHES } from "../../utils/colorSwatches";
import { currency as money } from "../../utils/currency";
import "./Product.css";

function formatHeight(heightCm: number) {
  return `${Math.floor(heightCm / 100)}m${String(heightCm % 100).padStart(2, "0")}`;
}

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

  const gallery = useMemo(() => {
    if (activeVariant?.gallery?.length) return activeVariant.gallery;
    return activeVariant?.image ? [activeVariant.image] : [];
  }, [activeVariant]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryColor, setGalleryColor] = useState(activeColor);
  if (activeColor !== galleryColor) {
    setGalleryColor(activeColor);
    setActiveImageIndex(0);
  }

  const displayedImage = gallery[activeImageIndex] ?? activeVariant?.image;

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
        {displayedImage && (
          <img
            src={displayedImage}
            alt={activeVariant.alt_text ?? activeVariant.name}
          />
        )}
        {gallery.length > 1 && (
          <div className="product-page-thumbnails">
            {gallery.map((url, index) => (
              <button
                key={url}
                type="button"
                className={
                  index === activeImageIndex
                    ? "product-page-thumbnail product-page-thumbnail-active"
                    : "product-page-thumbnail"
                }
                aria-label={`Voir la photo ${index + 1}`}
                aria-pressed={index === activeImageIndex}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={url} alt="" />
              </button>
            ))}
          </div>
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

        {(activeVariant.material || activeVariant.model_height_cm) && (
          <div className="product-page-details">
            {activeVariant.material && (
              <p>
                <strong>Matière :</strong> {activeVariant.material}
              </p>
            )}
            {activeVariant.model_height_cm && (
              <p>
                Le mannequin mesure{" "}
                {formatHeight(activeVariant.model_height_cm)}
                {activeVariant.model_size_worn &&
                  ` et porte une taille ${activeVariant.model_size_worn}`}
                .
              </p>
            )}
          </div>
        )}

        <Link className="product-page-back" to="/collection">
          ← Retour au catalogue
        </Link>
      </div>
    </main>
  );
}

export default Product;
