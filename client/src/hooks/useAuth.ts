import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { Credentials, RegisterInput, User } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setUser(await apiRequest<User>("/api/auth/me"));
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = async (credentials: Credentials) => {
    const result = await apiRequest<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(result.user);
  };

  const register = async (input: RegisterInput) => {
    const result = await apiRequest<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setUser(result.user);
  };

  const logout = async () => {
    await apiRequest<void>("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const requestPasswordReset = (email: string) =>
    apiRequest<void>("/api/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

  const confirmPasswordReset = (token: string, password: string) =>
    apiRequest<void>("/api/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    requestPasswordReset,
    confirmPasswordReset,
  };
}
