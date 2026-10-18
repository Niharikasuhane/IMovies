import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="fw-bold" style={{ fontSize: '4.5rem', color: '#e50914' }}>404</h1>
      <p className="lead text-secondary mb-4">Page not found.</p>
      <Link to="/" className="btn-signin-pill">Go Home</Link>
    </div>
  );
}
