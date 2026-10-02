import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class ProductRepository {
  async findAll(query: {
    category?: string;
    gender?: string;
    search?: string;
  }) {
    const conditions: string[] = [];
    const values: string[] = [];
    if (query.search) {
      conditions.push("(p.name like ? or p.description like ?)");
      values.push(`%${query.search}%`, `%${query.search}%`);
    }
    if (query.gender) {
      conditions.push(
        "exists (select 1 from product_categories pc join categories c on c.id_category = pc.category_id where pc.product_id = p.id_product and c.name = ?)",
      );
      values.push(query.gender);
    }
    if (query.category) {
      conditions.push(
        "exists (select 1 from product_categories pc join categories c on c.id_category = pc.category_id where pc.product_id = p.id_product and c.slug = ?)",
      );
      values.push(query.category);
    }
    const where =
      conditions.length > 0 ? ` where ${conditions.join(" and ")}` : "";
    // A product is tagged with both a gender category (Homme/Femme) and a
    // subcategory (T-shirts, Shorts, ...); pick each out separately so the
    // frontend can filter on gender and subcategory independently without
    // the product_categories join duplicating rows per category.
    const [rows] = await databaseClient.query<Rows>(
      `select distinct p.*,
        (select c.name from product_categories pc join categories c on c.id_category = pc.category_id where pc.product_id = p.id_product and c.name in ('Homme', 'Femme') limit 1) as category_name,
        (select c.slug from product_categories pc join categories c on c.id_category = pc.category_id where pc.product_id = p.id_product and c.name in ('Homme', 'Femme') limit 1) as category_slug,
        (select c.name from product_categories pc join categories c on c.id_category = pc.category_id where pc.product_id = p.id_product and c.name not in ('Homme', 'Femme') limit 1) as subcategory_name,
        pv.id_variant, pv.size, pv.color, pv.price, pv.stock_quantity,
        (select pi.url from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as image,
        (select pi.alt_text from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as alt_text
      from products p
      left join product_variants pv on pv.product_id = p.id_product${where}
      order by p.created_at desc`,
      values,
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select p.*, pv.id_variant, pv.size, pv.color, pv.price, pv.stock_quantity, (select pi.url from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as image, (select pi.alt_text from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as alt_text from products p left join product_variants pv on pv.product_id = p.id_product where p.id_product = ?",
      [id],
    );
    return rows;
  }

  async findCategories() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from categories order by name",
    );
    return rows;
  }
}

export default new ProductRepository();
