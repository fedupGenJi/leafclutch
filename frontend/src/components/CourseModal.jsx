import { useEffect, useState } from 'react';
import CourseIcon from './CourseIcon';
import { formatPrice } from '../data/courses';
import { initiateKhaltiPayment, extractError } from '../api/client';

export default function CourseModal({ course, price, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleEnroll() {
    setError('');
    setLoading(true);
    try {
      const { payment_url } = await initiateKhaltiPayment({ course: course.slug, price });
      if (payment_url) {
        window.location.href = payment_url;
        return;
      }
      setError('Could not start payment. Please try again.');
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('leaftech_token');
        localStorage.removeItem('leaftech_user');
        window.location.href = '/login';
        return;
      }
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-icon">
          <CourseIcon slug={course.slug} />
        </div>
        <h2 className="modal-title">{course.name}</h2>
        <p className="modal-description">{course.description}</p>
        {error && <p className="field-error">{error}</p>}
        <div className="modal-price-row">
          <span className="modal-price">{formatPrice(price)}</span>
          <button type="button" className="btn btn-primary" onClick={handleEnroll} disabled={loading}>
            {loading ? 'Redirecting…' : 'Enroll now'}
          </button>
        </div>
      </div>
    </div>
  );
}