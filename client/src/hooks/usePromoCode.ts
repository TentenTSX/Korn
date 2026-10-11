import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

type PromoCodeStatus = {
  code: string | null;
  discountPercent: number | null;
};

export function usePromoCode() {
  const [status, setStatus] = useState<PromoCodeStatus>({
    code: null,
    discountPercent: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setStatus(await apiRequest<PromoCodeStatus>("/api/cart/promo-code"));
    } catch {
      setStatus({ code: null, discountPercent: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyCode = async (code: string) => {
    setError(null);
    try {
      await apiRequest<{ discountPercent: number }>("/api/cart/promo-code", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      await refresh();
      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Code promo invalide.",
      );
      return false;
    }
  };

  const removeCode = async () => {
    await apiRequest<void>("/api/cart/promo-code", { method: "DELETE" });
    await refresh();
  };

  return { ...status, isLoading, error, applyCode, removeCode, refresh };
}
