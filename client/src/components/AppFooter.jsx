import { Link } from 'react-router-dom';

export default function AppFooter() {
  return (
    <footer
      className="mt-auto py-4"
      style={{
        backgroundColor: 'var(--bg-navbar)',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <Link to="/" className="brand-text" style={{ fontSize: '1.25rem' }}>
            <span className="brand-i">i</span>
            <span className="brand-movies">Movies</span>
          </Link>
          <span className="small text-muted">| Ultimate Cinema Destination</span>
        </div>

        <div className="d-flex gap-3 small">
          <Link to="/" className="text-secondary hover-text-white" style={{ textDecoration: 'none' }}>
            Available Movies
          </Link>
          <Link to="/my-bookings" className="text-secondary hover-text-white" style={{ textDecoration: 'none' }}>
            My Orders
          </Link>
          <Link to="/profile" className="text-secondary hover-text-white" style={{ textDecoration: 'none' }}>
            Profile
          </Link>
          <Link to="/admin" className="text-secondary hover-text-white" style={{ textDecoration: 'none' }}>
            Admin Panel
          </Link>
        </div>

        <div className="small text-muted">
          © {new Date().getFullYear()} iMovies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
