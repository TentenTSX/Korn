import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { Product } from "./useProducts";

const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 5;
const DEBOUNCE_MS = 250;

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      apiRequest<Product[]>(
        `/api/products?search=${encodeURIComponent(trimmed)}`,
      )
        .then((results) => {
          if (isCancelled) return;
          const uniqueProducts = Array.from(
            new Map(
              results.map((product) => [product.id_product, product]),
            ).values(),
          ).slice(0, MAX_SUGGESTIONS);
          setSuggestions(uniqueProducts);
        })
        .catch(() => {
          if (!isCancelled) setSuggestions([]);
        })
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  return { suggestions, isLoading };
}
