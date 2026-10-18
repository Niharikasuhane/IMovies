import { useState } from 'react';
import { toast } from 'react-toastify';
import AdminNav from './AdminNav';
import { MOCK_THEATRES } from '../../mock/moviesData';

export default function AdminTheatres() {
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem('imovies_demo_theatres');
    return saved ? JSON.parse(saved) : MOCK_THEATRES;
  });

  const [form, setForm] = useState({
    name: '',
    location: '',
    balconyPrice: 0,
    balconySeats: 0,
    middlePrice: 0,
    middleSeats: 0,
    lowerPrice: 0,
    lowerSeats: 0,
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Theatre name is required');
    if (!form.location.trim()) return toast.error('Theatre location is required');

    const newTheatre = {
      _id: 't_' + Date.now(),
      name: form.name.trim(),
      city: form.location.split(',')[1]?.trim() || form.location.trim(),
      location: form.location.trim(),
      screens: ['Screen 1', 'Screen 2'],
      balconyPrice: +form.balconyPrice || 0,
      balconySeats: +form.balconySeats || 0,
      middlePrice: +form.middlePrice || 0,
      middleSeats: +form.middleSeats || 0,
      lowerPrice: +form.lowerPrice || 0,
      lowerSeats: +form.lowerSeats || 0,
    };

    const updated = [newTheatre, ...list];
    setList(updated);
    localStorage.setItem('imovies_demo_theatres', JSON.stringify(updated));
    toast.success('Theatre added successfully to demo dataset');
    setForm({
      name: '',
      location: '',
      balconyPrice: 0,
      balconySeats: 0,
      middlePrice: 0,
      middleSeats: 0,
      lowerPrice: 0,
      lowerSeats: 0,
    });
  };

  const del = (id) => {
    if (!window.confirm('Delete this theatre?')) return;
    const updated = list.filter((t) => t._id !== id);
    setList(updated);
    localStorage.setItem('imovies_demo_theatres', JSON.stringify(updated));
    toast.success('Theatre deleted');
  };

  return (
    <div className="container py-4">
      <AdminNav />

      {/* ADD THEATRE FORM MATCHING SCREENSHOT */}
      <div
        className="card mb-5 mx-auto"
        style={{
          maxWidth: '560px',
          backgroundColor: '#151d2a',
          borderColor: 'var(--border-subtle)',
          borderRadius: '8px',
        }}
      >
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-bold mb-4">
            Add <span style={{ color: '#e50914' }}>Theatre</span>
          </h2>

          <form onSubmit={submit}>
            {/* Theatre Name */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Theatre Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Theatre Name"
                required
                value={form.name}
                onChange={set('name')}
              />
            </div>

            {/* Theatre Location */}
            <div className="mb-4">
              <label className="form-label text-secondary small">Theatre Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Theatre Location"
                required
                value={form.location}
                onChange={set('location')}
              />
            </div>

            {/* 2 Column Pricing and Seats Grid matching screenshot */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label text-secondary small">Balcony Seat Price</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.balconyPrice}
                  onChange={set('balconyPrice')}
                />
              </div>
              <div className="col-6">
                <label className="form-label text-secondary small">Balcony Seat Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.balconySeats}
                  onChange={set('balconySeats')}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label text-secondary small">Middle Seat Price</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.middlePrice}
                  onChange={set('middlePrice')}
                />
              </div>
              <div className="col-6">
                <label className="form-label text-secondary small">Middle Seat Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.middleSeats}
                  onChange={set('middleSeats')}
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label text-secondary small">Lower Seat Price</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.lowerPrice}
                  onChange={set('lowerPrice')}
                />
              </div>
              <div className="col-6">
                <label className="form-label text-secondary small">Lower Seat Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.lowerSeats}
                  onChange={set('lowerSeats')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn-submit-red"
                style={{ maxWidth: '120px', padding: '8px 24px', borderRadius: '6px' }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* EXISTING THEATRES LIST */}
      <div className="card" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="card-body p-4">
          <h4 className="text-white mb-3">Existing Theatres</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'var(--bg-card)' }}>
              <thead>
                <tr>
                  <th>Theatre Name</th>
                  <th>Location</th>
                  <th>Balcony (₹ / Seats)</th>
                  <th>Middle (₹ / Seats)</th>
                  <th>Lower (₹ / Seats)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <strong className="text-white">{t.name}</strong>
                    </td>
                    <td>{t.location || t.city}</td>
                    <td>
                      ₹{t.balconyPrice || 300} ({t.balconySeats || 30})
                    </td>
                    <td>
                      ₹{t.middlePrice || 200} ({t.middleSeats || 60})
                    </td>
                    <td>
                      ₹{t.lowerPrice || 150} ({t.lowerSeats || 40})
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        style={{ borderColor: '#e50914', color: '#e50914' }}
                        onClick={() => del(t._id)}
                      >
                        Delete
                      </button>
                    </td>
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
