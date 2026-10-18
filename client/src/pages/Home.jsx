import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';
import { MOCK_MOVIES, MOCK_GENRES, MOCK_LANGUAGES, MOCK_CITIES } from '../mock/moviesData';

const emptyFilters = {
  search: '',
  genre: '',
  language: '',
  city: '',
};

export default function Home() {
  const { user } = useSelector((s) => s.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    search: searchParams.get('search') || '',
  }));

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setFilters((prev) => ({ ...prev, search: q }));
    }
  }, [searchParams]);

  // Filter movies in local state
  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter((movie) => {
      // Search filter (title, description, cast)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchTitle = movie.title.toLowerCase().includes(query);
        const matchDesc = movie.description?.toLowerCase().includes(query);
        const matchCast = (movie.cast || []).some((c) => c.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchCast) return false;
      }

      // Genre filter
      if (filters.genre && !movie.genre.includes(filters.genre)) {
        return false;
      }

      // Language filter
      if (filters.language && movie.language !== filters.language) {
        return false;
      }

      // City filter
      if (filters.city && !(movie.cities || []).includes(filters.city)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleReset = () => {
    setFilters(emptyFilters);
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.genre || filters.language || filters.city
  );

  return (
    <div className="container py-4">
      {/* Centered Heading Matching Screenshot */}
      <h1 className="text-center fw-bold my-4" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>
        Available <span style={{ color: '#e50914' }}>Movies</span>
      </h1>

      {/* Filter Bar with Search, Genre, Language, City, Reset */}
      <div
        className="card mb-4 p-3"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="row g-2 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search movies by title, cast..."
              value={filters.search}
              onChange={handleFilterChange('search')}
            />
          </div>

          {/* Genre Select */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={filters.genre}
              onChange={handleFilterChange('genre')}
            >
              <option value="">All genres</option>
              {MOCK_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Select */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={filters.language}
              onChange={handleFilterChange('language')}
            >
              <option value="">All languages</option>
              {MOCK_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* City Select */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={filters.city}
              onChange={handleFilterChange('city')}
            >
              <option value="">All cities</option>
              {MOCK_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="col-6 col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleReset}
              disabled={!hasActiveFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Movies Count / Active filter status */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-secondary small">
          Showing <strong className="text-white">{filteredMovies.length}</strong> of{' '}
          <strong className="text-white">{MOCK_MOVIES.length}</strong> available movies
        </span>
        {hasActiveFilters && (
          <span
            role="button"
            onClick={handleReset}
            className="text-danger small"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear all filters
          </span>
        )}
      </div>

      {/* Responsive Movie Poster Grid matching screenshot */}
      {filteredMovies.length === 0 ? (
        <div className="alert alert-dark text-secondary text-center py-5">
          <h5>No movies found</h5>
          <p className="mb-3">No movies match your current search and filter settings.</p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            style={{ borderColor: '#e50914', color: '#e50914' }}
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6">
          {filteredMovies.map((movie) => (
            <div className="col" key={movie._id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
