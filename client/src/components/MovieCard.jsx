import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fmtDate } from '../utils/format';

export default function MovieCard({ movie, onDelete }) {
  const [imgError, setImgError] = useState(false);

  const fallbackPoster = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%231a2234"/><circle cx="150" cy="180" r="45" fill="%23242f43"/><polygon points="142,160 168,180 142,200" fill="%23e50914"/><text x="150" y="270" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodeURIComponent(movie.title)}</text><text x="150" y="300" font-family="sans-serif" font-size="14" fill="%2394a3b8" text-anchor="middle">${encodeURIComponent(movie.language || 'Cinema')}</text></svg>`;

  const genresString = Array.isArray(movie.genre)
    ? movie.genre.join(', ')
    : movie.genre || 'Action';

  return (
    <Link to={`/movies/${movie._id}`} className="movie-grid-card" title={`View details for ${movie.title}`}>
      <div className="movie-poster-wrapper">
        {onDelete && (
          <button
            type="button"
            className="movie-delete-btn-circle"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(movie._id);
            }}
            title="Delete movie"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e50914"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}

        <img
          src={imgError || !movie.poster ? fallbackPoster : movie.poster}
          className="movie-poster-img"
          alt={movie.title}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>

      <div className="movie-grid-title">{movie.title}</div>

      {/* Calendar date with icon matching screenshot */}
      <div className="movie-grid-date d-flex align-items-center gap-1">
        <span>🗓</span>
        <span>{fmtDate(movie.releaseDate)}</span>
      </div>

      {/* Red genre pill badge matching screenshot */}
      <div className="movie-genre-pill">
        {genresString}
      </div>
    </Link>
  );
}
