import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { AdminOrderDetail } from "../types/order";

export function useAdminOrderDetail(orderId: number | null) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    apiRequest<AdminOrderDetail>(`/api/admin/orders/${orderId}`)
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
  }, [orderId]);

  return { order, isLoading, error };
}
