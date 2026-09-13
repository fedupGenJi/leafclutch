import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PaymentResultModal from '../components/PaymentResultModal';
import { verifyKhaltiPayment, extractError } from '../api/client';
import '../styles/dashboard.css';

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null); // { status: 'success' | 'error', title, message }

  useEffect(() => {
    const token = localStorage.getItem('leaftech_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const pidx = searchParams.get('pidx');
    if (!pidx) {
      setResult({
        status: 'error',
        title: 'Payment not found',
        message: 'We could not find a payment to verify. If you were charged, please contact support.'
      });
      return;
    }

    verifyKhaltiPayment(pidx)
      .then((data) => {
        setResult({
          status: data.success ? 'success' : 'error',
          title: data.success ? 'Payment successful' : 'Payment not completed',
          message: data.success
            ? `You're enrolled in ${data.course}. Our moderators will reach out and guide you through the next steps shortly. A confirmation email is on its way.`
            : data.message || 'Something went wrong with your payment.'
        });
      })
      .catch((err) => {
        setResult({
          status: 'error',
          title: 'Verification failed',
          message: extractError(err)
        });
      });
  }, [searchParams, navigate]);

  return (
    <div className="dashboard">
      <header className="dashboard-nav">
        <div className="container dashboard-nav-inner">
          <Link to="/" className="mark">
            <span className="mark-swatch" />
            LeafClutch
          </Link>
        </div>
      </header>

      <main className="container dashboard-main">
        {!result && <p className="dashboard-greeting">Verifying your payment…</p>}
      </main>

      {result && (
        <PaymentResultModal
          status={result.status}
          title={result.title}
          message={result.message}
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}