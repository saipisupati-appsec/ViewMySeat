import { create } from 'zustand';
import type { Seat, BookingTicket } from '../types';
import { MATCH } from '../types';
import { generateSeats } from '../utils/seatGenerator';

const STORAGE_KEY = 'viewmyseat-v1';

interface PersistedState {
  bookedIds: string[];
  tickets: BookingTicket[];
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    /* ignore */
  }
  return { bookedIds: [], tickets: [] };
}

function savePersisted(bookedIds: string[], tickets: BookingTicket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bookedIds, tickets }));
  } catch {
    /* ignore */
  }
}

interface SeatStore {
  seats: Seat[];
  selectedIds: string[];
  hoveredId: string | null;
  focusedSeatId: string | null;
  viewMode: 'overview' | 'seat';
  tickets: BookingTicket[];
  isConfirming: boolean;
  lastTicket: BookingTicket | null;
  isLoading: boolean;

  init: () => void;
  selectSeat: (id: string) => void;
  deselectSeat: (id: string) => void;
  clearSelection: () => void;
  setHovered: (id: string | null) => void;
  enterSeatView: (id: string) => void;
  exitSeatView: () => void;
  confirmBooking: () => BookingTicket | null;
  resetDemo: () => void;
  getSelectedSeats: () => Seat[];
  getTotalPrice: () => number;
}

export const useSeatStore = create<SeatStore>((set, get) => ({
  seats: [],
  selectedIds: [],
  hoveredId: null,
  focusedSeatId: null,
  viewMode: 'overview',
  tickets: [],
  isConfirming: false,
  lastTicket: null,
  isLoading: true,

  init: () => {
    const { bookedIds, tickets } = loadPersisted();
    const bookedSet = new Set(bookedIds);
    const seats = generateSeats(bookedSet);
    for (const s of seats) {
      if (bookedSet.has(s.id)) s.status = 'booked';
    }
    set({ seats, tickets, isLoading: false });
  },

  selectSeat: (id) => {
    const { seats, selectedIds } = get();
    const seat = seats.find((s) => s.id === id);
    if (!seat || seat.status === 'booked') return;
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 8) return;

    set({
      selectedIds: [...selectedIds, id],
      seats: seats.map((s) =>
        s.id === id ? { ...s, status: 'selected' as const } : s
      ),
    });
  },

  deselectSeat: (id) => {
    const { seats, selectedIds } = get();
    set({
      selectedIds: selectedIds.filter((x) => x !== id),
      seats: seats.map((s) =>
        s.id === id && s.status === 'selected'
          ? { ...s, status: 'available' as const }
          : s
      ),
    });
  },

  clearSelection: () => {
    const { seats, selectedIds } = get();
    const setIds = new Set(selectedIds);
    set({
      selectedIds: [],
      seats: seats.map((s) =>
        setIds.has(s.id) ? { ...s, status: 'available' as const } : s
      ),
    });
  },

  setHovered: (id) => set({ hoveredId: id }),

  enterSeatView: (id) => {
    set({ focusedSeatId: id, viewMode: 'seat' });
  },

  exitSeatView: () => {
    set({ focusedSeatId: null, viewMode: 'overview' });
  },

  confirmBooking: () => {
    const { seats, selectedIds, tickets } = get();
    if (selectedIds.length === 0) return null;

    const selected = seats.filter((s) => selectedIds.includes(s.id));
    const total = selected.reduce((sum, s) => sum + s.price, 0);
    const ticket: BookingTicket = {
      id: `TIX-${Date.now().toString(36).toUpperCase()}`,
      seats: selected.map((s) => ({ ...s, status: 'booked' as const })),
      total,
      match: MATCH,
      bookedAt: new Date().toISOString(),
    };

    const newBookedIds = [...loadPersisted().bookedIds, ...selectedIds];
    const newTickets = [...tickets, ticket];
    savePersisted(newBookedIds, newTickets);

    const idSet = new Set(selectedIds);
    set({
      seats: seats.map((s) =>
        idSet.has(s.id) ? { ...s, status: 'booked' as const } : s
      ),
      selectedIds: [],
      tickets: newTickets,
      lastTicket: ticket,
      isConfirming: true,
      viewMode: 'overview',
      focusedSeatId: null,
    });

    return ticket;
  },

  resetDemo: () => {
    localStorage.removeItem(STORAGE_KEY);
    const seats = generateSeats(new Set());
    set({
      seats,
      selectedIds: [],
      tickets: [],
      lastTicket: null,
      isConfirming: false,
      focusedSeatId: null,
      viewMode: 'overview',
    });
  },

  getSelectedSeats: () => {
    const { seats, selectedIds } = get();
    return seats.filter((s) => selectedIds.includes(s.id));
  },

  getTotalPrice: () => {
    return get()
      .getSelectedSeats()
      .reduce((sum, s) => sum + s.price, 0);
  },
}));
