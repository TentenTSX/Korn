import { Link } from "react-router";
import { useProducts } from "../../../hooks/useProducts";
import "./HomeNews.css";

function HomeNews() {
  const { products } = useProducts();
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id_product, product])).values(),
  ).slice(0, 4);

  return (
    <section className="home-news" aria-labelledby="home-news-title">
      <header className="home-news-header">
        <h2 id="home-news-title">Nouveautés</h2>
        <Link className="home-news-link" to="/collection/news">
          Tout voir
        </Link>
      </header>

      <div className="home-news-grid">
        {uniqueProducts.map((product) => (
          <Link
            className="home-news-product"
            to={`/product/${product.id_product}`}
            key={product.id_product}
          >
            <div className="home-news-image-wrapper">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.alt_text ?? product.name}
                />
              )}
              <span className="home-news-badge">NOUVEAU</span>
              <span className="home-news-add">Ajouter au panier</span>
            </div>
            <div className="home-news-product-info">
              <h3>{product.name}</h3>
              <span className="home-news-price">{product.price} €</span>
              <p>{product.description ?? product.category_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default HomeNews;
