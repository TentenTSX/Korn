import "dotenv/config";
import databaseClient from "../../database/client";
import type { Result, Rows } from "../../database/client";

type TestVariant = {
  size: string;
  color: string;
  price: number;
  stock_quantity: number;
};

type TestProduct = {
  name: string;
  description: string;
  category: { name: string; slug: string };
  variants: TestVariant[];
};

const testProducts: TestProduct[] = [
  {
    name: "TEST - T-shirt Korn",
    description: "Article de développement pour tester le panier.",
    category: { name: "Femme", slug: "femme" },
    variants: [
      { size: "M", color: "Noir", price: 29.9, stock_quantity: 10 },
      { size: "L", color: "Noir", price: 29.9, stock_quantity: 10 },
    ],
  },
  {
    name: "TEST - Débardeur Korn",
    description: "Article de développement pour tester le panier.",
    category: { name: "Homme", slug: "homme" },
    variants: [{ size: "M", color: "Vert", price: 34.9, stock_quantity: 10 }],
  },
  {
    name: "TEST - Short Korn",
    description: "Article de développement pour tester le panier.",
    category: { name: "Homme", slug: "homme" },
    variants: [{ size: "M", color: "Noir", price: 39.9, stock_quantity: 10 }],
  },
];

async function seedTestProducts() {
  const { DB_NAME, NODE_ENV } = process.env;
  if (!process.argv.includes("--seed-demo")) {
    throw new Error("Run through db:seed:test-products to confirm test data.");
  }
  if (!DB_NAME || NODE_ENV === "production" || /prod/i.test(DB_NAME)) {
    throw new Error(
      "Test products may only be seeded into a development database.",
    );
  }

  const connection = await databaseClient.getConnection();
  try {
    await connection.beginTransaction();
    let variantCount = 0;

    for (const product of testProducts) {
      await connection.query<Result>(
        "insert into categories (name, slug) values (?, ?) on duplicate key update name = values(name)",
        [product.category.name, product.category.slug],
      );
      const [categoryRows] = await connection.query<Rows>(
        "select id_category from categories where slug = ?",
        [product.category.slug],
      );

      const [productRows] = await connection.query<Rows>(
        "select id_product from products where name = ? order by id_product limit 1",
        [product.name],
      );
      let productId: number;
      if (productRows.length > 0) {
        productId = Number(productRows[0].id_product);
      } else {
        const [result] = await connection.query<Result>(
          "insert into products (name, description) values (?, ?)",
          [product.name, product.description],
        );
        productId = result.insertId;
      }

      await connection.query(
        "insert ignore into product_categories (product_id, category_id) values (?, ?)",
        [productId, categoryRows[0].id_category],
      );

      for (const variant of product.variants) {
        await connection.query<Result>(
          "insert into product_variants (product_id, size, color, price, stock_quantity) values (?, ?, ?, ?, ?) on duplicate key update price = values(price), stock_quantity = values(stock_quantity)",
          [
            productId,
            variant.size,
            variant.color,
            variant.price,
            variant.stock_quantity,
          ],
        );
        variantCount += 1;
      }
    }

    await connection.commit();
    console.info(
      `Ensured ${testProducts.length} TEST products and ${variantCount} variants in ${DB_NAME}.`,
    );
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await databaseClient.end();
  }
}

void seedTestProducts().catch((error: unknown) => {
  console.error("Test product seeding failed.", error);
  process.exitCode = 1;
});
