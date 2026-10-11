import { Link } from "react-router";
import { COLOR_SWATCHES } from "../../../utils/colorSwatches";
import { focalPointStyle } from "../../../utils/focalPoint";
import AddToCartButton from "../../cart/AddToCartButton";
import "./CatalogueProductCard.css";

type CatalogueProductCardProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  alt: string;
  focalPoint?: string | null;
  variantId?: number | null;
  productId?: number | null;
  size?: string | null;
  color?: string | null;
  colors?: string[];
  stockQuantity?: number;
};

function CatalogueProductCard({
  name,
  category,
  price,
  badge,
  image,
  alt,
  focalPoint,
  variantId,
  productId,
  size,
  color,
  colors,
  stockQuantity,
}: CatalogueProductCardProps) {
  return (
    <article className="catalogue-product-card">
      <Link
        className="catalogue-product-card-image"
        to={productId ? `/product/${productId}` : "/collection"}
      >
        {image && (
          <img
            src={image}
            alt={alt}
            style={focalPointStyle(focalPoint)}
            width={1920}
            height={2862}
            loading="lazy"
          />
        )}
        {badge && <span className="catalogue-product-card-badge">{badge}</span>}
      </Link>
      <div className="catalogue-product-card-info">
        <div>
          <h2>{name}</h2>
          <p>{category}</p>
          {(size || color) && (
            <p>{[color, size].filter(Boolean).join(" · ")}</p>
          )}
          {colors && colors.length > 1 && (
            <div
              className="catalogue-product-card-colors"
              aria-label={`Coloris disponibles : ${colors.join(", ")}`}
            >
              {colors.map((c) => (
                <span
                  key={c}
                  className="catalogue-color-pin"
                  style={{ backgroundColor: COLOR_SWATCHES[c] ?? "#ccc" }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>
        <strong>{price}</strong>
      </div>
      <AddToCartButton
        variantId={variantId ?? undefined}
        stockQuantity={stockQuantity}
        label={[name, color, size].filter(Boolean).join(" · ")}
      />
    </article>
  );
}

export default CatalogueProductCard;
