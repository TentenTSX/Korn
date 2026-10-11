import { Link } from "react-router";
import { useProducts } from "../../../hooks/useProducts";
import { COLOR_SWATCHES } from "../../../utils/colorSwatches";
import { focalPointStyle } from "../../../utils/focalPoint";
import AddToCartButton from "../../cart/AddToCartButton";
import "./HomeBestSeller.css";

function HomeBestSeller() {
  const { products } = useProducts("sort=bestsellers");
  const uniqueProducts = products.slice(0, 3);

  if (uniqueProducts.length === 0) return null;

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
                    style={focalPointStyle(product.focal_point)}
                    width={1920}
                    height={2862}
                    loading="lazy"
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
              {product.colors && product.colors.length > 1 && (
                <div
                  className="home-best-sellers-colors"
                  aria-label={`Coloris disponibles : ${product.colors.join(", ")}`}
                >
                  {product.colors.map((c) => (
                    <span
                      key={c}
                      className="home-best-sellers-color-pin"
                      style={{ backgroundColor: COLOR_SWATCHES[c] ?? "#ccc" }}
                      title={c}
                    />
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeBestSeller;
