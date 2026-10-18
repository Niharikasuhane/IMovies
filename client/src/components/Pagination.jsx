export default function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;
  return (
    <nav className="mt-4 d-flex justify-content-center">
      <ul className="pagination mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => onChange(page - 1)}>Prev</button></li>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}><button className="page-link" onClick={() => onChange(p)}>{p}</button></li>
        ))}
        <li className={`page-item ${page === pages ? 'disabled' : ''}`}><button className="page-link" onClick={() => onChange(page + 1)}>Next</button></li>
      </ul>
    </nav>
  );
}
