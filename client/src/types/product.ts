export type Product = {
  id_product: number;
  name: string;
  description: string | null;
  category_name: string | null;
  category_slug: string | null;
  subcategory_name: string | null;
  id_variant: number | null;
  size: string | null;
  color: string | null;
  price: number;
  stock_quantity: number;
  image: string | null;
  alt_text: string | null;
  created_at: string;
};
