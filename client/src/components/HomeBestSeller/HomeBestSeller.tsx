import "./HomeBestSeller.css";

const products = [
  {
    name: "Oversized Crewneck",
    description: "Sweat col rond épais",
    price: "79 €",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&h=1250&fit=crop&auto=format",
    alt: "Sweatshirt oversize gris",
  },
  {
    name: "Cargo Pant",
    description: "Pantalon cargo technique",
    price: "99 €",
    badge: "NOUVEAU",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&h=1250&fit=crop&auto=format",
    alt: "Pantalon cargo technique noir",
  },
  {
    name: "Compression Tee",
    description: "T-shirt compression",
    price: "55 €",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&h=1250&fit=crop&auto=format",
    alt: "T-shirt blanc de compression",
  },
];

function HomeBestSeller() {
  return (
    <section
      className="home-best-sellers"
      aria-labelledby="home-best-sellers-title"
    >
      <header className="home-best-sellers-header">
        <h2 id="home-best-sellers-title">Bestsellers</h2>
        <a className="home-best-sellers-link" href="/collection">
          Tout voir
        </a>
      </header>

      <div className="home-best-sellers-grid">
        {products.map((product) => (
          <a
            className="home-best-sellers-product"
            href="/collection"
            key={product.name}
          >
            <div className="home-best-sellers-image-wrapper">
              <img src={product.image} alt={product.alt} />
              {product.badge && (
                <span className="home-best-sellers-badge">{product.badge}</span>
              )}
              <span className="home-best-sellers-add">Ajouter au panier</span>
            </div>
            <div className="home-best-sellers-product-info">
              <h3>{product.name}</h3>
              <span className="home-best-sellers-price">{product.price}</span>
              <p>{product.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default HomeBestSeller;
