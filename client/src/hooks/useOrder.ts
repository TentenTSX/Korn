import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { OrderDetail } from "../types/order";

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
