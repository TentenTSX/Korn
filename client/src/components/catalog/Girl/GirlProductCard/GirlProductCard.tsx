import { Link } from "react-router";
import AddToCartButton from "../../../cart/AddToCartButton";
import "./GirlProductCard.css";

type GirlProductCardProps = {
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
  stockQuantity?: number;
};

function GirlProductCard({
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
  stockQuantity,
}: GirlProductCardProps) {
  return (
    <article className="girl-product-card">
      <Link
        className="girl-product-card-image"
        to={productId ? `/product/${productId}` : "/collection"}
      >
        {image && <img src={image} alt={alt} />}
        {badge && <span className="girl-product-card-badge">{badge}</span>}
      </Link>
      <div className="girl-product-card-info">
        <div>
          <h2>{name}</h2>
          <p>{category}</p>
          {(size || color) && (
            <p>{[color, size].filter(Boolean).join(" · ")}</p>
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

export default GirlProductCard;
