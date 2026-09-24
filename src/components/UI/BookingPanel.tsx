import { useSeatStore } from '../../store/seatStore';
import { CATEGORY_COLORS } from '../../types';

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
    <aside className={`booking-panel ${selected.length > 0 ? 'open' : ''}`}>
      <div className="panel-header">
        <h2>Your Seats</h2>
        {selected.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
            Clear
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="empty-state">
          <p>Click seats in the stadium to select.</p>
          <p className="hint">Double-click to preview the view from a seat.</p>
          <div className="legend">
            <div className="legend-item">
              <span className="dot" style={{ background: CATEGORY_COLORS.general }} />
              General · ₹499
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: CATEGORY_COLORS.premium }} />
              Premium · ₹1,499
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: CATEGORY_COLORS.vip }} />
              VIP · ₹4,999
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#64748b' }} />
              Booked
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#f472b6' }} />
              Selected
            </div>
          </div>
        </div>
      ) : (
        <>
          <ul className="seat-list">
            {selected.map((seat) => (
              <li key={seat.id} className="seat-row">
                <div className="seat-info">
                  <span className="cat-badge" style={{ background: CATEGORY_COLORS[seat.category] }}>
                    {seat.category}
                  </span>
                  <div>
                    <strong>
                      {seat.section} · R{seat.row} · S{seat.number}
                    </strong>
                    <span className="price">₹{seat.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="seat-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => enterSeatView(seat.id)} title="View from seat">
                    👁
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deselectSeat(seat.id)} title="Remove">
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="panel-footer">
            <div className="total">
              <span>
                {selected.length} seat{selected.length > 1 ? 's' : ''}
              </span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>
            <button className="btn btn-primary" onClick={() => confirmBooking()}>
              Confirm Booking
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
