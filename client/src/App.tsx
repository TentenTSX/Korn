import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { useNavigate } from "react-router";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import CartView from "./components/cart/CartView/CartView";
import { useCartContext } from "./contexts/CartContext";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, closeCart } = useCartContext();
  const hideFooter = location.pathname === "/reset-password";

  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      {!hideFooter && <Footer />}
      {isOpen && (
        <CartView
          onClose={closeCart}
          onCheckout={() => {
            closeCart();
            navigate("/checkout");
          }}
        />
      )}
    </>
  );
}

export default App;
