import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { fmtDate } from '../../utils/format';
import { MOCK_MOVIES } from '../../mock/moviesData';

const blank = {
  title: '',
  description: '',
  genre: '',
  language: 'Telugu',
  duration: '',
  releaseDate: '',
  rating: '8.0',
  certificate: 'UA',
  director: '',
  cast: '',
  trailerUrl: '',
};

export default function AdminMovies() {
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem('imovies_demo_movies');
    return saved ? JSON.parse(saved) : MOCK_MOVIES;
  });

  const [form, setForm] = useState(blank);
  const [posterUrl, setPosterUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const fileInputRef = useRef(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const reset = () => {
    setForm(blank);
    setPosterUrl('');
    setPreview(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePosterSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setPosterUrl(url);
    }
  };

  const handlePosterUrlChange = (e) => {
    const val = e.target.value;
    setPosterUrl(val);
    setPreview(val.trim() || null);
  };

  const clearPoster = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setPreview(null);
    setPosterUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Movie title is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (!form.duration) return toast.error('Runtime is required');
    if (!form.releaseDate) return toast.error('Release date is required');

    const chosenImg = posterUrl.trim() || preview || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
    const movieData = {
      _id: editId || 'm_' + Date.now(),
      title: form.title.trim(),
      movieName: form.title.trim(),
      description: form.description.trim(),
      genre: typeof form.genre === 'string' ? form.genre.split(',').map((s) => s.trim()).filter(Boolean) : form.genre,
      genres: typeof form.genre === 'string' ? form.genre.split(',').map((s) => s.trim()).filter(Boolean) : form.genre,
      language: form.language || 'Telugu',
      duration: +form.duration || 120,
      releaseDate: new Date(form.releaseDate).toISOString(),
      rating: +form.rating || 8.0,
      certificate: form.certificate || 'UA',
      director: form.director || '',
      cast: typeof form.cast === 'string' ? form.cast.split(',').map((s) => s.trim()).filter(Boolean) : form.cast,
      trailerUrl: form.trailerUrl || '',
      cities: ['Hyderabad', 'Bangalore', 'Mumbai'],
      poster: chosenImg,
      movieImage: chosenImg,
    };

    let updated;
    if (editId) {
      updated = list.map((m) => (m._id === editId ? { ...m, ...movieData } : m));
      toast.success('Movie updated in demo dataset');
    } else {
      updated = [movieData, ...list];
      toast.success('Movie added to demo dataset');
    }

    setList(updated);
    localStorage.setItem('imovies_demo_movies', JSON.stringify(updated));
    reset();
  };

  const edit = (m) => {
    setEditId(m._id);
    setForm({
      title: m.title || m.movieName || '',
      description: m.description || '',
      genre: (m.genre || m.genres || []).join(', '),
      language: m.language || 'Telugu',
      duration: m.duration || '',
      releaseDate: m.releaseDate ? m.releaseDate.slice(0, 10) : '',
      rating: m.rating || '8.0',
      certificate: m.certificate || 'UA',
      director: m.director || '',
      cast: (m.cast || []).join(', '),
      trailerUrl: m.trailerUrl || '',
    });
    const img = m.movieImage || m.poster || '';
    setPreview(img || null);
    setPosterUrl(img);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const del = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this movie?')) return;
    const updated = list.filter((m) => m._id !== id);
    setList(updated);
    localStorage.setItem('imovies_demo_movies', JSON.stringify(updated));
    toast.info('Movie removed from demo list');
  };

  return (
    <div className="container py-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        style={{ display: 'none' }}
        onChange={handlePosterSelect}
      />

      {/* TOP SECTION: ADD MOVIE FORM (Image 5) */}
      <div className="mb-5" style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Red outlined Poster Box */}
        <div
          className="dropzone-poster-box"
          onClick={() => fileInputRef.current?.click()}
          title="Click to select movie poster"
        >
          {preview ? (
            <img src={preview} alt="Poster preview" className="dropzone-preview-img" />
          ) : (
            <div className="text-center text-muted p-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e50914"
                strokeWidth="1.5"
                className="mb-2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <div className="small text-secondary">Click to upload or change movie poster</div>
            </div>
          )}
        </div>

        {/* Clear Icon below dropzone */}
        {preview && (
          <div className="dropzone-clear-icon" onClick={clearPoster} title="Remove image">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e50914"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </div>
        )}

        {/* Heading: Add Movie */}
        <h3 className="section-title text-center mt-3 mb-4">
          {editId ? 'Edit' : 'Add'} <span className="title-highlight">Movie</span>
        </h3>

        <form onSubmit={submit}>
          <div className="row g-3">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Movie</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter movie name"
                  required
                  value={form.title}
                  onChange={set('title')}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Genres</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter movie genres sep..."
                  value={form.genre}
                  onChange={set('genre')}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Runtime</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter runtime in minute..."
                  required
                  value={form.duration}
                  onChange={set('duration')}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Trailer URL (YouTube)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://www.youtube.c..."
                  value={form.trailerUrl}
                  onChange={set('trailerUrl')}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter movie description"
                  required
                  value={form.description}
                  onChange={set('description')}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Release Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="dd-mm-yyyy"
                  required
                  value={form.releaseDate}
                  onChange={set('releaseDate')}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Certification</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter movie certificat..."
                  value={form.certificate}
                  onChange={set('certificate')}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Telugu, Hindi, English"
                  value={form.language}
                  onChange={set('language')}
                />
              </div>
            </div>

            {/* Dedicated Option to Add Image of Movie */}
            <div className="col-12">
              <div className="mb-2">
                <label className="form-label d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold">
                    Movie Image / Poster URL <span style={{ color: '#e50914' }}>*</span>
                  </span>
                  <span className="small text-secondary">
                    Web URL or File Browse
                  </span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary" style={{ fontSize: '0.9rem' }}>
                    🖼️
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter movie image URL (e.g. https://... or click Browse File)"
                    value={posterUrl}
                    onChange={handlePosterUrlChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ borderColor: '#e50914', color: '#e50914' }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Choose local image file"
                  >
                    📁 Browse File
                  </button>
                  {preview && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={clearPoster}
                      title="Clear image preview"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
                <div className="form-text text-secondary small mt-1">
                  Enter an image URL or choose a file from your device. Live preview is shown in the red poster box above.
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 text-center mt-3 d-flex justify-content-center gap-3">
              <button
                type="submit"
                className="btn-submit-red"
                style={{ maxWidth: '240px', padding: '10px 28px' }}
              >
                {editId ? 'Update Movie' : 'Add Movie'}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={reset}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* BOTTOM SECTION: AVAILABLE MOVIES */}
      <div className="mt-5">
        <div className="available-movies-banner">
          Available Movies
        </div>

        <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
          {list.map((m) => (
            <div className="col" key={m._id}>
              <div
                className="movie-grid-card"
                onClick={() => edit(m)}
                title="Click to edit movie"
              >
                <div className="movie-poster-wrapper">
                  {/* Floating Delete Button with red trash icon */}
                  <button
                    type="button"
                    className="movie-delete-btn-circle"
                    onClick={(e) => del(e, m._id)}
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

                  <img
                    src={m.movieImage || m.poster}
                    alt={m.title || m.movieName}
                    className="movie-poster-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%23131722"/><text x="50%" y="45%" fill="%23e50914" font-size="24" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle">iMovies</text><text x="50%" y="55%" fill="%23ffffff" font-size="16" font-family="Arial,sans-serif" text-anchor="middle">${encodeURIComponent(m.title || m.movieName || 'Movie')}</text></svg>`;
                    }}
                  />
                </div>

                <div className="movie-grid-title">{m.title || m.movieName}</div>
                <div className="movie-grid-date">{fmtDate(m.releaseDate)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
