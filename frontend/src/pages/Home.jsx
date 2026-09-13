import { Link } from 'react-router-dom';
import BrandIcon from '../components/BrandMark';
import '../styles/home.css';

function ProjectPreview() {
  return (
    <div className="demo-card">
      <div className="demo-titlebar">
        <span className="demo-dots" aria-hidden="true">
          <span className="demo-dot red" />
          <span className="demo-dot yellow" />
          <span className="demo-dot green" />
        </span>
        <span className="demo-filename">Project_Dashboard.js</span>
      </div>
      <div className="demo-body">
        <span className="demo-check">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" stroke="var(--blue)" strokeWidth="1.6" />
            <path d="M7.5 12.5l3 3 6-6.5" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="demo-title">Project Completed Successfully</h3>
        <p className="demo-sub">Hands-on practical deployment verified.</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <header className="container site-nav">
        <span className="brand">
          <BrandIcon />
          LeafClutch
        </span>
        <div className="nav-actions">
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-compact">
            Create account
          </Link>
        </div>
      </header>

      <main className="container">
        <section className="hero-showcase">
          <div className="hero-panel-copy">
            <p className="hero-tag">
              <span className="hero-tag-badge">New approach</span>
              <span className="hero-tag-text">Learn by building, not just watching</span>
            </p>
            <h1 className="hero-heading">LeafClutch Technology</h1>
            <p className="hero-desc">
              Upskill your technical skills with hands on experience in projects. Build
              real-world solutions under expert guidance.
            </p>
            <div className="hero-cta-row">
              <Link to="/signup" className="btn btn-primary">
                Create account
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Log in
              </Link>
            </div>
          </div>
          <div className="hero-panel-demo">
            <ProjectPreview />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; 2026 LeafClutch Technology. Built for practitioners.</p>
      </footer>
    </div>
  );
}
