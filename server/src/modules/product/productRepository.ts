import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class ProductRepository {
  async findAll(query: {
    category?: string;
    gender?: string;
    search?: string;
    sort?: string;
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
    // "Bestsellers" is a real sales ranking: only products with at least one
    // paid order_item qualify, ordered by total units sold.
    const isBestsellers = query.sort === "bestsellers";
    const salesJoin = isBestsellers
      ? `join (
          select pv2.product_id, sum(oi.quantity) as units_sold
          from order_items oi
          join orders o on o.id_order = oi.order_id
          join product_variants pv2 on pv2.id_variant = oi.variant_id
          where o.status = 'paid'
          group by pv2.product_id
        ) sales on sales.product_id = p.id_product`
      : "";
    const orderBy = isBestsellers
      ? "order by sales.units_sold desc, p.created_at desc"
      : "order by p.created_at desc";
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
        (select pi.url from product_images pi where pi.product_id = p.id_product and (pi.color = pv.color or pi.color is null) order by (pi.color = pv.color) desc, pi.position limit 1) as image,
        (select pi.alt_text from product_images pi where pi.product_id = p.id_product and (pi.color = pv.color or pi.color is null) order by (pi.color = pv.color) desc, pi.position limit 1) as alt_text
      from products p
      ${salesJoin}
      left join product_variants pv on pv.product_id = p.id_product${where}
      ${orderBy}`,
      values,
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select p.*, pv.id_variant, pv.size, pv.color, pv.price, pv.stock_quantity, (select pi.url from product_images pi where pi.product_id = p.id_product and (pi.color = pv.color or pi.color is null) order by (pi.color = pv.color) desc, pi.position limit 1) as image, (select pi.alt_text from product_images pi where pi.product_id = p.id_product and (pi.color = pv.color or pi.color is null) order by (pi.color = pv.color) desc, pi.position limit 1) as alt_text from products p left join product_variants pv on pv.product_id = p.id_product where p.id_product = ?",
      [id],
    );
    if (rows.length === 0) return rows;

    const [imageRows] = await databaseClient.query<Rows>(
      "select url, color from product_images where product_id = ? order by position",
      [id],
    );
    return rows.map((row) => ({
      ...row,
      gallery: imageRows
        .filter((image) => image.color === row.color || image.color === null)
        .map((image) => image.url as string),
    }));
  }

  async findCategories() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from categories order by name",
    );
    return rows;
  }
}

export default new ProductRepository();
