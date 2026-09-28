import { MATCH } from '../../types';
import { useSeatStore } from '../../store/seatStore';

export function Header() {
  const viewMode = useSeatStore((s) => s.viewMode);
  const exitSeatView = useSeatStore((s) => s.exitSeatView);
  const resetDemo = useSeatStore((s) => s.resetDemo);

  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo-mark" aria-hidden>
          🏏
        </div>
        <div>
          <h1>ViewMySeat</h1>
          <p className="tagline">Premium cricket seat experience</p>
        </div>
      </div>

      <div className="match-banner">
        <div className="match-teams">
          <span className="team">{MATCH.home}</span>
          <span className="vs">vs</span>
          <span className="team">{MATCH.away}</span>
        </div>
        <div className="match-meta">
          <span className="venue">Hyderabad</span>
          <span className="sep">·</span>
          <span className="time">{MATCH.time}</span>
          <span className="sep">·</span>
          <span className="date">{MATCH.date}</span>
        </div>
      </div>

      <div className="header-actions">
        {viewMode === 'seat' && (
          <button className="btn btn-outline" onClick={exitSeatView}>
            ← Stadium Overview
          </button>
        )}
        <button
          className="btn btn-ghost btn-sm"
          onClick={resetDemo}
          title="Clear demo bookings and restore availability"
        >
          Reset Demo
        </button>
      </div>
    </header>
  );
}
