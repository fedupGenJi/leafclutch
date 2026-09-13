import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, extractError } from '../api/client';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setServerError('');
    try {
      const { token, user } = await login(form);
      localStorage.setItem('leaftech_token', token);
      localStorage.setItem('leaftech_user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setServerError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container auth-nav">
        <Link to="/" className="mark">
          <span className="mark-swatch" />
          LeafTech
        </Link>
      </div>

      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-sub">
            New to LeafTech? <Link to="/signup">Create an account</Link>
          </p>

          {serverError && <div className="banner banner-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Gmail address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@gmail.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
