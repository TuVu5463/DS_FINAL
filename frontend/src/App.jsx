import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, BarChart3, Code2, Trophy } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiMessage, setApiMessage] = useState('Checking FastAPI connection…');

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${API_BASE_URL}/api/health`, { timeout: 5000 })
      .then((response) => {
        if (!isMounted) return;
        setApiStatus('online');
        setApiMessage(response.data.message || 'FastAPI is available.');
      })
      .catch(() => {
        if (!isMounted) return;
        setApiStatus('offline');
        setApiMessage('Cannot reach the backend. Start FastAPI on port 8000.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <nav className="topbar">
        <a className="brand" href="/" aria-label="AFC Predictor home">
          <span className="brand-mark"><Trophy size={19} /></span>
          <span>AFC <strong>2027</strong></span>
        </a>
        <span className="topbar-label">FOOTBALL ANALYTICS</span>
      </nav>

      <section className="hero">
        <div className="eyebrow"><Activity size={15} /> DATA-DRIVEN FOOTBALL ANALYTICS</div>
        <h1>Predict the game.<br /><span>Understand the probabilities.</span></h1>
        <p className="hero-copy">
          An analytical platform for match predictions, scoreline probabilities,
          and AFC Asian Cup 2027 tournament simulations.
        </p>

        <div className={`status-card status-${apiStatus}`}>
          <span className="status-dot" />
          <div>
            <strong>Backend status: {apiStatus}</strong>
            <p>{apiMessage}</p>
          </div>
        </div>
      </section>

      <section className="module-grid" aria-label="Planned application modules">
        <article className="module-card">
          <Trophy size={22} />
          <h2>Tournament overview</h2>
          <p>Explore title probabilities and the chance of reaching each round.</p>
          <span>PLANNED MODULE</span>
        </article>
        <article className="module-card">
          <BarChart3 size={22} />
          <h2>Match predictor</h2>
          <p>Compare two teams, estimate 1X2 probabilities, and inspect scorelines.</p>
          <span>PLANNED MODULE</span>
        </article>
        <article className="module-card">
          <Activity size={22} />
          <h2>Tournament simulator</h2>
          <p>Run Monte Carlo simulations of the group stage and knockout rounds.</p>
          <span>PLANNED MODULE</span>
        </article>
      </section>

      <footer className="footer">
        <Code2 size={15} /> React frontend · FastAPI backend · Prediction models under development
      </footer>
    </main>
  );
}
