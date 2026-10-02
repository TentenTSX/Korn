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
      conditions.push("c.name = ?");
      values.push(query.gender);
    }
    if (query.category) {
      conditions.push("c.slug = ?");
      values.push(query.category);
    }
    const where =
      conditions.length > 0 ? ` where ${conditions.join(" and ")}` : "";
    const [rows] = await databaseClient.query<Rows>(
      `select distinct p.*, c.name as category_name, c.slug as category_slug, pv.id_variant, pv.size, pv.color, pv.price, pv.stock_quantity, (select pi.url from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as image, (select pi.alt_text from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as alt_text from products p left join product_variants pv on pv.product_id = p.id_product left join product_categories pc on pc.product_id = p.id_product left join categories c on c.id_category = pc.category_id${where} order by p.created_at desc`,
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
