import { useSeatStore } from '../../store/seatStore';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

export function BookingPanel() {
  const selectedIds = useSeatStore((s) => s.selectedIds);
  const getSelectedSeats = useSeatStore((s) => s.getSelectedSeats);
  const getTotalPrice = useSeatStore((s) => s.getTotalPrice);
  const deselectSeat = useSeatStore((s) => s.deselectSeat);
  const clearSelection = useSeatStore((s) => s.clearSelection);
  const confirmBooking = useSeatStore((s) => s.confirmBooking);
  const enterSeatView = useSeatStore((s) => s.enterSeatView);
  const viewMode = useSeatStore((s) => s.viewMode);

  const selected = getSelectedSeats();
  const total = getTotalPrice();

  if (viewMode === 'seat') return null;

  return (
    <aside className={`booking-panel ${selected.length > 0 ? 'has-selection' : ''}`}>
      <div className="panel-header">
        <div>
          <h2>Your booking</h2>
          <p className="panel-sub">
            {selected.length === 0
              ? 'Select seats in the stadium'
              : `${selected.length} seat${selected.length > 1 ? 's' : ''} selected`}
          </p>
        </div>
        {selected.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
            Clear all
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="empty-state">
          <p className="empty-lead">
            Click any available seat to add it to your booking. Double-click to preview the view from that seat.
          </p>
          <div className="legend">
            <p className="legend-title">Categories</p>
            <div className="legend-item">
              <span className="dot" style={{ background: CATEGORY_COLORS.vip }} />
              <div>
                <strong>VIP</strong>
                <span>₹4,999 · Closest to the pitch</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: CATEGORY_COLORS.premium }} />
              <div>
                <strong>Premium</strong>
                <span>₹1,499 · Mid-tier sightlines</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: CATEGORY_COLORS.general }} />
              <div>
                <strong>General</strong>
                <span>₹499 · Upper & outer stands</span>
              </div>
            </div>
            <p className="legend-title" style={{ marginTop: '0.85rem' }}>
              Status
            </p>
            <div className="legend-item">
              <span className="dot status-dot available" />
              <div>
                <strong>Available</strong>
                <span>Ready to select</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: STATUS_COLORS.selected }} />
              <div>
                <strong>Selected</strong>
                <span>In your cart</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: STATUS_COLORS.booked }} />
              <div>
                <strong>Booked</strong>
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ul className="seat-list">
            {selected.map((seat) => (
              <li key={seat.id} className="seat-row">
                <div className="seat-info">
                  <span
                    className="cat-badge"
                    style={{ background: CATEGORY_COLORS[seat.category] }}
                  >
                    {seat.category}
                  </span>
                  <div className="seat-meta">
                    <strong>
                      {seat.section}
                    </strong>
                    <span className="seat-loc">
                      Row {seat.row} · Seat {seat.number}
                    </span>
                    <span className="price">
                      ₹{seat.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="seat-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => enterSeatView(seat.id)}
                    title="View from this seat"
                  >
                    View
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => deselectSeat(seat.id)}
                    title="Remove from booking"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="panel-footer">
            <div className="total">
              <span className="total-label">
                {selected.length} seat{selected.length > 1 ? 's' : ''}
              </span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => confirmBooking()}
              disabled={selected.length === 0}
            >
              Confirm booking
            </button>
            <p className="checkout-note">Demo booking · No payment required</p>
          </div>
        </>
      )}
    </aside>
  );
}
