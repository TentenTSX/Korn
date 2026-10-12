import "./CataloguePagination.css";

type CataloguePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function CataloguePagination({
  page,
  totalPages,
  onPageChange,
}: CataloguePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="catalogue-pagination" aria-label="Pagination des produits">
      <button
        className="catalogue-pagination-button"
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </button>
      <span className="catalogue-pagination-status">
        Page {page} / {totalPages}
      </span>
      <button
        className="catalogue-pagination-button"
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </nav>
  );
}

export default CataloguePagination;
