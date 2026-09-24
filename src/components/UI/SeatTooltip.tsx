import { useSeatStore } from '../../store/seatStore';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

export function SeatTooltip() {
  const hoveredId = useSeatStore((s) => s.hoveredId);
  const seats = useSeatStore((s) => s.seats);
  const viewMode = useSeatStore((s) => s.viewMode);

  if (!hoveredId || viewMode === 'seat') return null;
  const seat = seats.find((s) => s.id === hoveredId);
  if (!seat) return null;

  return (
    <div className="seat-tooltip">
      <div className="tooltip-header">
        <span
          className="cat-badge"
          style={{
            background:
              seat.status === 'booked'
                ? STATUS_COLORS.booked
                : seat.status === 'selected'
                  ? STATUS_COLORS.selected
                  : CATEGORY_COLORS[seat.category],
          }}
        >
          {seat.category.toUpperCase()}
        </span>
        <span className={`status status-${seat.status}`}>{seat.status}</span>
      </div>
      <div className="tooltip-body">
        <p>
          <strong>{seat.section}</strong>
        </p>
        <p>
          Row {seat.row} · Seat {seat.number}
        </p>
        <p className="tooltip-price">₹{seat.price.toLocaleString('en-IN')}</p>
      </div>
      {seat.status === 'available' && (
        <p className="tooltip-hint">Click to select · Double-click for view</p>
      )}
      {seat.status === 'selected' && (
        <p className="tooltip-hint">Click to deselect · Double-click for view</p>
      )}
    </div>
  );
}
