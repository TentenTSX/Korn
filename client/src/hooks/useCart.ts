import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

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

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setItems(await apiRequest<CartItem[]>("/api/cart"));
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erreur réseau.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const addItem = async (variant_id: number, quantity: number) => {
    await apiRequest<void>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ variant_id, quantity }),
    });
    await refresh();
  };
  const updateItem = async (itemId: number, quantity: number) => {
    await apiRequest<void>(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    await refresh();
  };
  const removeItem = async (itemId: number) => {
    await apiRequest<void>(`/api/cart/items/${itemId}`, {
      method: "DELETE",
    });
    await refresh();
  };
  const checkout = async (shipping: ShippingInput) => {
    const result = await apiRequest<CheckoutResult>("/api/cart/checkout", {
      method: "POST",
      body: JSON.stringify(shipping),
    });
    return result;
  };

  return {
    items,
    isLoading,
    error,
    refresh,
    addItem,
    updateItem,
    removeItem,
    checkout,
  };
}
