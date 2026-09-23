import "./HomeNews.css";

const products = [
  {
    name: "Essential Tee",
    description: "T-shirt coupe droite",
    price: "39 €",
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1100&fit=crop&auto=format",
    alt: "T-shirt blanc essentiel",
  },
  {
    name: "Relax Hoodie",
    description: "Sweatshirt oversize",
    price: "89 €",
    badge: "NOUVEAU",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&h=1100&fit=crop&auto=format",
    alt: "Sweatshirt oversize gris",
  },
  {
    name: "Training Short",
    description: "Short technique léger",
    price: "49 €",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=1100&fit=crop&auto=format",
    alt: "Short de sport noir et rouge",
  },
  {
    name: "Seamless Legging",
    description: "Legging haute performance",
    price: "69 €",
    badge: "NOUVEAU",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1100&fit=crop&auto=format",
    alt: "Legging de sport noir",
  },
];

function HomeNews() {
  return (
    <section className="home-news" aria-labelledby="home-news-title">
      <header className="home-news-header">
        <h2 id="home-news-title">Nouveautés</h2>
        <a className="home-news-link" href="/collection/news">
          Tout voir
        </a>
      </header>

      <div className="home-news-grid">
        {products.map((product) => (
          <a
            className="home-news-product"
            href="/collection"
            key={product.name}
          >
            <div className="home-news-image-wrapper">
              <img src={product.image} alt={product.alt} />
              {product.badge && (
                <span className="home-news-badge">{product.badge}</span>
              )}
              <span className="home-news-add">Ajouter au panier</span>
            </div>
            <div className="home-news-product-info">
              <h3>{product.name}</h3>
              <span className="home-news-price">{product.price}</span>
              <p>{product.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default HomeNews;
