import type { Seat, SeatCategory, SeatStatus } from '../types';
import { CATEGORY_PRICES } from '../types';

/**
 * Cricket stadium layout with clear physical tiers:
 * - VIP: closest to pitch, spacious, fewer seats (West pavilion lower)
 * - Premium: mid-tier, better sightlines (lower bowls N/S + west upper)
 * - General: upper / outer stands
 * Clear radial gaps between categories + aisle gaps every ~8–10 seats.
 */
const SECTIONS = [
  // —— VIP (closest, spacious) ——
  {
    id: 'VIP-W',
    name: 'West VIP Pavilion',
    startAngle: -Math.PI / 2 - 0.42,
    endAngle: -Math.PI / 2 + 0.42,
    radius: 31,
    rows: 4,
    seatsPerRow: 16,
    category: 'vip' as SeatCategory,
    yBase: 1.9,
    rowDepth: 1.4,
    rowRise: 0.75,
    seatGap: 1.05,
    aisleEvery: 5,
  },
  // —— PREMIUM lower bowl ——
  {
    id: 'P-N',
    name: 'North Premium',
    startAngle: -0.48,
    endAngle: 0.48,
    radius: 36,
    rows: 7,
    seatsPerRow: 34,
    category: 'premium' as SeatCategory,
    yBase: 2.1,
    rowDepth: 1.22,
    rowRise: 0.78,
    seatGap: 0.8,
    aisleEvery: 9,
  },
  {
    id: 'P-S',
    name: 'South Premium',
    startAngle: Math.PI - 0.48,
    endAngle: Math.PI + 0.48,
    radius: 36,
    rows: 7,
    seatsPerRow: 34,
    category: 'premium' as SeatCategory,
    yBase: 2.1,
    rowDepth: 1.22,
    rowRise: 0.78,
    seatGap: 0.8,
    aisleEvery: 9,
  },
  {
    id: 'P-W',
    name: 'West Premium Upper',
    startAngle: -Math.PI / 2 - 0.4,
    endAngle: -Math.PI / 2 + 0.4,
    radius: 40,
    rows: 6,
    seatsPerRow: 26,
    category: 'premium' as SeatCategory,
    yBase: 6.8,
    rowDepth: 1.18,
    rowRise: 0.82,
    seatGap: 0.82,
    aisleEvery: 8,
  },
  {
    id: 'P-SW',
    name: 'South-West Premium',
    startAngle: Math.PI + 0.52,
    endAngle: -Math.PI / 2 - 0.48 + 2 * Math.PI,
    radius: 38,
    rows: 5,
    seatsPerRow: 18,
    category: 'premium' as SeatCategory,
    yBase: 2.2,
    rowDepth: 1.22,
    rowRise: 0.78,
    seatGap: 0.82,
    aisleEvery: 8,
  },
  {
    id: 'P-NW',
    name: 'North-West Premium',
    startAngle: -Math.PI / 2 + 0.48,
    endAngle: -0.52,
    radius: 38,
    rows: 5,
    seatsPerRow: 18,
    category: 'premium' as SeatCategory,
    yBase: 2.2,
    rowDepth: 1.22,
    rowRise: 0.78,
    seatGap: 0.82,
    aisleEvery: 8,
  },
  // —— GENERAL upper / outer ——
  {
    id: 'G-N',
    name: 'North Upper General',
    startAngle: -0.42,
    endAngle: 0.42,
    radius: 45,
    rows: 10,
    seatsPerRow: 42,
    category: 'general' as SeatCategory,
    yBase: 8.4,
    rowDepth: 1.12,
    rowRise: 0.84,
    seatGap: 0.74,
    aisleEvery: 10,
  },
  {
    id: 'G-S',
    name: 'South Upper General',
    startAngle: Math.PI - 0.42,
    endAngle: Math.PI + 0.42,
    radius: 45,
    rows: 10,
    seatsPerRow: 42,
    category: 'general' as SeatCategory,
    yBase: 8.4,
    rowDepth: 1.12,
    rowRise: 0.84,
    seatGap: 0.74,
    aisleEvery: 10,
  },
  {
    id: 'G-E',
    name: 'East Lower General',
    startAngle: Math.PI / 2 - 0.55,
    endAngle: Math.PI / 2 + 0.55,
    radius: 40,
    rows: 6,
    seatsPerRow: 32,
    category: 'general' as SeatCategory,
    yBase: 2.1,
    rowDepth: 1.18,
    rowRise: 0.76,
    seatGap: 0.76,
    aisleEvery: 9,
  },
  {
    id: 'G-EU',
    name: 'East Upper General',
    startAngle: Math.PI / 2 - 0.5,
    endAngle: Math.PI / 2 + 0.5,
    radius: 47,
    rows: 8,
    seatsPerRow: 36,
    category: 'general' as SeatCategory,
    yBase: 7.4,
    rowDepth: 1.12,
    rowRise: 0.82,
    seatGap: 0.74,
    aisleEvery: 10,
  },
  {
    id: 'G-NE',
    name: 'North-East General',
    startAngle: 0.52,
    endAngle: Math.PI / 2 - 0.58,
    radius: 42,
    rows: 5,
    seatsPerRow: 18,
    category: 'general' as SeatCategory,
    yBase: 2.3,
    rowDepth: 1.18,
    rowRise: 0.76,
    seatGap: 0.76,
    aisleEvery: 8,
  },
  {
    id: 'G-SE',
    name: 'South-East General',
    startAngle: Math.PI / 2 + 0.58,
    endAngle: Math.PI - 0.52,
    radius: 42,
    rows: 5,
    seatsPerRow: 18,
    category: 'general' as SeatCategory,
    yBase: 2.3,
    rowDepth: 1.18,
    rowRise: 0.76,
    seatGap: 0.76,
    aisleEvery: 8,
  },
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
      const rowRadius = section.radius + row * section.rowDepth;
      const y = section.yBase + row * section.rowRise;
      const seatsInRow = Math.max(
        6,
        Math.floor(section.seatsPerRow * (1 + row * 0.015))
      );

      const slots: number[] = [];
      for (let n = 0; n < seatsInRow; n++) {
        if (section.aisleEvery > 0 && n > 0 && n % section.aisleEvery === 0) {
          continue;
        }
        slots.push(n);
      }

      const totalArcSeats = seatsInRow;
      for (let si = 0; si < slots.length; si++) {
        const n = slots[si];
        const t = (n + 0.5) / totalArcSeats;
        let angle = section.startAngle + t * span;
        if (angle > Math.PI) angle -= Math.PI * 2;
        if (angle < -Math.PI) angle += Math.PI * 2;

        const x = Math.cos(angle) * rowRadius;
        const z = Math.sin(angle) * rowRadius;
        const rotation = angle + Math.PI;

        const id = `${section.id}-R${row + 1}-S${si + 1}`;
        let status: SeatStatus = 'available';
        if (bookedIds.has(id)) {
          status = 'booked';
        } else if (rand() < 0.2) {
          status = 'booked';
        }

        seats.push({
          id,
          section: section.name,
          row: row + 1,
          number: si + 1,
          category: section.category,
          price: CATEGORY_PRICES[section.category],
          status,
          position: [x, y, z],
          rotation,
          lookAt: [0, 0.6, 0],
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
