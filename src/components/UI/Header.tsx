import { MATCH } from '../../types';
import { useSeatStore } from '../../store/seatStore';

export function Header() {
  const viewMode = useSeatStore((s) => s.viewMode);
  const exitSeatView = useSeatStore((s) => s.exitSeatView);
  const resetDemo = useSeatStore((s) => s.resetDemo);

  return (
    <header className="header">
      <div className="header-brand">
        <span className="logo">🏏</span>
        <div>
          <h1>ViewMySeat</h1>
          <p className="tagline">See the pitch before you book</p>
        </div>
      </div>

      <div className="match-banner">
        <span className="teams">
          {MATCH.home} <span className="vs">vs</span> {MATCH.away}
        </span>
        <span className="meta">
          {MATCH.venue.split(',')[0]} · {MATCH.time}
        </span>
      </div>

      <div className="header-actions">
        {viewMode === 'seat' && (
          <button className="btn btn-ghost" onClick={exitSeatView}>
            ← Stadium Overview
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={resetDemo} title="Reset demo bookings">
          Reset Demo
        </button>
      </div>
    </header>
  );
}
