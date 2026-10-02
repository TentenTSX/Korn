import AddToCartButton from "../../../cart/AddToCartButton";
import "./MenProductCard.css";

type MenProductCardProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  alt: string;
  variantId?: number | null;
  size?: string | null;
  color?: string | null;
  stockQuantity?: number;
};

function MenProductCard({
  name,
  category,
  price,
  badge,
  image,
  alt,
  variantId,
  size,
  color,
  stockQuantity,
}: MenProductCardProps) {
  return (
    <article className="men-product-card">
      <a className="men-product-card-image" href="/collection">
        {image && <img src={image} alt={alt} />}
        {badge && <span className="men-product-card-badge">{badge}</span>}
      </a>
      <div className="men-product-card-info">
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

export default MenProductCard;
