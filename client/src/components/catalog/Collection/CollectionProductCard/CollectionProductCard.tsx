import { Link } from "react-router";
import { COLOR_SWATCHES } from "../../../../utils/colorSwatches";
import AddToCartButton from "../../../cart/AddToCartButton";
import "./CollectionProductCard.css";

type CollectionProductCardProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  alt: string;
  variantId?: number | null;
  productId?: number | null;
  size?: string | null;
  color?: string | null;
  colors?: string[];
  stockQuantity?: number;
};

function CollectionProductCard({
  name,
  category,
  price,
  badge,
  image,
  alt,
  variantId,
  productId,
  size,
  color,
  colors,
  stockQuantity,
}: CollectionProductCardProps) {
  return (
    <article className="collection-product-card">
      <Link
        className="collection-product-card-image"
        to={productId ? `/product/${productId}` : "/collection"}
      >
        {image && <img src={image} alt={alt} />}
        {badge && (
          <span className="collection-product-card-badge">{badge}</span>
        )}
      </Link>
      <div className="collection-product-card-info">
        <div>
          <h2>{name}</h2>
          <p>{category}</p>
          {(size || color) && (
            <p>{[color, size].filter(Boolean).join(" · ")}</p>
          )}
          {colors && colors.length > 1 && (
            <div
              className="collection-product-card-colors"
              aria-label={`Coloris disponibles : ${colors.join(", ")}`}
            >
              {colors.map((c) => (
                <span
                  key={c}
                  className="collection-color-pin"
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

export default CollectionProductCard;
