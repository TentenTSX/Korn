import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

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

export function useOrder(userId: number | null, orderId: number | null) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !orderId) {
      setOrder(null);
      setIsLoading(false);
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    apiRequest<OrderDetail>(`/api/users/${userId}/orders/${orderId}`)
      .then((result) => {
        if (!isCancelled) {
          setOrder(result);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!isCancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Commande indisponible.",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [userId, orderId]);

  return { order, isLoading, error };
}
