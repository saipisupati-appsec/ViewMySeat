import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Pitch() {
  const grassRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (grassRef.current) {
      const mat = grassRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.04 + Math.sin(clock.elapsedTime * 0.4) * 0.015;
    }
  });

  return (
    <group>
      <mesh ref={grassRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[55, 96]} />
        <meshStandardMaterial color="#3d8f4f" roughness={0.88} metalness={0.02} emissive="#1a4a28" emissiveIntensity={0.05} />
      </mesh>

      {[-20, -10, 0, 10, 20].map((z, i) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, z]} receiveShadow>
          <planeGeometry args={[54, 4.8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#388848' : '#429654'} roughness={0.9} transparent opacity={0.55} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[3.4, 20.5]} />
        <meshStandardMaterial color="#5aad68" roughness={0.8} />
      </mesh>

      {([-9.5, 9.5] as const).map((z) => (
        <group key={z}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]}>
            <planeGeometry args={[3.7, 0.09]} />
            <meshBasicMaterial color="#f8f8f8" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z + (z > 0 ? 1.22 : -1.22)]}>
            <planeGeometry args={[2.7, 0.07]} />
            <meshBasicMaterial color="#f8f8f8" />
          </mesh>
          {([-0.15, 0, 0.15] as const).map((x) => (
            <mesh key={x} position={[x, 0.36, z]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.72, 8]} />
              <meshStandardMaterial color="#efe4d0" roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.74, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.36, 6]} />
            <meshStandardMaterial color="#c4a574" />
          </mesh>
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[48, 48.45, 96]} />
        <meshBasicMaterial color="#e74c3c" side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[27.35, 27.65, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
