type CollectionProductCardProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  image: string;
  alt: string;
};

function CollectionProductCard({
  name,
  category,
  price,
  badge,
  image,
  alt,
}: CollectionProductCardProps) {
  return (
    <article className="collection-product-card">
      <a className="collection-product-card-image" href="/collection">
        <img src={image} alt={alt} />
        {badge && (
          <span className="collection-product-card-badge">{badge}</span>
        )}
      </a>
      <div className="collection-product-card-info">
        <div>
          <h2>{name}</h2>
          <p>{category}</p>
        </div>
        <strong>{price}</strong>
      </div>
    </article>
  );
}

export default CollectionProductCard;
