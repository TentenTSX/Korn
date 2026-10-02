import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

type CartContextValue = ReturnType<typeof useCart> &
  ReturnType<typeof useAuth> & {
    isAuthLoading: boolean;
    itemCount: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
  };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { user, isLoading: isAuthLoading } = auth;
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
      value={{
        ...cart,
        ...auth,
        isAuthLoading,
        itemCount,
        isOpen,
        openCart,
        closeCart,
      }}
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
