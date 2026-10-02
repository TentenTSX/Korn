import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { CartItem, CheckoutResult, ShippingInput } from "../types/cart";

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
