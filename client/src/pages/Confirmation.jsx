import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fmtDateTime, inr } from '../utils/format';

export default function Confirmation() {
  const { id } = useParams();
  const location = useLocation();

  const b = useMemo(() => {
    if (location.state?.booking) return location.state.booking;

    try {
      const saved = JSON.parse(localStorage.getItem('imovies_my_bookings') || '[]');
      const found = saved.find((item) => item._id === id);
      if (found) return found;
    } catch {
      // ignore
    }

    return {
      _id: id || 'b_demo',
      bookingCode: 'IM-' + Math.floor(100000 + Math.random() * 900000),
      show: {
        movie: { title: 'Rrr' },
        theatre: { name: 'Srinivasa 4K Dolby Atmos', city: 'Hyderabad' },
        screenName: 'Screen 1',
        startTime: new Date().toISOString(),
      },
      seatLabels: ['A4', 'A5'],
      totalAmount: 360,
      payment: { method: 'card', transactionId: 'TXN-98472911' },
    };
  }, [id, location.state]);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div
            className="card shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: '#4ade80' }}
          >
            <div className="card-body text-center p-4">
              <div style={{ fontSize: 48 }}>✅</div>
              <h3 className="text-success mt-2">Booking Confirmed!</h3>
              <p className="text-secondary">
                Booking ID: <strong className="text-white">{b.bookingCode}</strong>
              </p>
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <h4 className="text-white">{b.show?.movie?.title}</h4>
              <p className="mb-1 text-secondary">
                {b.show?.theatre?.name}, {b.show?.theatre?.city}
              </p>
              <p className="mb-2 text-secondary">
                {b.show?.screenName} • {fmtDateTime(b.show?.startTime)}
              </p>
              <p className="text-secondary">
                Seats: <strong className="text-white">{b.seatLabels?.join(', ')}</strong>
              </p>
              <p className="mb-1 text-secondary">
                Paid: <strong className="text-white">{inr(b.totalAmount)}</strong> (
                {b.payment?.method || 'card'}) • Txn {b.payment?.transactionId}
              </p>
              <div className="mt-4 d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => window.print()}
                >
                  🖨 Print ticket
                </button>
                <Link
                  to="/my-bookings"
                  className="btn-submit-red"
                  style={{ width: 'auto', padding: '8px 20px', textDecoration: 'none' }}
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
