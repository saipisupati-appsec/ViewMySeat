import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Pitch() {
  const grassRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (grassRef.current) {
      const mat = grassRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.06 + Math.sin(clock.elapsedTime * 0.35) * 0.02;
    }
  });

  return (
    <group>
      {/* Outfield — bright realistic cricket green under floodlights */}
      <mesh
        ref={grassRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[56, 96]} />
        <meshStandardMaterial
          color="#4a9e5c"
          roughness={0.85}
          metalness={0.02}
          emissive="#2a6a38"
          emissiveIntensity={0.07}
        />
      </mesh>

      {/* Subtle strip mowing pattern */}
      {[-22, -11, 0, 11, 22].map((z, i) => (
        <mesh
          key={z}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.015, z]}
          receiveShadow
        >
          <planeGeometry args={[55, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#429654' : '#4eaa62'}
            roughness={0.88}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Pitch square — lighter manicured strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[3.5, 20.8]} />
        <meshStandardMaterial color="#6aba70" roughness={0.75} />
      </mesh>

      {/* Creases & stumps */}
      {([-9.6, 9.6] as const).map((z) => (
        <group key={z}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]}>
            <planeGeometry args={[3.8, 0.1]} />
            <meshBasicMaterial color="#f8f8f8" />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.04, z + (z > 0 ? 1.22 : -1.22)]}
          >
            <planeGeometry args={[2.75, 0.07]} />
            <meshBasicMaterial color="#f8f8f8" />
          </mesh>
          {([-0.15, 0, 0.15] as const).map((x) => (
            <mesh key={x} position={[x, 0.36, z]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.72, 8]} />
              <meshStandardMaterial color="#f0e6d0" roughness={0.55} />
            </mesh>
          ))}
          <mesh position={[0, 0.74, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.38, 6]} />
            <meshStandardMaterial color="#c8a878" />
          </mesh>
        </group>
      ))}

      {/* Boundary rope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[49, 49.5, 96]} />
        <meshBasicMaterial color="#e74c3c" side={THREE.DoubleSide} />
      </mesh>

      {/* 30-yard circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[27.4, 27.7, 96]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
