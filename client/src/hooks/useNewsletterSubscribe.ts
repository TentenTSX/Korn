import { useState } from "react";
import { apiRequest } from "../services/api";

type SubscribeStatus = "idle" | "loading" | "done" | "error";

export function useNewsletterSubscribe() {
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string) => {
    setStatus("loading");
    setError(null);
    try {
      await apiRequest<void>("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus("done");
      return true;
    } catch (requestError) {
      setStatus("error");
      setError(
        requestError instanceof Error
          ? requestError.message
          : "L'inscription a échoué.",
      );
      return false;
    }
  };

  return { status, error, subscribe };
}
