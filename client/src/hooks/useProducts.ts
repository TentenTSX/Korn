import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { Product } from "../types/product";

export function useProducts(searchParams = "") {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setProducts(
        await apiRequest<Product[]>(
          `/api/products${searchParams ? `?${searchParams}` : ""}`,
        ),
      );
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erreur réseau.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { products, isLoading, error, refresh };
}
