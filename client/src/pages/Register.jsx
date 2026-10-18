import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { demoRegister } from '../app/authSlice';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [asAdmin, setAsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.username.trim()) {
      errs.username = 'Username is required';
    } else if (form.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

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

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Confirm Password is required';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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

  const toggleAdmin = () => {
    const next = !asAdmin;
    setAsAdmin(next);
    if (next) {
      toast.info('Role set to Admin for this registration');
    } else {
      toast.info('Role set to Standard User');
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const demoUserData = {
        _id: 'usr_' + Date.now(),
        name: form.username.trim(),
        email: form.email.trim(),
        role: asAdmin ? 'admin' : 'user',
        city: 'Hyderabad',
      };

      dispatch(demoRegister({ user: demoUserData, token: 'demo-token-' + Date.now() }));
      toast.success(`Demo registration successful as ${asAdmin ? 'Admin' : 'User'}! Welcome to iMovies.`);
      setIsSubmitting(false);
      navigate('/');
    }, 400);
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
        <strong className="text-white">Frontend Demo Flow:</strong> Register with any demo details
      </div>

      <div className="auth-card-box">
        {/* Brand header */}
        <h2 className="text-center fw-bold mb-1">
          <span style={{ color: '#e50914' }}>i</span>Movies
        </h2>
        <div className="auth-card-title">
          Register{asAdmin ? ' as Admin' : ''}
        </div>

        <form onSubmit={submit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label" htmlFor="registerUsername">
              Username
            </label>
            <input
              id="registerUsername"
              type="text"
              className={`form-control ${errors.username ? 'is-invalid border-danger' : ''}`}
              placeholder="Enter Username"
              value={form.username}
              onChange={handleInputChange('username')}
              autoComplete="username"
            />
            {errors.username && (
              <div className="invalid-feedback d-block text-danger small mt-1">
                {errors.username}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="registerEmail">
              Email
            </label>
            <input
              id="registerEmail"
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
            <label className="form-label" htmlFor="registerPassword">
              Password
            </label>
            <input
              id="registerPassword"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid border-danger' : ''}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleInputChange('password')}
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="invalid-feedback d-block text-danger small mt-1">
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label" htmlFor="registerConfirmPassword">
              Confirm Password
            </label>
            <input
              id="registerConfirmPassword"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.confirmPassword ? 'is-invalid border-danger' : ''}`}
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block text-danger small mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Show Password Checkbox */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="showRegisterPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label className="form-check-label text-secondary small" htmlFor="showRegisterPassword" style={{ cursor: 'pointer' }}>
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit-red" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Links */}
        <div className="auth-link-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link-red">
            Login
          </Link>
        </div>

        <div className="auth-link-text mt-2">
          Register as an{' '}
          <span
            role="button"
            className="auth-link-red"
            onClick={toggleAdmin}
            style={{ fontWeight: asAdmin ? 700 : 600, textDecoration: asAdmin ? 'underline' : 'none' }}
          >
            {asAdmin ? 'Standard User' : 'Admin'}
          </span>
        </div>
      </div>
    </div>
  );
}
