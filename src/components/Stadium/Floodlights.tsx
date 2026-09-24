import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POLES: [number, number, number][] = [
  [42, 0, 42],
  [-42, 0, 42],
  [42, 0, -42],
  [-42, 0, -42],
];

function FloodlightPole({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const target = useRef(new THREE.Object3D());

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 80 + Math.sin(clock.elapsedTime * 8 + position[0]) * 4;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 12, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.5, 24, 8]} />
        <meshStandardMaterial color="#2a2e38" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 24.5, 0]}>
        <boxGeometry args={[4, 1.2, 2]} />
        <meshStandardMaterial color="#1a1e26" metalness={0.5} />
      </mesh>
      {([-1.2, 0, 1.2] as const).map((x) => (
        <mesh key={x} position={[x, 24.5, 0.6]}>
          <boxGeometry args={[0.9, 0.7, 0.5]} />
          <meshStandardMaterial color="#fff8e7" emissive="#ffeaa7" emissiveIntensity={2} />
        </mesh>
      ))}
      <spotLight
        ref={lightRef}
        position={[0, 24, 0]}
        angle={0.55}
        penumbra={0.4}
        intensity={80}
        distance={120}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#fff5e0"
        target={target.current}
      />
      <primitive object={target.current} position={[0, 0, 0]} />
    </group>
  );
}

export function Floodlights() {
  return (
    <group>
      {POLES.map((p, i) => (
        <FloodlightPole key={i} position={p} />
      ))}
    </group>
  );
}
