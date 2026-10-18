import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/authSlice';

export default function AppNavbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('imovies-theme') || 'dark');
  const [navSearch, setNavSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('imovies-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="imovies-navbar">
      <div className="container-fluid px-3 px-md-4 d-flex justify-content-between align-items-center">
        {/* Brand */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="brand-text">
            <span className="brand-i">i</span>
            <span className="brand-movies">Movies</span>
          </Link>

          {/* Quick Landing Link */}
          <Link
            to="/landing"
            className="text-secondary small d-none d-md-inline-block hover-text-white ms-2"
            style={{ textDecoration: 'none' }}
          >
            Welcome
          </Link>
        </div>

        {/* Middle / Right Navigation */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* USER VIEW (when not admin) */}
          {!isAdmin && (
            <>
              {/* Search Bar matching screenshot */}
              <form onSubmit={handleNavSearchSubmit} className="d-none d-sm-flex align-items-center me-1">
                <div
                  className="input-group input-group-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    borderRadius: '20px',
                    padding: '2px 8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent text-white small"
                    placeholder="Search movies..."
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    style={{ fontSize: '0.85rem', width: '130px', boxShadow: 'none' }}
                  />
                  <button type="submit" className="btn btn-link text-secondary p-0 ms-1" title="Search">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </form>

              {/* Home Icon */}
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="Available Movies"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </NavLink>

              {/* Heart / Bookings Icon */}
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="My Bookings / Orders"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </NavLink>

              {/* User Profile Icon */}
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="User Profile"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </NavLink>
            </>
          )}

          {/* ADMIN VIEW (when admin logged in) */}
          {isAdmin && (
            <>
              {/* Home Icon */}
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="Home / Available Movies"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </NavLink>

              {/* Shows / Schedule icon (Calendar) */}
              <NavLink
                to="/admin/shows"
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="Manage Shows & All Bookings"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
                </svg>
              </NavLink>

              {/* Add movie icon (Plus in Circle) */}
              <NavLink
                to="/admin/movies"
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="Add & Manage Movies"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </NavLink>

              {/* Theatres icon (Drama Masks) */}
              <NavLink
                to="/admin/theatres"
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="Manage Theatres"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                  <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                  <path d="M9 14c1 1.5 5 1.5 6 0"></path>
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36"></path>
                  <path d="M17 3a5 5 0 0 1 5 5c0 1.2-.4 2.3-1.1 3.2"></path>
                </svg>
              </NavLink>

              {/* Admin Overview (Clock/History) */}
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-icon-btn ${isActive ? 'active' : ''}`}
                title="Admin Dashboard Overview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </NavLink>
            </>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            className="nav-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="2" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* User Logout or Sign In */}
          {user ? (
            <button
              type="button"
              className="nav-icon-btn"
              onClick={onLogout}
              title={`Logout (${user.name || user.email})`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          ) : (
            <Link
              to="/login"
              className="nav-icon-btn"
              title="Sign In"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

