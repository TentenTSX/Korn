import { useProducts } from "../../../hooks/useProducts";
import "./HomeBestSeller.css";

function HomeBestSeller() {
  const { products } = useProducts();
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id_product, product])).values(),
  ).slice(0, 3);

  return (
    <section
      className="home-best-sellers"
      aria-labelledby="home-best-sellers-title"
    >
      <header className="home-best-sellers-header">
        <h2 id="home-best-sellers-title">Bestsellers</h2>
        <a className="home-best-sellers-link" href="/collection/bestsellers">
          Tout voir
        </a>
      </header>

      <div className="home-best-sellers-grid">
        {uniqueProducts.map((product) => (
          <a
            className="home-best-sellers-product"
            href={`/product/${product.id_product}`}
            key={product.id_product}
          >
            <div className="home-best-sellers-image-wrapper">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.alt_text ?? product.name}
                />
              )}
              <span className="home-best-sellers-add">Ajouter au panier</span>
            </div>
            <div className="home-best-sellers-product-info">
              <h3>{product.name}</h3>
              <span className="home-best-sellers-price">{product.price} €</span>
              <p>{product.description ?? product.category_name}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default HomeBestSeller;
