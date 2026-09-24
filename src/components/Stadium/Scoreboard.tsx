import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function Scoreboard() {
  const boardRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boardRef.current) {
      const mats = boardRef.current.children;
      mats.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (m.emissive) {
            m.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 2) * 0.1;
          }
        }
      });
    }
  });

  return (
    <group ref={boardRef} position={[0, 18, -52]}>
      <mesh castShadow>
        <boxGeometry args={[22, 8, 0.6]} />
        <meshStandardMaterial color="#0a0c10" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.35]}>
        <planeGeometry args={[20, 6.5]} />
        <meshStandardMaterial color="#0d1b2a" emissive="#1b3a4b" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 1.8, 0.4]} fontSize={0.9} color="#00e5ff" anchorX="center" anchorY="middle" fontWeight={700}>
        INDIA vs AUSTRALIA
      </Text>
      <Text position={[0, 0.5, 0.4]} fontSize={0.55} color="#ffffff" anchorX="center" anchorY="middle">
        Hyderabad · 7:30 PM
      </Text>
      <Text position={[0, -0.8, 0.4]} fontSize={0.7} color="#ffd700" anchorX="center" anchorY="middle" fontWeight={600}>
        T20I · LIVE
      </Text>
      <Text position={[0, -2.2, 0.4]} fontSize={0.4} color="#94a3b8" anchorX="center" anchorY="middle">
        Rajiv Gandhi Stadium
      </Text>
      {([-9, 9] as const).map((x) => (
        <mesh key={x} position={[x, -8, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 10, 8]} />
          <meshStandardMaterial color="#2a2e38" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
