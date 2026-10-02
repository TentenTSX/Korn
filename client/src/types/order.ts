export type OrderSummary = {
  id_order: number;
  total_price: number | string;
  status: string;
  created_at: string;
  payment_status: string | null;
  invoice_number: string | null;
};

export type OrderItem = {
  id_product: number;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price_unit: number | string;
  image: string | null;
};

export type OrderDetail = {
  id_order: number;
  total_price: number | string;
  status: string;
  created_at: string;
  invoice_number: string | null;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  items: OrderItem[];
};
