type GirlProductCardProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  alt: string;
};

function GirlProductCard({
  name,
  category,
  price,
  badge,
  image,
  alt,
}: GirlProductCardProps) {
  return (
    <article className="girl-product-card">
      <a className="girl-product-card-image" href="/collection">
        <img src={image} alt={alt} />
        {badge && <span className="girl-product-card-badge">{badge}</span>}
      </a>
      <div className="girl-product-card-info">
        <div>
          <h2>{name}</h2>
          <p>{category}</p>
        </div>
        <strong>{price}</strong>
      </div>
    </article>
  );
}

export default GirlProductCard;
