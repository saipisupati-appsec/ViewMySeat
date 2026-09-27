import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POLES: [number, number, number][] = [
  [46, 0, 46],
  [-46, 0, 46],
  [46, 0, -46],
  [-46, 0, -46],
];

function FloodlightPole({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Object3D());

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity =
        220 + Math.sin(clock.elapsedTime * 5.5 + position[0]) * 8;
    }
    if (fillRef.current) {
      fillRef.current.intensity =
        40 + Math.sin(clock.elapsedTime * 4.5 + position[2]) * 3;
    }
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 14, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.58, 28, 12]} />
        <meshStandardMaterial color="#3e4654" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Head frame */}
      <mesh position={[0, 28.2, 0]}>
        <boxGeometry args={[5.6, 1.5, 2.6]} />
        <meshStandardMaterial color="#2c3442" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Lamps — bright emissive */}
      {([-1.7, 0, 1.7] as const).map((x) => (
        <mesh key={x} position={[x, 28.2, 0.75]}>
          <boxGeometry args={[1.2, 0.9, 0.6]} />
          <meshStandardMaterial
            color="#fffaf0"
            emissive="#ffe8a8"
            emissiveIntensity={4.5}
          />
        </mesh>
      ))}
      {/* Main spot aimed at pitch centre */}
      <spotLight
        ref={lightRef}
        position={[0, 28, 0]}
        angle={0.7}
        penumbra={0.5}
        intensity={220}
        distance={160}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00025}
        color="#fff8e8"
        target={target.current}
      />
      {/* Soft fill near light cone */}
      <pointLight
        ref={fillRef}
        position={[0, 20, 0]}
        intensity={40}
        distance={65}
        color="#ffeec8"
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
      {/* Extra mid-height fills so upper stands stay bright */}
      <pointLight position={[0, 16, 40]} intensity={28} distance={70} color="#e8f0ff" />
      <pointLight position={[0, 16, -40]} intensity={28} distance={70} color="#e8f0ff" />
      <pointLight position={[40, 16, 0]} intensity={28} distance={70} color="#e8f0ff" />
      <pointLight position={[-40, 16, 0]} intensity={28} distance={70} color="#e8f0ff" />
    </group>
  );
}
