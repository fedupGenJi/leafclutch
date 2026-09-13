import { Link } from 'react-router-dom';
import '../styles/home.css';

function HeroVisual() {
  return (
    <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="70" y="40" width="280" height="340" rx="16" stroke="#e3e5ee" strokeWidth="2" />
      <rect x="70" y="40" width="280" height="46" rx="16" fill="#eef2fe" />
      <circle cx="95" cy="63" r="5" fill="#2a55e5" />
      <circle cx="115" cy="63" r="5" fill="#c7d3fb" />
      <circle cx="135" cy="63" r="5" fill="#c7d3fb" />
      <line x1="100" y1="120" x2="220" y2="120" stroke="#2a55e5" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="150" x2="320" y2="150" stroke="#e3e5ee" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="180" x2="290" y2="180" stroke="#e3e5ee" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="210" x2="240" y2="210" stroke="#e3e5ee" strokeWidth="3" strokeLinecap="round" />
      <rect x="100" y="250" width="220" height="100" rx="10" fill="#eef2fe" />
      <path d="M140 300l24 24 56-56" stroke="#2a55e5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="container">
      <nav className="home-nav">
        <span className="mark">
          <span className="mark-swatch" />
          LeafTech
        </span>
      </nav>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">Learn by building, not just watching</p>
            <h1 className="hero-title">LeafTech Technology</h1>
            <p className="hero-motto">
              Upskill your technical skills with hands on experience in projects.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary">
                Create account
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Log in
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <HeroVisual />
          </div>
        </div>
      </section>
    </div>
  );
}
