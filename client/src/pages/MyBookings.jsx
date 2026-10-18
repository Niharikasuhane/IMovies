import { useState } from 'react';
import { toast } from 'react-toastify';
import { fmtDateTime, inr } from '../utils/format';

const tabs = [
  ['upcoming', 'Upcoming'],
  ['past', 'Past'],
  ['cancelled', 'Cancelled'],
];

export default function MyBookings() {
  const [tab, setTab] = useState('upcoming');
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('imovies_my_bookings') || '[]');
      if (saved.length > 0) return saved;
    } catch {
      // ignore
    }

    // Default demo bookings
    return [
      {
        _id: 'b1',
        bookingCode: 'IM-837492',
        show: {
          movie: { title: 'Rrr' },
          theatre: { name: 'Srinivasa 4K Dolby Atmos', city: 'Hyderabad' },
          screenName: 'Screen 1',
          startTime: '2025-11-14T14:00:00.000Z',
        },
        seatLabels: ['A4', 'A5'],
        totalAmount: 360,
        status: 'confirmed',
      },
      {
        _id: 'b2',
        bookingCode: 'IM-194820',
        show: {
          movie: { title: 'Og' },
          theatre: { name: 'Gokul Theatre', city: 'Hyderabad' },
          screenName: 'Audi 1',
          startTime: '2025-09-25T16:00:00.000Z',
        },
        seatLabels: ['C7', 'C8', 'C9'],
        totalAmount: 540,
        status: 'confirmed',
      },
    ];
  });

  const cancel = (id) => {
    if (!window.confirm('Cancel this booking? A refund will be initiated.')) return;
    const updated = bookings.map((b) =>
      b._id === id ? { ...b, status: 'cancelled' } : b
    );
    setBookings(updated);
    localStorage.setItem('imovies_my_bookings', JSON.stringify(updated));
    toast.success('Booking cancelled. Demo refund initiated.');
  };

  const filtered = bookings.filter((b) => {
    if (tab === 'cancelled') return b.status === 'cancelled';
    if (tab === 'upcoming') return b.status === 'confirmed';
    return false; // past
  });

  return (
    <div className="container py-4">
      <h2 className="section-title">
        My <span className="title-highlight">Bookings</span>
      </h2>

      <ul className="nav nav-pills mb-4">
        {tabs.map(([k, label]) => (
          <li className="nav-item" key={k}>
            <button
              type="button"
              className={`nav-link ${tab === k ? 'active' : ''}`}
              style={
                tab === k
                  ? { backgroundColor: '#e50914', color: '#fff' }
                  : { color: 'var(--text-secondary)' }
              }
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <div className="alert alert-dark text-secondary">
          No {tab} bookings found. Book a movie from Available Movies to see it here!
        </div>
      ) : (
        filtered.map((b) => (
          <div
            className="card mb-3 shadow-sm"
            key={b._id}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="card-body p-4 d-md-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-2 text-white">
                  {b.show?.movie?.title}{' '}
                  <span
                    className={`badge ${
                      b.status === 'confirmed' ? 'bg-success' : 'bg-secondary'
                    } fs-6 ms-2`}
                  >
                    {b.status}
                  </span>
                </h5>
                <div className="small text-secondary mb-1">
                  {b.show?.theatre?.name}, {b.show?.theatre?.city} • {b.show?.screenName}
                </div>
                <div className="small text-secondary mb-1">
                  {b.show && fmtDateTime(b.show.startTime)}
                </div>
                <div className="small text-secondary">
                  Seats: <strong className="text-white">{b.seatLabels?.join(', ')}</strong> • ID:{' '}
                  {b.bookingCode}
                </div>
              </div>
              <div className="text-md-end mt-3 mt-md-0">
                <div className="fs-5 fw-bold text-white mb-2">{inr(b.totalAmount)}</div>
                {tab === 'upcoming' && b.status === 'confirmed' && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    style={{ borderColor: '#e50914', color: '#e50914' }}
                    onClick={() => cancel(b._id)}
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
