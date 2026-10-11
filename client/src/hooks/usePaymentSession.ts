import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { StripeCheckoutStatus } from "../types/cart";

export function usePaymentSession(sessionId: string | null) {
  const [paymentResult, setPaymentResult] =
    useState<StripeCheckoutStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let isCurrent = true;
    setIsLoading(true);
    setError(null);
    apiRequest<StripeCheckoutStatus>(
      `/api/payments/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
    )
      .then((result) => {
        if (isCurrent) setPaymentResult(result);
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Impossible de vérifier le paiement.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [sessionId]);

  return { paymentResult, isLoading, error };
}
