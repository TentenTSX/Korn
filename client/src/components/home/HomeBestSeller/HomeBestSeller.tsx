import { Link } from "react-router";
import { useProducts } from "../../../hooks/useProducts";
import AddToCartButton from "../../cart/AddToCartButton";
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
        <Link className="home-best-sellers-link" to="/collection/bestsellers">
          Tout voir
        </Link>
      </header>

      <div className="home-best-sellers-grid">
        {uniqueProducts.map((product) => (
          <article
            className="home-best-sellers-product"
            key={product.id_product}
          >
            <div className="home-best-sellers-image-wrapper">
              <Link
                className="home-best-sellers-image-link"
                to={`/product/${product.id_product}`}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.alt_text ?? product.name}
                  />
                )}
              </Link>
              <div className="home-best-sellers-add">
                <AddToCartButton
                  variantId={product.id_variant ?? undefined}
                  stockQuantity={product.stock_quantity}
                  label={product.name}
                />
              </div>
            </div>
            <Link
              className="home-best-sellers-product-info"
              to={`/product/${product.id_product}`}
            >
              <h3>{product.name}</h3>
              <span className="home-best-sellers-price">{product.price} €</span>
              <p>{product.description ?? product.category_name}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeBestSeller;
