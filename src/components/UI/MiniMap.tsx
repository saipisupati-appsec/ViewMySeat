import { useSeatStore } from '../../store/seatStore';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

export function MiniMap() {
  const seats = useSeatStore((s) => s.seats);
  const selectedIds = useSeatStore((s) => s.selectedIds);
  const hoveredId = useSeatStore((s) => s.hoveredId);
  const viewMode = useSeatStore((s) => s.viewMode);
  const enterSeatView = useSeatStore((s) => s.enterSeatView);

  if (viewMode === 'seat' || seats.length === 0) return null;

  const scale = 1.05;
  const size = 160;

  return (
    <div className="minimap">
      <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
        <ellipse cx={0} cy={0} rx={28} ry={28} fill="#2d6a3e" stroke="#3d8b4f" strokeWidth={1} />
        <rect x={-2} y={-12} width={4} height={24} fill="#3d8b4f" rx={0.5} />
        <circle cx={0} cy={0} r={48 * scale * 0.55} fill="none" stroke="#e74c3c" strokeWidth={1.5} opacity={0.7} />

        {seats.map((seat) => {
          const x = seat.position[0] * scale * 0.55;
          const y = seat.position[2] * scale * 0.55;
          let fill = CATEGORY_COLORS[seat.category];
          if (seat.status === 'booked') fill = STATUS_COLORS.booked;
          if (seat.status === 'selected' || selectedIds.includes(seat.id))
            fill = STATUS_COLORS.selected;
          if (seat.id === hoveredId) fill = '#a3e635';

          return (
            <circle
              key={seat.id}
              cx={x}
              cy={y}
              r={seat.status === 'selected' ? 1.4 : 0.9}
              fill={fill}
              opacity={seat.status === 'booked' ? 0.4 : 0.9}
              style={{ cursor: seat.status !== 'booked' ? 'pointer' : 'default' }}
              onClick={() => {
                if (seat.status !== 'booked') enterSeatView(seat.id);
              }}
            />
          );
        })}
      </svg>
      <span className="minimap-label">Stadium map</span>
    </div>
  );
}
