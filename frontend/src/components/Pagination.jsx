const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="pag-btn"
            >
                ← Préc.
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`pag-num ${p === page ? "pag-num--active" : ""}`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="pag-btn"
            >
                Suiv. →
            </button>
        </div>
    );
};

export default Pagination;
