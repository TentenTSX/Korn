import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useCart } from "../hooks/useCart";
import { useAuthContext } from "./AuthContext";

type CartContextValue = ReturnType<typeof useCart> & {
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = cart.items.reduce(
    (count, item) => count + item.quantity,
    0,
  );
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const previousUserId = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (isAuthLoading) return;
    const currentUserId = user?.id_user ?? null;
    if (previousUserId.current !== currentUserId) {
      previousUserId.current = currentUserId;
      void cart.refresh();
    }
  }, [cart.refresh, isAuthLoading, user?.id_user]);

  return (
    <CartContext.Provider
      value={{ ...cart, itemCount, isOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used inside CartProvider.");
  }
  return context;
}
