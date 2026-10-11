import { useActiveSale } from "../../hooks/useActiveSale";
import "./SaleBanner.css";

function SaleBanner() {
  const activeSale = useActiveSale();
  if (!activeSale) return null;

  return (
    <div className="sale-banner" role="note">
      <p>
        {activeSale.name} : -{activeSale.discount_percent}% avec le code{" "}
        <strong className="sale-banner-code">{activeSale.code}</strong> au
        panier
      </p>
    </div>
  );
}

export default SaleBanner;
