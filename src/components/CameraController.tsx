import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSeatStore } from '../store/seatStore';

const OVERVIEW_POS = new THREE.Vector3(0, 55, 70);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);

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
      const back = 1.8;
      const up = 1.4;
      endPos.current.set(
        sx - Math.cos(seat.rotation) * back,
        sy + up,
        sz - Math.sin(seat.rotation) * back
      );
      endTarget.current.set(0, 0.8, 0);

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

    progress.current = Math.min(1, progress.current + delta * 0.9);
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
          controlsRef.current.minDistance = 0.5;
          controlsRef.current.maxDistance = 4;
          controlsRef.current.minPolarAngle = 0.3;
          controlsRef.current.maxPolarAngle = Math.PI / 2.1;
        } else {
          controlsRef.current.minDistance = 20;
          controlsRef.current.maxDistance = 120;
          controlsRef.current.minPolarAngle = 0.2;
          controlsRef.current.maxPolarAngle = Math.PI / 2.2;
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={20}
      maxDistance={120}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 0, 0]}
      enablePan={viewMode === 'overview'}
    />
  );
}
