import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Pitch() {
  const grassRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (grassRef.current) {
      const mat = grassRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.02 + Math.sin(clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <group>
      <mesh ref={grassRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[55, 64]} />
        <meshStandardMaterial color="#2d6a3e" roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[3.2, 20]} />
        <meshStandardMaterial color="#3d8b4f" roughness={0.85} />
      </mesh>

      {([-9.5, 9.5] as const).map((z) => (
        <group key={z}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]}>
            <planeGeometry args={[3.6, 0.08]} />
            <meshBasicMaterial color="#f5f5f5" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z + (z > 0 ? 1.2 : -1.2)]}>
            <planeGeometry args={[2.6, 0.06]} />
            <meshBasicMaterial color="#f5f5f5" />
          </mesh>
          {([-0.15, 0, 0.15] as const).map((x) => (
            <mesh key={x} position={[x, 0.35, z]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
              <meshStandardMaterial color="#e8dcc8" />
            </mesh>
          ))}
          <mesh position={[0, 0.72, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
            <meshStandardMaterial color="#c4a574" />
          </mesh>
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[48, 48.4, 64]} />
        <meshBasicMaterial color="#e74c3c" side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[27.4, 27.6, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
