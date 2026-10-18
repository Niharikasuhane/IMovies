import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { demoLogin } from '../app/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the errors in the form');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const isAdmin = form.email.toLowerCase().includes('admin');
      const demoUserData = {
        _id: 'usr_' + Date.now(),
        name: form.email.split('@')[0] || 'User',
        email: form.email.trim(),
        role: isAdmin ? 'admin' : 'user',
        city: 'Hyderabad',
      };

      dispatch(demoLogin({ user: demoUserData, token: 'demo-token-' + Date.now() }));
      toast.success(`Demo login successful as ${isAdmin ? 'Admin' : 'User'}! Welcome to iMovies.`);
      setIsSubmitting(false);
      navigate('/');
    }, 400);
  };

  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setForm({ email: 'admin@imovies.com', password: 'Admin@123' });
      toast.info('Filled Demo Admin credentials');
    } else {
      setForm({ email: 'user@imovies.com', password: 'User@123' });
      toast.info('Filled Demo User credentials');
    }
    setErrors({});
  };

  return (
    <div className="container py-4 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '82vh' }}>
      {/* Demo Notice Banner */}
      <div
        className="alert alert-dark py-2 px-3 mb-3 text-center small text-secondary"
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: 'rgba(22, 30, 46, 0.8)',
          borderColor: 'var(--border-subtle)',
          borderRadius: '6px',
        }}
      >
        <strong className="text-white">Frontend Demo Flow:</strong> Enter any credentials or{' '}
        <span
          role="button"
          onClick={() => fillDemoAccount('user')}
          className="text-danger fw-semibold"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          User
        </span>{' '}
        /{' '}
        <span
          role="button"
          onClick={() => fillDemoAccount('admin')}
          className="text-danger fw-semibold"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          Admin
        </span>
      </div>

      <div className="auth-card-box">
        {/* Logo and Subtitle matching reference screenshot */}
        <h2 className="text-center fw-bold mb-1">
          <span style={{ color: '#e50914' }}>i</span>Movies
        </h2>
        <div className="auth-card-title">Login</div>

        <form onSubmit={submit} noValidate>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="loginEmail">
              Email
            </label>
            <input
              id="loginEmail"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid border-danger' : ''}`}
              placeholder="Enter your email"
              value={form.email}
              onChange={handleInputChange('email')}
              autoComplete="email"
            />
            {errors.email && (
              <div className="invalid-feedback d-block text-danger small mt-1">
                {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label" htmlFor="loginPassword">
              Password
            </label>
            <input
              id="loginPassword"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid border-danger' : ''}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleInputChange('password')}
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="invalid-feedback d-block text-danger small mt-1">
                {errors.password}
              </div>
            )}
          </div>

          {/* Show Password Checkbox */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="showLoginPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label className="form-check-label text-secondary small" htmlFor="showLoginPassword" style={{ cursor: 'pointer' }}>
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit-red" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Submit'}
          </button>
        </form>

        {/* Link to Register */}
        <div className="auth-link-text">
          Create an account{' '}
          <Link to="/register" className="auth-link-red">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
