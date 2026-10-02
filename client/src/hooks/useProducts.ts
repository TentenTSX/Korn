import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export type Product = {
  id_product: number;
  name: string;
  description: string | null;
  category_name: string | null;
  category_slug: string | null;
  subcategory_name: string | null;
  id_variant: number | null;
  size: string | null;
  color: string | null;
  price: number;
  stock_quantity: number;
  image: string | null;
  alt_text: string | null;
  created_at: string;
};

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
