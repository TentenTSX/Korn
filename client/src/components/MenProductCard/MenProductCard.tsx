type MenProductCardProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  alt: string;
};

function MenProductCard({
  name,
  category,
  price,
  badge,
  image,
  alt,
}: MenProductCardProps) {
  return (
    <article className="men-product-card">
      <a className="men-product-card-image" href="/collection">
        <img src={image} alt={alt} />
        {badge && <span className="men-product-card-badge">{badge}</span>}
      </a>
      <div className="men-product-card-info">
        <div>
          <h2>{name}</h2>
          <p>{category}</p>
        </div>
        <strong>{price}</strong>
      </div>
    </article>
  );
}

export default MenProductCard;
