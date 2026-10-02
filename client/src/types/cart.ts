export type CartItem = {
  id_cart_item: number;
  variant_id: number;
  quantity: number;
  price_unit: number | string;
  name: string;
  image: string | null;
  size: string | null;
  color: string | null;
  stock_quantity: number;
};

export type ShippingInput = {
  customer_email: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
};

export type CheckoutResult = {
  orderId: number;
  totalPrice: number;
  url: string;
};

export type StripeCheckoutStatus = {
  orderId: number;
  totalPrice: number;
  paymentStatus: string;
  sessionStatus: string | null;
};
