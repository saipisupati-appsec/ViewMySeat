# ViewMySeat

**See the pitch before you book.**

Interactive 3D cricket stadium seat booking experience. Explore a procedural stadium, select seats across General / Premium / VIP sections, and fly into a first-person view from any seat toward the pitch.

> Demo only — match data, prices, and availability are simulated. No real tickets or payments.

## Features (V1)

- Procedural 3D cricket stadium (pitch, boundary, stands, floodlights, scoreboard)
- Hundreds of individually selectable seats via GPU instancing
- Seat states: Available · Selected · Booked
- Sections with different pricing: General (₹499) · Premium (₹1,499) · VIP (₹4,999)
- Click seat → details (section, row, number, category, price)
- **View From Seat** — smooth camera flight to first-person pitch view
- Booking panel with selected seats & total
- Confirm booking → simulated digital ticket (persisted in `localStorage`)
- Sample match: **India vs Australia** — Hyderabad — 7:30 PM
- Responsive desktop & mobile UI
- Mini-map, orbit controls, lighting & subtle animations
- No backend required — ready for static hosting

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Three.js + React Three Fiber + Drei
- Zustand (client state + localStorage)

## Quick Start

```bash
# Clone
git clone https://github.com/saipisupati-appsec/ViewMySeat.git
cd ViewMySeat

# Install
npm install

# Dev server
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Production build → `dist/` |
| `npm run preview` | Preview production build   |

## Deploy (static)

Build output is a static site in `dist/`. Deploy to any static host:

### Vercel

```bash
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Set `base: './'` in `vite.config.ts` (already set).
2. Build: `npm run build`
3. Push `dist/` to the `gh-pages` branch, or use a GitHub Action.

## Project Structure

```
src/
  components/
    Stadium/       # Pitch, stands, seats (instanced), floodlights, scoreboard
    UI/            # Header, booking panel, tooltip, ticket modal, minimap
    CameraController.tsx
  store/           # Zustand seat & booking state
  types/           # Shared TypeScript types
  utils/           # Seat layout generator
  App.tsx
  main.tsx
  index.css
```

## Controls

| Action              | How                                      |
| ------------------- | ---------------------------------------- |
| Orbit stadium       | Drag / touch                             |
| Zoom                | Scroll / pinch                           |
| Select seat         | Click                                    |
| Deselect            | Click again or panel ✕                   |
| View from seat      | Double-click seat or 👁 in panel         |
| Return to overview  | Esc or “Stadium Overview”                |
| Confirm booking     | “Confirm Booking” in panel               |

## Extending (future)

Architecture is ready for:

- Supabase / any backend for real inventory & auth
- Payment gateway
- Multiple matches / stadiums
- Real seat-view photos

## License

MIT © ViewMySeat contributors
