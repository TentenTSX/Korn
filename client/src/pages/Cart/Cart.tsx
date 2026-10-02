import { useNavigate } from "react-router";
import CartView from "../../components/cart/CartView/CartView";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Cart() {
  const navigate = useNavigate();
  useDocumentHead({
    title: "Panier",
    description: "Consultez et modifiez le contenu de votre panier Korn.",
  });

  return (
    <CartView
      asPage
      onClose={() => navigate("/collection")}
      onCheckout={() => navigate("/checkout")}
    />
  );
}

export default Cart;
