import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSeatStore } from '../store/seatStore';

const OVERVIEW_POS = new THREE.Vector3(0, 50, 75);
const OVERVIEW_TARGET = new THREE.Vector3(0, 2, 0);
const OVERVIEW_FOV = 42;
const SEAT_FOV = 62;

/** Realistic adult seated eye height above seat origin (~1.15–1.2 m) */
const EYE_HEIGHT = 1.18;
/** Camera slightly behind seat back to avoid clipping geometry */
const BEHIND = 0.38;
/** Slight lateral offset so nearby seats / aisles remain visible */
const LATERAL = 0.1;

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
  const startFov = useRef(OVERVIEW_FOV);
  const endFov = useRef(OVERVIEW_FOV);
  const progress = useRef(0);

  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;

    if (viewMode === 'seat' && focusedSeatId) {
      const seat = seats.find((s) => s.id === focusedSeatId);
      if (!seat) return;

      const [sx, sy, sz] = seat.position;
      // Face toward pitch centre
      const forwardX = Math.cos(seat.rotation);
      const forwardZ = Math.sin(seat.rotation);
      const rightX = Math.cos(seat.rotation + Math.PI / 2);
      const rightZ = Math.sin(seat.rotation + Math.PI / 2);

      // Eye position: above seat pan, slightly behind backrest
      endPos.current.set(
        sx - forwardX * BEHIND + rightX * LATERAL,
        sy + EYE_HEIGHT,
        sz - forwardZ * BEHIND + rightZ * LATERAL
      );

      // Distance-dependent look target — VIP closer / flatter, upper wider view
      const dist = Math.sqrt(sx * sx + sz * sz);
      const lookY = dist < 34 ? 0.32 : dist < 40 ? 0.48 : dist < 46 ? 0.68 : 0.9;
      const lookDist = dist < 36 ? 11 : dist < 42 ? 15 : 20;
      endTarget.current.set(forwardX * lookDist, lookY, forwardZ * lookDist);

      startPos.current.copy(camera.position);
      if (controlsRef.current) {
        startTarget.current.copy(controlsRef.current.target);
      } else {
        startTarget.current.copy(OVERVIEW_TARGET);
      }

      startFov.current = persp.fov;
      endFov.current = SEAT_FOV;

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

      startFov.current = persp.fov;
      endFov.current = OVERVIEW_FOV;

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

    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = THREE.MathUtils.lerp(startFov.current, endFov.current, ease);
    persp.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
    }

    if (progress.current >= 1) {
      animating.current = false;
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        if (viewMode === 'seat') {
          // Limited look-around — keeps camera near the seat
          controlsRef.current.minDistance = 0.1;
          controlsRef.current.maxDistance = 0.55;
          controlsRef.current.minPolarAngle = 0.48;
          controlsRef.current.maxPolarAngle = Math.PI / 2.05;
          controlsRef.current.enablePan = false;
        } else {
          controlsRef.current.minDistance = 22;
          controlsRef.current.maxDistance = 130;
          controlsRef.current.minPolarAngle = 0.22;
          controlsRef.current.maxPolarAngle = Math.PI / 2.2;
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
      maxDistance={130}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 2, 0]}
      enablePan={viewMode === 'overview'}
    />
  );
}
