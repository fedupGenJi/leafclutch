import { useEffect } from 'react';
import CourseIcon from './CourseIcon';
import { formatPrice } from '../data/courses';

export default function CourseModal({ course, price, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

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
        <div className="modal-price-row">
          <span className="modal-price">{formatPrice(price)}</span>
          <button type="button" className="btn btn-primary">
            Enroll now
          </button>
        </div>
      </div>
    </div>
  );
}
