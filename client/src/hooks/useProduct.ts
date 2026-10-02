import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { Product } from "./useProducts";

export function useProduct(productId: number | null) {
  const [variants, setVariants] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId === null) return;
    let isCancelled = false;
    setIsLoading(true);
    apiRequest<Product[]>(`/api/products/${productId}`)
      .then((result) => {
        if (!isCancelled) {
          setVariants(result);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!isCancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Erreur réseau.",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  return { variants, isLoading, error };
}
