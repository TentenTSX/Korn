import { useNavigate } from "react-router";
import CartView from "../../components/cart/CartView/CartView";

function Cart() {
  const navigate = useNavigate();

  return (
    <CartView
      onClose={() => navigate("/collection")}
      onCheckout={() => navigate("/checkout")}
    />
  );
}

export default Cart;
