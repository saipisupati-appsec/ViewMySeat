import { Suspense } from 'react';
import { Pitch } from './Pitch';
import { Stands } from './Stands';
import { Seats } from './Seats';
import { Floodlights } from './Floodlights';
import { Scoreboard } from './Scoreboard';
import { Sky } from '@react-three/drei';

export function Stadium() {
  return (
    <Suspense fallback={null}>
      <Sky distance={450000} sunPosition={[0, -0.2, -1]} inclination={0.1} azimuth={0.25} mieCoefficient={0.008} mieDirectionalG={0.7} rayleigh={0.5} turbidity={8} />
      <color attach="background" args={['#0a0e17']} />
      <fog attach="fog" args={['#0a0e17', 80, 200]} />

      <ambientLight intensity={0.25} color="#a8c0d8" />
      <directionalLight position={[30, 50, 20]} intensity={0.4} color="#e8f0ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={150} shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} />
      <hemisphereLight intensity={0.3} color="#4a6a8a" groundColor="#1a1e28" />

      <Pitch />
      <Stands />
      <Seats />
      <Floodlights />
      <Scoreboard />
      <CrowdParticles />
    </Suspense>
  );
}

function CrowdParticles() {
  const count = 400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 36 + Math.random() * 18;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = 3 + Math.random() * 12;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffcc88" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}
