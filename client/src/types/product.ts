export type Product = {
  id_product: number;
  name: string;
  description: string | null;
  material: string | null;
  model_height_cm: number | null;
  model_size_worn: string | null;
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
  // The CSS object-position vertical anchor for `image`, e.g. "85%". Lets a
  // photo shared between two products (a combo shot showing both garments)
  // be cropped to emphasize whichever garment that product actually sells.
  focal_point: string | null;
  gallery?: Array<{ url: string; focal_point: string | null }>;
  created_at: string;
};
