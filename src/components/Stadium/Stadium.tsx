import { Suspense } from 'react';
import { Pitch } from './Pitch';
import { Stands } from './Stands';
import { Seats } from './Seats';
import { Floodlights } from './Floodlights';
import { Scoreboard } from './Scoreboard';
import { Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

export function Stadium() {
  return (
    <Suspense fallback={null}>
      {/* Bright floodlit evening — match atmosphere, not dark night */}
      <Sky
        distance={450000}
        sunPosition={[12, 3.5, -10]}
        inclination={0.52}
        azimuth={0.18}
        mieCoefficient={0.004}
        mieDirectionalG={0.75}
        rayleigh={0.9}
        turbidity={3.5}
      />
      <color attach="background" args={['#243550']} />
      <fog attach="fog" args={['#243550', 140, 300]} />

      {/* Strong ambient + hemisphere so stands never go pure black */}
      <ambientLight intensity={0.72} color="#d0e0f5" />
      <hemisphereLight intensity={0.7} color="#b8d0f0" groundColor="#4a5a42" />

      {/* Late-day key light with soft shadows */}
      <directionalLight
        position={[45, 60, 30]}
        intensity={1.05}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={170}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.00015}
      />

      {/* Cool fill from opposite side */}
      <directionalLight position={[-35, 35, -25]} intensity={0.45} color="#c0d8f0" />

      {/* Extra soft fill over pitch so grass stays visible */}
      <pointLight position={[0, 22, 0]} intensity={35} distance={80} color="#fff8e8" />

      <Environment preset="city" environmentIntensity={0.42} />

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
  const count = 600;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color('#c8b090'),
    new THREE.Color('#9aaaba'),
    new THREE.Color('#d8c8b0'),
    new THREE.Color('#7a8a9a'),
    new THREE.Color('#b09070'),
  ];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 33 + Math.random() * 22;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = 2.2 + Math.random() * 15;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    const c = palette[i % palette.length];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.2} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}
