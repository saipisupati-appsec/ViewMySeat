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
      <Sky
        distance={450000}
        sunPosition={[8, 2.5, -12]}
        inclination={0.48}
        azimuth={0.22}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={1.2}
        turbidity={4}
      />
      <color attach="background" args={['#1a2740']} />
      <fog attach="fog" args={['#1a2740', 120, 280]} />

      <ambientLight intensity={0.55} color="#c8d8f0" />
      <hemisphereLight intensity={0.55} color="#a8c4e8" groundColor="#3a4a38" />

      <directionalLight
        position={[40, 55, 25]}
        intensity={0.85}
        color="#fff0d8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={160}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0002}
      />

      <directionalLight position={[-30, 30, -20]} intensity={0.35} color="#b0c8e8" />
      <Environment preset="city" environmentIntensity={0.35} />

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
  const count = 500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color('#c4a574'),
    new THREE.Color('#8a9bb0'),
    new THREE.Color('#d4c4a8'),
    new THREE.Color('#6a7a8a'),
  ];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 34 + Math.random() * 20;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = 2.5 + Math.random() * 14;
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
      <pointsMaterial size={0.18} vertexColors transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}
