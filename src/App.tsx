import { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stadium } from './components/Stadium/Stadium';
import { CameraController } from './components/CameraController';
import { Header } from './components/UI/Header';
import { BookingPanel } from './components/UI/BookingPanel';
import { SeatTooltip } from './components/UI/SeatTooltip';
import { TicketModal } from './components/UI/TicketModal';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { MiniMap } from './components/UI/MiniMap';
import { useSeatStore } from './store/seatStore';
import './index.css';

function Scene() {
  return (
    <>
      <Stadium />
      <CameraController />
    </>
  );
}

export default function App() {
  const init = useSeatStore((s) => s.init);
  const isLoading = useSeatStore((s) => s.isLoading);
  const viewMode = useSeatStore((s) => s.viewMode);
  const exitSeatView = useSeatStore((s) => s.exitSeatView);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'seat') {
        exitSeatView();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewMode, exitSeatView]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Header />
      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 55, 70], fov: 45, near: 0.1, far: 300 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <BookingPanel />
      <SeatTooltip />
      <MiniMap />
      <TicketModal />

      {viewMode === 'seat' && (
        <div className="seat-view-banner">
          <span>View from your seat · Drag to look around · Esc to return</span>
        </div>
      )}
    </div>
  );
}
