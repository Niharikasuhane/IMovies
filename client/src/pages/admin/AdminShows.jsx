import { useState } from 'react';
import { toast } from 'react-toastify';
import { fmtDate, fmtTime, inr } from '../../utils/format';
import { MOCK_SHOWS, MOCK_BOOKINGS, MOCK_MOVIES, MOCK_THEATRES } from '../../mock/moviesData';

export default function AdminShows() {
  const [shows, setShows] = useState(() => {
    const saved = localStorage.getItem('imovies_demo_shows');
    return saved ? JSON.parse(saved) : MOCK_SHOWS;
  });

  const [bookings] = useState(() => {
    const saved = localStorage.getItem('imovies_demo_bookings');
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    movie: MOCK_MOVIES[0]?._id || '',
    theatre: MOCK_THEATRES[0]?._id || '',
    screenName: 'Screen 1',
    startTime: '2025-09-25T14:00',
    regular: 180,
    premium: 300,
  });

  const submitShow = (e) => {
    e.preventDefault();
    const movieObj = MOCK_MOVIES.find((m) => m._id === form.movie);
    const theatreObj = MOCK_THEATRES.find((t) => t._id === form.theatre);

    const newShow = {
      _id: 's_' + Date.now(),
      movieId: form.movie,
      movieTitle: movieObj?.title || 'Custom Movie',
      theatreId: form.theatre,
      theatreName: theatreObj?.name || 'Main Cinema',
      city: theatreObj?.city || 'Hyderabad',
      screenName: form.screenName || 'Screen 1',
      startTime: new Date(form.startTime).toISOString(),
      price: { regular: +form.regular, premium: +form.premium },
      availableSeats: 50,
      totalSeats: 60,
    };

    const updated = [newShow, ...shows];
    setShows(updated);
    localStorage.setItem('imovies_demo_shows', JSON.stringify(updated));
    toast.success('Demo show created successfully');
    setShowAddModal(false);
  };

  const delShow = (id) => {
    if (!window.confirm('Delete this show?')) return;
    const updated = shows.filter((s) => s._id !== id);
    setShows(updated);
    localStorage.setItem('imovies_demo_shows', JSON.stringify(updated));
    toast.success('Show deleted');
  };

  return (
    <div className="container py-4">
      {/* Header and Add Show Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">
          Admin <span className="title-highlight">Shows</span>
        </h2>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
          style={{ borderColor: '#e50914', color: '#e50914' }}
          onClick={() => setShowAddModal(!showAddModal)}
        >
          <span>{showAddModal ? '✕ Close Form' : '+ Add Show'}</span>
        </button>
      </div>

      {/* Add Show Form */}
      {showAddModal && (
        <form
          className="auth-card-box mb-5"
          style={{ maxWidth: '780px', margin: '0 auto 30px' }}
          onSubmit={submitShow}
        >
          <h4 className="text-white mb-3">Create New Show</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Movie</label>
              <select
                className="form-select"
                required
                value={form.movie}
                onChange={(e) => setForm({ ...form, movie: e.target.value })}
              >
                {MOCK_MOVIES.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Theatre</label>
              <select
                className="form-select"
                required
                value={form.theatre}
                onChange={(e) => setForm({ ...form, theatre: e.target.value })}
              >
                {MOCK_THEATRES.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Screen</label>
              <input
                type="text"
                className="form-control"
                value={form.screenName}
                onChange={(e) => setForm({ ...form, screenName: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Show Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Regular ₹</label>
              <input
                type="number"
                className="form-control"
                value={form.regular}
                onChange={(e) => setForm({ ...form, regular: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Premium ₹</label>
              <input
                type="number"
                className="form-control"
                value={form.premium}
                onChange={(e) => setForm({ ...form, premium: e.target.value })}
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn-submit-red" style={{ width: 'auto', padding: '10px 30px' }}>
                Save Show
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Shows Grid matching Image 4 */}
      {shows.length === 0 ? (
        <div className="alert alert-dark text-secondary mb-5">No shows currently scheduled.</div>
      ) : (
        <div className="row g-4 mb-5">
          {shows.map((s) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={s._id}>
              <div className="admin-card-tile">
                <div>
                  {/* Video Camera Icon */}
                  <div className="card-icon-header">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 10l5-3v10l-5-3v-4z"></path>
                      <rect x="2" y="6" width="13" height="12" rx="2"></rect>
                    </svg>
                  </div>

                  <div className="card-line">
                    <strong>Movie:</strong> {s.movieTitle || s.movie?.title || 'Og'}
                  </div>
                  <div className="card-line">
                    <strong>Theatre:</strong> {s.theatreName || s.theatre?.name || 'Srinivasa'}
                  </div>
                  <div className="card-line">
                    <strong>Showdate:</strong> {fmtDate(s.startTime)}
                  </div>
                  <div className="card-line">
                    <strong>Showtime:</strong> {fmtTime(s.startTime)}
                  </div>
                </div>

                {/* Red outline delete button with trash icon */}
                <button
                  type="button"
                  className="btn-card-trash"
                  onClick={() => delShow(s._id)}
                  title="Delete Show"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Bookings Section matching Image 4 */}
      <h2 className="section-title mt-5 mb-4">
        All <span className="title-highlight">Bookings</span>
      </h2>

      <div className="row g-4 mb-4">
        {bookings.map((b) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={b._id}>
            <div className="admin-card-tile">
              <div>
                <div className="card-icon-header">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 10l5-3v10l-5-3v-4z"></path>
                    <rect x="2" y="6" width="13" height="12" rx="2"></rect>
                  </svg>
                </div>

                <div className="card-line">
                  <strong>User:</strong> {b.userEmail}
                </div>
                <div className="card-line">
                  <strong>Movie:</strong> {b.movieTitle}
                </div>
                <div className="card-line">
                  <strong>Theatre:</strong> {b.theatreName}
                </div>
                <div className="card-line">
                  <strong>Showdate:</strong> {b.showDate}
                </div>
                <div className="card-line">
                  <strong>Showtime:</strong> {b.showTime}
                </div>
                <div className="card-line">
                  <strong>Seats:</strong> {b.seats?.join(', ')}
                </div>
                <div className="card-line">
                  <strong>Amount:</strong> {inr(b.amount)}
                </div>
                <div className="card-line">
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color: b.status === 'confirmed' ? '#4ade80' : '#f87171',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
