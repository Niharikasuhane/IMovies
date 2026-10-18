import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { resetBooking } from '../app/bookingSlice';
import { fmtDateTime, inr } from '../utils/format';

export default function Payment() {
  const { show, booking, selectedSeats } = useSelector((s) => s.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState('4111 1111 1111 1111');
  const [busy, setBusy] = useState(false);

  if (!booking || !show) return <Navigate to="/" replace />;

  const pay = (e) => {
    e.preventDefault();
    setBusy(true);

    setTimeout(() => {
      // Simulate failed card if ends with 0000
      if (card.endsWith('0000')) {
        toast.error('Payment failed: Card declined (Demo simulation)');
        setBusy(false);
        return;
      }

      const confirmedBooking = {
        _id: booking._id,
        bookingCode: booking.bookingCode || 'IM-' + Math.floor(100000 + Math.random() * 900000),
        show,
        seatLabels: booking.seatLabels,
        totalAmount: booking.totalAmount,
        status: 'confirmed',
        payment: {
          method,
          transactionId: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
        },
      };

      // Save to localStorage for My Bookings
      try {
        const saved = JSON.parse(localStorage.getItem('imovies_my_bookings') || '[]');
        localStorage.setItem('imovies_my_bookings', JSON.stringify([confirmedBooking, ...saved]));
      } catch (err) {
        console.error('Error saving booking:', err);
      }

      toast.success('Payment successful!');
      dispatch(resetBooking());
      navigate(`/confirmation/${confirmedBooking._id}`, {
        state: { booking: confirmedBooking },
        replace: true,
      });
    }, 500);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div
            className="card shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-white mb-0">Payment</h3>
                <span className="badge bg-warning text-dark fs-6">⏱ 04:59</span>
              </div>
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <p className="mb-1 text-white">
                <strong>{show.movie?.title}</strong> — {show.theatre?.name}
              </p>
              <p className="mb-2 text-secondary">
                {fmtDateTime(show.startTime)} • {show.screenName}
              </p>
              <p className="text-secondary">
                Seats: <strong className="text-white">{booking.seatLabels?.join(', ')}</strong> (
                {selectedSeats?.length || booking.seatLabels?.length} tickets)
              </p>
              <h4 className="my-3 text-white">Total: {inr(booking.totalAmount)}</h4>

              <form onSubmit={pay}>
                <div className="mb-3">
                  {['card', 'upi', 'netbanking', 'wallet'].map((m) => (
                    <div className="form-check form-check-inline" key={m}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id={m}
                        checked={method === m}
                        onChange={() => setMethod(m)}
                      />
                      <label
                        className="form-check-label text-capitalize text-secondary"
                        htmlFor={m}
                      >
                        {m}
                      </label>
                    </div>
                  ))}
                </div>

                {method === 'card' && (
                  <div className="mb-3">
                    <label className="form-label">Card number</label>
                    <input
                      className="form-control"
                      value={card}
                      onChange={(e) => setCard(e.target.value)}
                      maxLength={19}
                      required
                    />
                    <div className="form-text text-secondary">
                      Demo gateway: any number works; ending in <code>0000</code> simulates failure.
                    </div>
                  </div>
                )}

                <button className="btn-submit-red w-100 mt-2" disabled={busy}>
                  {busy ? 'Processing...' : `Pay ${inr(booking.totalAmount)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
