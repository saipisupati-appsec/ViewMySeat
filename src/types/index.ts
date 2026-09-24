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

export const CATEGORY_COLORS: Record<SeatCategory, string> = {
  general: '#4ade80',
  premium: '#60a5fa',
  vip: '#f59e0b',
};

export const STATUS_COLORS: Record<SeatStatus, string> = {
  available: '#4ade80',
  selected: '#f472b6',
  booked: '#64748b',
};

export const MATCH: MatchInfo = {
  home: 'India',
  away: 'Australia',
  venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
  time: '7:30 PM',
  date: 'Tonight',
};
