import { useEffect } from 'react';

function SuccessIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// status: 'success' | 'error'
export default function PaymentResultModal({ status, title, message, onClose }) {
  const isSuccess = status === 'success';

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`payment-result-card ${isSuccess ? 'payment-result-success' : 'payment-result-error'}`}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-live="assertive"
      >
        <div className="payment-result-icon">{isSuccess ? <SuccessIcon /> : <ErrorIcon />}</div>
        <h2 className="payment-result-title">{title}</h2>
        <p className="payment-result-message">{message}</p>
        <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
          {isSuccess ? 'Go to dashboard' : 'Back to dashboard'}
        </button>
      </div>
    </div>
  );
}