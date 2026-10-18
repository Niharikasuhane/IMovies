import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setBooking, setSelectedSeats, setShow } from '../app/bookingSlice';
import Loader from '../components/Loader';
import { fmtDateTime, inr } from '../utils/format';
import { MOCK_SHOWS, MOCK_MOVIES } from '../mock/moviesData';

const MAX = 8;

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Find or mock show
  const show = useMemo(() => {
    const found = MOCK_SHOWS.find((s) => s._id === showId);
    if (found) {
      return {
        ...found,
        movie: { title: found.movieTitle },
        theatre: { name: found.theatreName, city: found.city },
      };
    }
    const movie = MOCK_MOVIES[0];
    return {
      _id: showId,
      movie: { title: movie.title },
      theatre: { name: 'Srinivasa 4K Dolby Atmos', city: 'Hyderabad' },
      screenName: 'Screen 1',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      price: { regular: 180, premium: 300 },
    };
  }, [showId]);

  // Generate demo seat map (Rows A-E, 10 seats per row)
  const [seats] = useState(() => {
    const rowsList = ['A', 'B', 'C', 'D', 'E'];
    const generated = [];
    rowsList.forEach((r, rIdx) => {
      const isPremium = r === 'A' || r === 'B';
      for (let n = 1; n <= 10; n++) {
        // pre-book a few demo seats
        const isBooked = (r === 'C' && (n === 4 || n === 5)) || (r === 'D' && n === 8);
        generated.push({
          _id: `${r}${n}`,
          row: r,
          number: n,
          label: `${r}${n}`,
          type: isPremium ? 'premium' : 'regular',
          price: isPremium ? 300 : 180,
          status: isBooked ? 'booked' : 'available',
        });
      }
    });
    return generated;
  });

  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const m = {};
    seats.forEach((s) => (m[s.row] = m[s.row] || []).push(s));
    return Object.entries(m);
  }, [seats]);

  const toggle = (seat) => {
    const isMine = selected.includes(seat._id);
    if (!isMine && seat.status !== 'available') return;
    if (!isMine && selected.length >= MAX) return toast.warn(`Max ${MAX} seats per booking`);
    setSelected(isMine ? selected.filter((i) => i !== seat._id) : [...selected, seat._id]);
  };

  const chosen = seats.filter((s) => selected.includes(s._id));
  const total = chosen.reduce((a, s) => a + s.price, 0);

  const proceed = () => {
    setBusy(true);
    setTimeout(() => {
      const demoBooking = {
        _id: 'b_' + Date.now(),
        bookingCode: 'IM-' + Math.floor(100000 + Math.random() * 900000),
        seatLabels: chosen.map((s) => s.label),
        totalAmount: total,
        expiresAt: new Date(Date.now() + 300000).toISOString(),
        status: 'pending',
      };

      dispatch(setShow(show));
      dispatch(setSelectedSeats(chosen));
      dispatch(setBooking({ booking: demoBooking, lockedUntil: demoBooking.expiresAt }));
      setBusy(false);
      navigate('/payment');
    }, 300);
  };

  if (!show) return <Loader />;
  const cls = (s) => `seat ${s.type} ${selected.includes(s._id) ? 'selected' : s.status}`;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <h3 className="text-white fw-bold">{show.movie.title}</h3>
          <p className="text-secondary">
            {show.theatre.name}, {show.theatre.city} • {show.screenName} • {fmtDateTime(show.startTime)}
          </p>
          <div className="screen" />
          <div className="text-center small text-secondary mb-3">All eyes this way — SCREEN</div>
          <div className="text-center" style={{ overflowX: 'auto' }}>
            {rows.map(([row, list]) => (
              <div key={row} className="d-flex justify-content-center align-items-center mb-1">
                <span className="me-2 fw-bold text-secondary" style={{ width: 16 }}>
                  {row}
                </span>
                {list.map((s) => (
                  <button
                    key={s._id}
                    className={cls(s)}
                    title={`${s.label} • ${inr(s.price)} • ${s.type}`}
                    disabled={s.status === 'booked'}
                    onClick={() => toggle(s)}
                  >
                    {s.number}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 small text-secondary">
            <span className="me-3">
              <span className="legend-box" style={{ background: 'var(--bg-card)' }} />
              Available
            </span>
            <span className="me-3">
              <span className="legend-box" style={{ background: '#e50914' }} />
              Selected
            </span>
            <span className="me-3">
              <span className="legend-box" style={{ background: '#475569' }} />
              Booked
            </span>
            <span>
              <span className="legend-box" style={{ borderColor: '#ffc107' }} />
              Premium
            </span>
          </div>
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div
            className="card shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="card-body p-4">
              <h5 className="text-white mb-3">Booking Summary</h5>
              <p className="mb-2 text-secondary">
                Seats: <strong className="text-white">{chosen.map((s) => s.label).join(', ') || '—'}</strong>
              </p>
              <p className="mb-2 text-secondary">
                Tickets: <strong className="text-white">{chosen.length}</strong>
              </p>
              <h3 className="my-3 text-white fw-bold">{inr(total)}</h3>
              <button
                className="btn-submit-red w-100"
                disabled={!selected.length || busy}
                onClick={proceed}
              >
                {busy ? 'Holding seats...' : 'Proceed to Payment'}
              </button>
              <p className="small text-muted mt-3 mb-0">Seats are held for 5 minutes once you proceed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
