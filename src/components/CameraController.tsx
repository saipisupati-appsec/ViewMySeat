import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSeatStore } from '../store/seatStore';

const OVERVIEW_POS = new THREE.Vector3(0, 48, 72);
const OVERVIEW_TARGET = new THREE.Vector3(0, 2, 0);

/** Seated eye height above seat origin (realistic adult seated) */
const EYE_HEIGHT = 1.15;
/** Camera slightly behind seat back so it doesn't clip geometry */
const BEHIND = 0.35;

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const viewMode = useSeatStore((s) => s.viewMode);
  const focusedSeatId = useSeatStore((s) => s.focusedSeatId);
  const seats = useSeatStore((s) => s.seats);

  const animating = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());
  const progress = useRef(0);

  useEffect(() => {
    if (viewMode === 'seat' && focusedSeatId) {
      const seat = seats.find((s) => s.id === focusedSeatId);
      if (!seat) return;

      const [sx, sy, sz] = seat.position;
      const forwardX = Math.cos(seat.rotation);
      const forwardZ = Math.sin(seat.rotation);

      endPos.current.set(
        sx - forwardX * BEHIND,
        sy + EYE_HEIGHT,
        sz - forwardZ * BEHIND
      );

      const dist = Math.sqrt(sx * sx + sz * sz);
      const lookY = dist < 36 ? 0.4 : dist < 42 ? 0.55 : 0.75;
      endTarget.current.set(forwardX * 8, lookY, forwardZ * 8);

      startPos.current.copy(camera.position);
      if (controlsRef.current) {
        startTarget.current.copy(controlsRef.current.target);
      } else {
        startTarget.current.copy(OVERVIEW_TARGET);
      }

      progress.current = 0;
      animating.current = true;
      if (controlsRef.current) controlsRef.current.enabled = false;
    } else if (viewMode === 'overview') {
      startPos.current.copy(camera.position);
      if (controlsRef.current) {
        startTarget.current.copy(controlsRef.current.target);
      }
      endPos.current.copy(OVERVIEW_POS);
      endTarget.current.copy(OVERVIEW_TARGET);
      progress.current = 0;
      animating.current = true;
      if (controlsRef.current) controlsRef.current.enabled = false;
    }
  }, [viewMode, focusedSeatId, seats, camera]);

  useFrame((_, delta) => {
    if (!animating.current) return;

    progress.current = Math.min(1, progress.current + delta * 0.85);
    const t = progress.current;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(startPos.current, endPos.current, ease);

    const target = new THREE.Vector3().lerpVectors(
      startTarget.current,
      endTarget.current,
      ease
    );
    camera.lookAt(target);

    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
    }

    if (progress.current >= 1) {
      animating.current = false;
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        if (viewMode === 'seat') {
          controlsRef.current.minDistance = 0.15;
          controlsRef.current.maxDistance = 0.8;
          controlsRef.current.minPolarAngle = 0.55;
          controlsRef.current.maxPolarAngle = Math.PI / 2.05;
          controlsRef.current.enablePan = false;
        } else {
          controlsRef.current.minDistance = 22;
          controlsRef.current.maxDistance = 120;
          controlsRef.current.minPolarAngle = 0.25;
          controlsRef.current.maxPolarAngle = Math.PI / 2.25;
          controlsRef.current.enablePan = true;
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={22}
      maxDistance={120}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2.25}
      target={[0, 2, 0]}
      enablePan={viewMode === 'overview'}
    />
  );
}
