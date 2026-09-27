export type SeatCategory = 'general' | 'premium' | 'vip';

export type SeatStatus = 'available' | 'selected' | 'booked';

export interface Seat {
  id: string;
  section: string;
  row: number;
  number: number;
  category: SeatCategory;
  price: number;
  status: SeatStatus;
  position: [number, number, number];
  rotation: number;
  lookAt: [number, number, number];
}

export interface MatchInfo {
  home: string;
  away: string;
  venue: string;
  time: string;
  date: string;
}

export interface BookingTicket {
  id: string;
  seats: Seat[];
  total: number;
  match: MatchInfo;
  bookedAt: string;
}

export const CATEGORY_PRICES: Record<SeatCategory, number> = {
  general: 499,
  premium: 1499,
  vip: 4999,
};

/** Realistic stadium seat fabric colors (not neon) */
export const CATEGORY_COLORS: Record<SeatCategory, string> = {
  general: '#5a6b7a',
  premium: '#2f5d8a',
  vip: '#6b3a2a',
};

export const STATUS_COLORS: Record<SeatStatus, string> = {
  available: '#5a6b7a',
  selected: '#c45c8a',
  booked: '#4a5560',
};

export const MATCH: MatchInfo = {
  home: 'India',
  away: 'Australia',
  venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
  time: '7:30 PM',
  date: 'Tonight',
};
