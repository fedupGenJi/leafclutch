import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  isValidGmail,
  isStrongPassword,
  PASSWORD_RULES,
  formatPhoneInput,
  phoneDigits,
  isValidPhoneDigits
} from '../utils/validators';
import { signup, extractError } from '../api/client';
import '../styles/auth.css';

const initialTouched = { name: false, email: false, phone: false, password: false };

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [touched, setTouched] = useState(initialTouched);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const errors = {
    name: form.name.trim().length < 2 ? 'Enter your full name.' : '',
    email: !isValidGmail(form.email) ? 'Enter a valid Gmail address, e.g. name@gmail.com' : '',
    phone: !isValidPhoneDigits(phoneDigits(form.phone)) ? 'Enter a 10 digit phone number.' : '',
    password: !isStrongPassword(form.password) ? 'Password does not meet the requirements.' : ''
  };
  const isValid = Object.values(errors).every((e) => !e);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true });
    if (!isValid) return;

    setSubmitting(true);
    setServerError('');
    try {
      const { token, user } = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: phoneDigits(form.phone),
        password: form.password
      });
      localStorage.setItem('leaftech_token', token);
      localStorage.setItem('leaftech_user', JSON.stringify(user));
      navigate('/dashboard');
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
          LeafClutch
        </Link>
      </div>

      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-heading">Create your account</h1>
          <p className="auth-sub">
            Already learning with us? <Link to="/login">Log in</Link>
          </p>

          {serverError && <div className="banner banner-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                onBlur={() => blur('name')}
                className={touched.name && errors.name ? 'invalid' : ''}
                placeholder="Aarav Shrestha"
                autoComplete="name"
              />
              {touched.name && errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="email">Gmail address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                onBlur={() => blur('email')}
                className={touched.email && errors.email ? 'invalid' : ''}
                placeholder="you@gmail.com"
                autoComplete="email"
              />
              {touched.email && errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <div className={`phone-input ${touched.phone && errors.phone ? 'invalid' : ''}`}>
                <span className="prefix">+977</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => update('phone', formatPhoneInput(e.target.value))}
                  onBlur={() => blur('phone')}
                  placeholder="980-7806602"
                  autoComplete="tel-national"
                />
              </div>
              {touched.phone && errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                onBlur={() => blur('password')}
                className={touched.password && errors.password ? 'invalid' : ''}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              <ul className="password-checklist">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(form.password);
                  return (
                    <li key={rule.key} className={met ? 'met' : ''}>
                      <span className="dot" />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
