import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export function useShippingFee() {
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    apiRequest<{ shippingFee: number }>("/api/shipping-fee")
      .then((result) => {
        if (!isCancelled) setShippingFee(result.shippingFee);
      })
      .catch(() => {
        if (!isCancelled) setShippingFee(null);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  return shippingFee;
}
