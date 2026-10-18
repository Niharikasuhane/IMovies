import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { fmtDate, fmtTime, inr } from '../utils/format';
import { MOCK_MOVIES, MOCK_SHOWS, MOCK_THEATRES } from '../mock/moviesData';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Find movie from local mock dataset
    const found = MOCK_MOVIES.find((m) => m._id === id) || MOCK_MOVIES[0];
    setMovie(found);
    setImgError(false);
  }, [id]);

  // Shows for this movie (from mock data or generated for demo)
  const shows = useMemo(() => {
    if (!movie) return [];

    let list = MOCK_SHOWS.filter((s) => s.movieId === movie._id);

    // If no explicit shows in mock list for this specific movie, create realistic demo shows
    if (list.length === 0) {
      list = [
        {
          _id: `s_${movie._id}_1`,
          movieId: movie._id,
          movieTitle: movie.title,
          theatreId: 't1',
          theatreName: 'Srinivasa 4K Dolby Atmos',
          city: 'Hyderabad',
          screenName: 'Screen 1',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          price: { regular: 180, premium: 300 },
          availableSeats: 42,
          totalSeats: 60,
        },
        {
          _id: `s_${movie._id}_2`,
          movieId: movie._id,
          movieTitle: movie.title,
          theatreId: 't1',
          theatreName: 'Srinivasa 4K Dolby Atmos',
          city: 'Hyderabad',
          screenName: 'Screen 2',
          startTime: new Date(Date.now() + 86400000 + 14400000).toISOString(),
          price: { regular: 200, premium: 320 },
          availableSeats: 28,
          totalSeats: 60,
        },
        {
          _id: `s_${movie._id}_3`,
          movieId: movie._id,
          movieTitle: movie.title,
          theatreId: 't2',
          theatreName: 'Gokul Theatre',
          city: 'Hyderabad',
          screenName: 'Audi 1',
          startTime: new Date(Date.now() + 172800000).toISOString(),
          price: { regular: 160, premium: 280 },
          availableSeats: 15,
          totalSeats: 60,
        },
        {
          _id: `s_${movie._id}_4`,
          movieId: movie._id,
          movieTitle: movie.title,
          theatreId: 't3',
          theatreName: 'PVR Forum Mall',
          city: 'Bangalore',
          screenName: 'IMAX',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          price: { regular: 250, premium: 450 },
          availableSeats: 50,
          totalSeats: 60,
        },
      ];
    }

    // Apply city & date filter
    return list.filter((s) => {
      if (city && s.city !== city) return false;
      if (date && !s.startTime.startsWith(date)) return false;
      return true;
    });
  }, [movie, city, date]);

  // Group shows by formatted date and theatre
  const grouped = useMemo(() => {
    const g = {};
    shows.forEach((s) => {
      const d = fmtDate(s.startTime);
      g[d] = g[d] || {};
      const tid = s.theatreId;
      g[d][tid] = g[d][tid] || {
        theatre: { _id: s.theatreId, name: s.theatreName, city: s.city },
        shows: [],
      };
      g[d][tid].shows.push(s);
    });
    return g;
  }, [shows]);

  const availableCities = useMemo(() => {
    const all = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai'];
    return movie?.cities ? movie.cities : all;
  }, [movie]);

  if (!movie) return <Loader />;

  const fallbackPoster = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%231a2234"/><circle cx="150" cy="180" r="45" fill="%23242f43"/><polygon points="142,160 168,180 142,200" fill="%23e50914"/><text x="150" y="270" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodeURIComponent(movie.title)}</text><text x="150" y="300" font-family="sans-serif" font-size="14" fill="%2394a3b8" text-anchor="middle">${encodeURIComponent(movie.language || 'Cinema')}</text></svg>`;

  return (
    <div className="container py-4">
      {/* Back button */}
      <div className="mb-3">
        <Link to="/" className="text-secondary small d-inline-flex align-items-center gap-1" style={{ textDecoration: 'none' }}>
          ← Back to Available Movies
        </Link>
      </div>

      {/* Movie Hero Card */}
      <div
        className="card mb-4 overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="row g-0">
          <div className="col-md-3">
            <img
              src={imgError || !movie.poster ? fallbackPoster : movie.poster}
              onError={() => setImgError(true)}
              className="img-fluid rounded-start w-100"
              style={{ minHeight: '360px', maxHeight: '420px', objectFit: 'cover' }}
              alt={movie.title}
            />
          </div>
          <div className="col-md-9">
            <div className="card-body p-4">
              <h2 className="text-white fw-bold mb-2">
                {movie.title}{' '}
                <span className="badge bg-warning text-dark fs-6 ms-2">⭐ {movie.rating}</span>
              </h2>
              <p className="text-secondary mb-3">
                {movie.duration} min • {(movie.genre || []).join(', ')} • {movie.language} • {movie.certificate}
              </p>
              <p className="text-light lead fs-6 mb-3">{movie.description}</p>
              <p className="mb-1 text-light">
                <strong className="text-secondary">Director:</strong> {movie.director || '—'}
              </p>
              <p className="text-light mb-4">
                <strong className="text-secondary">Cast:</strong> {(movie.cast || []).join(', ') || '—'}
              </p>
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-danger btn-sm"
                  style={{ borderColor: '#e50914', color: '#e50914' }}
                >
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Select Show filter controls */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        <h4 className="me-auto mb-0 text-white">
          Select <span style={{ color: '#e50914' }}>Show</span>
        </h4>
        <input
          type="date"
          className="form-control w-auto"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All cities</option>
          {availableCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(date || city) && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setDate('');
              setCity('');
            }}
          >
            Clear
          </button>
        )}
      </div>

      {shows.length === 0 ? (
        <div className="alert alert-dark text-secondary">
          No upcoming shows found for the selected date and city.
        </div>
      ) : (
        Object.entries(grouped).map(([d, theatresMap]) => (
          <div
            className="card mb-4"
            key={d}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div
              className="card-header fw-bold text-white"
              style={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', borderColor: 'var(--border-subtle)' }}
            >
              📅 {d}
            </div>
            <ul className="list-group list-group-flush">
              {Object.values(theatresMap).map(({ theatre, shows: ss }) => (
                <li
                  className="list-group-item p-3"
                  key={theatre._id}
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="fw-semibold text-white">
                    {theatre.name} <small className="text-secondary">— {theatre.city}</small>
                  </div>
                  <div className="mt-3 d-flex flex-wrap gap-3">
                    {ss.map((s) => (
                      <Link
                        key={s._id}
                        to={`/shows/${s._id}/seats`}
                        className={`btn btn-sm ${
                          s.availableSeats === 0
                            ? 'btn-outline-secondary disabled'
                            : 'btn-outline-danger'
                        }`}
                        style={
                          s.availableSeats > 0
                            ? {
                                borderColor: '#e50914',
                                color: '#fff',
                                backgroundColor: 'rgba(229, 9, 20, 0.08)',
                                padding: '8px 14px',
                              }
                            : {}
                        }
                      >
                        <div className="fw-bold fs-6">{fmtTime(s.startTime)}</div>
                        <small className="d-block text-secondary">
                          {s.screenName} • from {inr(s.price.regular)}
                        </small>
                        <small
                          className="d-block"
                          style={{ color: s.availableSeats === 0 ? '#94a3b8' : '#4ade80' }}
                        >
                          {s.availableSeats === 0 ? 'Sold out' : `${s.availableSeats} left`}
                        </small>
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
