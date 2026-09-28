import { useSeatStore } from '../../store/seatStore';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

export function SeatTooltip() {
  const hoveredId = useSeatStore((s) => s.hoveredId);
  const seats = useSeatStore((s) => s.seats);
  const viewMode = useSeatStore((s) => s.viewMode);

  if (!hoveredId || viewMode === 'seat') return null;
  const seat = seats.find((s) => s.id === hoveredId);
  if (!seat) return null;

  const badgeColor =
    seat.status === 'booked'
      ? STATUS_COLORS.booked
      : seat.status === 'selected'
        ? STATUS_COLORS.selected
        : CATEGORY_COLORS[seat.category];

  return (
    <div className="seat-tooltip" role="tooltip">
      <div className="tooltip-header">
        <span className="cat-badge" style={{ background: badgeColor }}>
          {seat.category}
        </span>
        <span className={`status status-${seat.status}`}>{seat.status}</span>
      </div>
      <div className="tooltip-body">
        <p className="tooltip-section">{seat.section}</p>
        <p className="tooltip-loc">
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
      {seat.status === 'booked' && (
        <p className="tooltip-hint">This seat is already booked</p>
      )}
    </div>
  );
}
