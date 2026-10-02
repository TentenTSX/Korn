import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { ActiveSale } from "../types/sale";

export function useActiveSale() {
  const [sale, setSale] = useState<ActiveSale | null>(null);

  useEffect(() => {
    let isCancelled = false;
    apiRequest<ActiveSale | null>("/api/sales/active")
      .then((result) => {
        if (!isCancelled) setSale(result);
      })
      .catch(() => {
        if (!isCancelled) setSale(null);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  return sale;
}
