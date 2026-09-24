import type { Seat, SeatCategory, SeatStatus } from '../types';
import { CATEGORY_PRICES } from '../types';

/** Cricket stadium seat layout – oval stands around a rectangular pitch */
const SECTIONS = [
  // North stand (behind bowler's arm / pavilion side)
  { id: 'N1', name: 'North Lower', startAngle: -0.45, endAngle: 0.45, radius: 38, tiers: 1, rows: 8, seatsPerRow: 42, category: 'premium' as SeatCategory, yBase: 2.5 },
  { id: 'N2', name: 'North Upper', startAngle: -0.4, endAngle: 0.4, radius: 42, tiers: 1, rows: 10, seatsPerRow: 48, category: 'general' as SeatCategory, yBase: 8 },
  // South stand
  { id: 'S1', name: 'South Lower', startAngle: Math.PI - 0.45, endAngle: Math.PI + 0.45, radius: 38, tiers: 1, rows: 8, seatsPerRow: 42, category: 'premium' as SeatCategory, yBase: 2.5 },
  { id: 'S2', name: 'South Upper', startAngle: Math.PI - 0.4, endAngle: Math.PI + 0.4, radius: 42, tiers: 1, rows: 10, seatsPerRow: 48, category: 'general' as SeatCategory, yBase: 8 },
  // East stand (square leg / long-on)
  { id: 'E1', name: 'East Lower', startAngle: Math.PI / 2 - 0.55, endAngle: Math.PI / 2 + 0.55, radius: 45, tiers: 1, rows: 6, seatsPerRow: 36, category: 'general' as SeatCategory, yBase: 2.2 },
  { id: 'E2', name: 'East Upper', startAngle: Math.PI / 2 - 0.5, endAngle: Math.PI / 2 + 0.5, radius: 49, tiers: 1, rows: 8, seatsPerRow: 40, category: 'general' as SeatCategory, yBase: 7.5 },
  // West stand (VIP / pavilion)
  { id: 'W1', name: 'West Pavilion', startAngle: -Math.PI / 2 - 0.5, endAngle: -Math.PI / 2 + 0.5, radius: 40, tiers: 1, rows: 5, seatsPerRow: 28, category: 'vip' as SeatCategory, yBase: 3 },
  { id: 'W2', name: 'West Upper', startAngle: -Math.PI / 2 - 0.45, endAngle: -Math.PI / 2 + 0.45, radius: 44, tiers: 1, rows: 7, seatsPerRow: 32, category: 'premium' as SeatCategory, yBase: 8.5 },
  // Corner blocks
  { id: 'NE', name: 'North-East', startAngle: 0.5, endAngle: Math.PI / 2 - 0.55, radius: 46, tiers: 1, rows: 5, seatsPerRow: 22, category: 'general' as SeatCategory, yBase: 2.5 },
  { id: 'SE', name: 'South-East', startAngle: Math.PI / 2 + 0.55, endAngle: Math.PI - 0.5, radius: 46, tiers: 1, rows: 5, seatsPerRow: 22, category: 'general' as SeatCategory, yBase: 2.5 },
  { id: 'SW', name: 'South-West', startAngle: Math.PI + 0.5, endAngle: -Math.PI / 2 - 0.5 + 2 * Math.PI, radius: 46, tiers: 1, rows: 5, seatsPerRow: 22, category: 'premium' as SeatCategory, yBase: 2.5 },
  { id: 'NW', name: 'North-West', startAngle: -Math.PI / 2 + 0.5, endAngle: -0.5, radius: 46, tiers: 1, rows: 5, seatsPerRow: 22, category: 'premium' as SeatCategory, yBase: 2.5 },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSeats(bookedIds: Set<string> = new Set()): Seat[] {
  const seats: Seat[] = [];
  const rand = seededRandom(42);

  for (const section of SECTIONS) {
    const angleSpan = section.endAngle - section.startAngle;
    const span = angleSpan < 0 ? angleSpan + Math.PI * 2 : angleSpan;

    for (let row = 0; row < section.rows; row++) {
      const rowRadius = section.radius + row * 1.15;
      const y = section.yBase + row * 0.85;
      const seatsInRow = Math.max(8, Math.floor(section.seatsPerRow * (1 + row * 0.02)));

      for (let n = 0; n < seatsInRow; n++) {
        const t = (n + 0.5) / seatsInRow;
        let angle = section.startAngle + t * span;
        if (angle > Math.PI) angle -= Math.PI * 2;
        if (angle < -Math.PI) angle += Math.PI * 2;

        const x = Math.cos(angle) * rowRadius;
        const z = Math.sin(angle) * rowRadius;
        const rotation = angle + Math.PI;
        const id = `${section.id}-R${row + 1}-S${n + 1}`;
        let status: SeatStatus = 'available';
        if (bookedIds.has(id)) {
          status = 'booked';
        } else if (rand() < 0.22) {
          status = 'booked';
        }

        seats.push({
          id,
          section: section.name,
          row: row + 1,
          number: n + 1,
          category: section.category,
          price: CATEGORY_PRICES[section.category],
          status,
          position: [x, y, z],
          rotation,
          lookAt: [0, 0.5, 0],
        });
      }
    }
  }

  return seats;
}

export function getSeatCountByCategory(seats: Seat[]) {
  const counts = { general: 0, premium: 0, vip: 0, available: 0, booked: 0 };
  for (const s of seats) {
    counts[s.category]++;
    if (s.status === 'available') counts.available++;
    if (s.status === 'booked') counts.booked++;
  }
  return counts;
}
