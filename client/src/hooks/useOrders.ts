import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

type Order = {
  id_order: number;
  total_price: number;
  status: string;
  created_at: string;
  payment_status: string | null;
  invoice_number: string | null;
};

export function useOrders(userId: number | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setOrders(await apiRequest<Order[]>(`/api/users/${userId}/orders`));
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Commandes indisponibles.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { orders, isLoading, error, refresh };
}
