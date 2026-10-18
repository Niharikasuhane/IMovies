import { useState } from 'react';
import AdminNav from './AdminNav';
import { inr } from '../../utils/format';

export default function AdminDashboard() {
  const [stats] = useState({
    users: 142,
    movies: 10,
    theatres: 6,
    upcomingShows: 24,
    bookings: 68,
    revenue: 28450,
    topMovies: [
      { _id: 'm1', title: 'Rrr', tickets: 184, revenue: 38640 },
      { _id: 'm2', title: 'Baahubali 2: the conclusion', tickets: 156, revenue: 32760 },
      { _id: 'm3', title: 'Og', tickets: 138, revenue: 27600 },
      { _id: 'm7', title: 'Kalki 2898 AD', tickets: 112, revenue: 24640 },
    ],
  });

  const cards = [
    ['Users', stats.users],
    ['Movies', stats.movies],
    ['Theatres', stats.theatres],
    ['Upcoming shows', stats.upcomingShows],
    ['Confirmed bookings', stats.bookings],
    ['Revenue', inr(stats.revenue)],
  ];

  return (
    <div className="container py-4">
      <h2 className="section-title">
        Admin <span className="title-highlight">Dashboard</span>
      </h2>
      <AdminNav />
      <div className="row g-3 mb-4">
        {cards.map(([k, v]) => (
          <div className="col-6 col-md-4 col-lg-2" key={k}>
            <div
              className="card text-center p-3 h-100"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="small text-muted">{k}</div>
              <div className="fs-4 fw-bold mt-1 text-white">{v}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="card-body p-4">
          <h5 className="text-white mb-3">Top movies by tickets sold</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'var(--bg-card)' }}>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Tickets</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topMovies.map((m) => (
                  <tr key={m._id}>
                    <td>{m.title}</td>
                    <td>{m.tickets}</td>
                    <td>{inr(m.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
