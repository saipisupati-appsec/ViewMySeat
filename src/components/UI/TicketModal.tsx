import { useSeatStore } from '../../store/seatStore';
import { CATEGORY_COLORS } from '../../types';

export function TicketModal() {
  const isConfirming = useSeatStore((s) => s.isConfirming);
  const lastTicket = useSeatStore((s) => s.lastTicket);

  if (!isConfirming || !lastTicket) return null;

  const close = () => {
    useSeatStore.setState({ isConfirming: false, lastTicket: null });
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ticket-header">
          <span className="ticket-logo">🏏 ViewMySeat</span>
          <span className="ticket-id">{lastTicket.id}</span>
        </div>

        <div className="ticket-match">
          <h2>
            {lastTicket.match.home} vs {lastTicket.match.away}
          </h2>
          <p>{lastTicket.match.venue}</p>
          <p>
            {lastTicket.match.date} · {lastTicket.match.time}
          </p>
        </div>

        <div className="ticket-seats">
          <h3>Seats</h3>
          {lastTicket.seats.map((seat) => (
            <div key={seat.id} className="ticket-seat-row">
              <span className="cat-badge" style={{ background: CATEGORY_COLORS[seat.category] }}>
                {seat.category}
              </span>
              <span>
                {seat.section} · Row {seat.row} · Seat {seat.number}
              </span>
              <span>₹{seat.price.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="ticket-total">
          <span>Total Paid (Demo)</span>
          <strong>₹{lastTicket.total.toLocaleString('en-IN')}</strong>
        </div>

        <div className="ticket-footer">
          <p className="demo-note">
            This is a simulated booking. No payment was processed.
          </p>
          <p className="booked-at">
            Booked at {new Date(lastTicket.bookedAt).toLocaleString()}
          </p>
          <button className="btn btn-primary" onClick={close}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
