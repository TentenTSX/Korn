import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { AdminOrderSummary } from "../types/order";

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setOrders(await apiRequest<AdminOrderSummary[]>("/api/admin/orders"));
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
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateStatus = async (orderId: number, status: string) => {
    await apiRequest<void>(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    await refresh();
  };

  return { orders, isLoading, error, refresh, updateStatus };
}
