import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fmtDateTime } from '../utils/format';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);

  const [upcoming] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('imovies_my_bookings') || '[]');
      if (saved.length > 0) return saved.slice(0, 3);
    } catch {
      // ignore
    }
    return [
      {
        _id: 'b1',
        show: {
          movie: { title: 'Rrr' },
          startTime: '2025-11-14T14:00:00.000Z',
        },
        seatLabels: ['A4', 'A5'],
      },
    ];
  });

  const [notes, setNotes] = useState([
    { _id: 'n1', title: 'Welcome to iMovies Demo', message: 'Browse blockbusters and explore showtimes anytime!', read: false },
    { _id: 'n2', title: 'Special Weekend Release', message: 'New blockbusters added to Available Movies.', read: true },
  ]);

  const markRead = () => setNotes(notes.map((n) => ({ ...n, read: true })));

  return (
    <div className="container py-4">
      <h2 className="section-title">
        Hello, <span className="title-highlight">{user?.name || 'User'}</span> 👋
      </h2>
      <p className="text-secondary mb-4">
        {user?.email || 'user@imovies.com'} {user?.city && `• ${user.city}`}
      </p>

      <div className="row g-4">
        <div className="col-md-6">
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="card-body p-4">
              <h5 className="text-white mb-3">Upcoming bookings</h5>
              {upcoming.length === 0 ? (
                <p className="text-secondary">
                  Nothing booked yet.{' '}
                  <Link to="/" style={{ color: '#e50914' }}>
                    Browse movies
                  </Link>
                </p>
              ) : (
                upcoming.map((b) => (
                  <div
                    key={b._id}
                    className="py-2 mb-2"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <strong className="text-white">{b.show?.movie?.title}</strong>
                    <div className="small text-secondary">
                      {b.show && fmtDateTime(b.show.startTime)} • {b.seatLabels?.join(', ')}
                    </div>
                  </div>
                ))
              )}
              <div className="mt-3">
                <Link to="/my-bookings" style={{ color: '#e50914', fontWeight: 600 }}>
                  View all bookings →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white mb-0">Notifications</h5>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ color: '#e50914', padding: 0 }}
                  onClick={markRead}
                >
                  Mark all read
                </button>
              </div>
              {notes.map((n) => (
                <div
                  key={n._id}
                  className={`py-2 mb-1 ${n.read ? 'text-secondary' : 'text-white'}`}
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <strong>{n.title}</strong>
                  </div>
                  <div className="small text-secondary">{n.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
