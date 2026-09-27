import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POLES: [number, number, number][] = [
  [44, 0, 44],
  [-44, 0, 44],
  [44, 0, -44],
  [-44, 0, -44],
];

function FloodlightPole({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Object3D());

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity =
        160 + Math.sin(clock.elapsedTime * 6 + position[0]) * 6;
    }
    if (fillRef.current) {
      fillRef.current.intensity =
        25 + Math.sin(clock.elapsedTime * 5 + position[2]) * 2;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 13, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.55, 26, 10]} />
        <meshStandardMaterial color="#3a4250" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, 26.2, 0]}>
        <boxGeometry args={[5.2, 1.4, 2.4]} />
        <meshStandardMaterial color="#2a3240" metalness={0.55} roughness={0.4} />
      </mesh>
      {([-1.6, 0, 1.6] as const).map((x) => (
        <mesh key={x} position={[x, 26.2, 0.7]}>
          <boxGeometry args={[1.1, 0.85, 0.55]} />
          <meshStandardMaterial color="#fff8e7" emissive="#ffe8a0" emissiveIntensity={3.5} />
        </mesh>
      ))}
      <spotLight
        ref={lightRef}
        position={[0, 26, 0]}
        angle={0.65}
        penumbra={0.45}
        intensity={160}
        distance={140}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
        color="#fff6e0"
        target={target.current}
      />
      <pointLight ref={fillRef} position={[0, 18, 0]} intensity={25} distance={55} color="#ffe8c0" />
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
