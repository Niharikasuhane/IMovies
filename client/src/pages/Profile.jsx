import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { demoLogin } from '../app/authSlice';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@imovies.com',
    phone: user?.phone || '+91 98765 43210',
    city: user?.city || 'Hyderabad',
    preferredLanguage: user?.preferredLanguage || 'Telugu',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors');
      return;
    }

    const updatedUser = {
      ...user,
      ...form,
    };

    dispatch(demoLogin({ user: updatedUser }));
    toast.success('Profile updated successfully in demo state!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || 'User',
      email: user?.email || 'user@imovies.com',
      phone: user?.phone || '+91 98765 43210',
      city: user?.city || 'Hyderabad',
      preferredLanguage: user?.preferredLanguage || 'Telugu',
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '640px' }}>
      <div
        className="card shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          borderRadius: '8px',
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">
              User <span className="title-highlight">Profile</span>
            </h2>
            <span
              className="badge"
              style={{
                backgroundColor: user?.role === 'admin' ? '#e50914' : '#2563eb',
                fontSize: '0.85rem',
                padding: '6px 12px',
              }}
            >
              {user?.role === 'admin' ? '👑 Admin' : '👤 Standard User'}
            </span>
          </div>

          <form onSubmit={handleSave}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid border-danger' : ''}`}
                value={form.name}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid border-danger' : ''}`}
                value={form.email}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={form.phone}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label text-secondary small">City</label>
              <input
                type="text"
                className="form-control"
                value={form.city}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            {/* Preferred Language */}
            <div className="mb-4">
              <label className="form-label text-secondary small">Preferred Cinema Language</label>
              <select
                className="form-select"
                value={form.preferredLanguage}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
              >
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Kannada">Kannada</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 justify-content-end mt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-red"
                    style={{ width: 'auto', padding: '8px 24px' }}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-submit-red"
                  style={{ width: 'auto', padding: '8px 24px' }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
