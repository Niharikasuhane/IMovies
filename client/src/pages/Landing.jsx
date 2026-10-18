import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { MOCK_MOVIES } from '../mock/moviesData';

export default function Landing() {
  const featuredMovies = MOCK_MOVIES.slice(0, 5);

  return (
    <div style={{ backgroundColor: '#06090e', minHeight: '90vh' }}>
      {/* HERO SECTION MATCHING SCREENSHOT */}
      <div className="hero-landing-container">
        <h1 className="hero-heading">
          Welcome to <span className="hero-highlight">iMovies</span>
        </h1>
        <p className="hero-subheading">
          Your ultimate destination for the latest blockbusters and timeless classics
        </p>
        <div className="hero-btn-group">
          <Link to="/login" className="btn-signin-pill">
            Sign In
          </Link>
          <Link to="/register" className="btn-signup-pill">
            Sign Up
          </Link>
        </div>
      </div>

      {/* FEATURED CINEMA PREVIEW */}
      <div className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="section-title mb-0">
            Now <span className="title-highlight">Showing</span>
          </h3>
          <Link to="/movies" className="text-danger fw-semibold" style={{ textDecoration: 'none' }}>
            View All Movies →
          </Link>
        </div>

        <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
          {featuredMovies.map((movie) => (
            <div className="col" key={movie._id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
