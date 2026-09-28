import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSeatStore } from '../../store/seatStore';
import type { Seat } from '../../types';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

/** Seat pan geometry */
function createSeatPanGeometry() {
  const geo = new THREE.BoxGeometry(0.54, 0.09, 0.5, 1, 1, 1);
  geo.translate(0, 0.05, 0.03);
  return geo;
}

/** Tall backrest */
function createSeatBackGeometry() {
  const geo = new THREE.BoxGeometry(0.54, 0.62, 0.08, 1, 1, 1);
  geo.translate(0, 0.4, -0.24);
  return geo;
}

/** Armrest */
function createArmGeometry() {
  const geo = new THREE.BoxGeometry(0.055, 0.24, 0.42, 1, 1, 1);
  geo.translate(0, 0.2, 0.02);
  return geo;
}

/**
 * Slightly larger invisible hit volume so clicks register reliably
 * even when the user aims at the backrest or edge of the seat.
 */
function createHitGeometry() {
  const geo = new THREE.BoxGeometry(0.72, 0.85, 0.7, 1, 1, 1);
  geo.translate(0, 0.38, -0.05);
  return geo;
}

const SEAT_PAN = createSeatPanGeometry();
const SEAT_BACK = createSeatBackGeometry();
const ARM_L = (() => {
  const g = createArmGeometry();
  g.translate(-0.29, 0, 0);
  return g;
})();
const ARM_R = (() => {
  const g = createArmGeometry();
  g.translate(0.29, 0, 0);
  return g;
})();
const HIT_GEO = createHitGeometry();

const COLOR_SELECTED = new THREE.Color('#e8a0b8');
const COLOR_HOVER = new THREE.Color('#9ec8e8');
const COLOR_BOOKED = new THREE.Color(STATUS_COLORS.booked);
const COLOR_FOCUSED = new THREE.Color('#f0b0c8');

function getSeatColor(seat: Seat, hovered: boolean, focused: boolean): THREE.Color {
  if (focused) return COLOR_FOCUSED.clone();
  if (seat.status === 'selected') return COLOR_SELECTED.clone();
  if (seat.status === 'booked') return COLOR_BOOKED.clone();
  if (hovered && seat.status === 'available') return COLOR_HOVER.clone();
  return new THREE.Color(CATEGORY_COLORS[seat.category]);
}

export function Seats() {
  const seats = useSeatStore((s) => s.seats);
  const hoveredId = useSeatStore((s) => s.hoveredId);
  const focusedSeatId = useSeatStore((s) => s.focusedSeatId);
  const selectSeat = useSeatStore((s) => s.selectSeat);
  const deselectSeat = useSeatStore((s) => s.deselectSeat);
  const setHovered = useSeatStore((s) => s.setHovered);
  const enterSeatView = useSeatStore((s) => s.enterSeatView);

  const panRef = useRef<THREE.InstancedMesh>(null);
  const backRef = useRef<THREE.InstancedMesh>(null);
  const armLRef = useRef<THREE.InstancedMesh>(null);
  const armRRef = useRef<THREE.InstancedMesh>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Stable id lookup by instance index
  const indexToId = useMemo(() => seats.map((s) => s.id), [seats]);
  const count = seats.length;

  const updateInstances = useCallback(() => {
    if (!panRef.current || !backRef.current || count === 0) return;

    for (let i = 0; i < count; i++) {
      const seat = seats[i];
      const [x, y, z] = seat.position;
      const rot = seat.rotation;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, -rot + Math.PI / 2, 0);
      const scale =
        seat.category === 'vip' ? 1.14 : seat.category === 'premium' ? 1.06 : 1;
      // Subtle lift for selected seats so they read clearly
      if (seat.status === 'selected') {
        dummy.position.y = y + 0.04;
        dummy.scale.set(scale * 1.04, scale * 1.04, scale * 1.04);
      } else {
        dummy.scale.set(scale, scale, scale);
      }
      dummy.updateMatrix();

      panRef.current.setMatrixAt(i, dummy.matrix);
      backRef.current.setMatrixAt(i, dummy.matrix);
      armLRef.current?.setMatrixAt(i, dummy.matrix);
      armRRef.current?.setMatrixAt(i, dummy.matrix);

      // Hitbox uses same transform (slightly larger geo already)
      if (hitRef.current) {
        hitRef.current.setMatrixAt(i, dummy.matrix);
      }

      const c = getSeatColor(
        seat,
        seat.id === hoveredId,
        seat.id === focusedSeatId
      );
      tmpColor.copy(c);
      panRef.current.setColorAt(i, tmpColor);
      backRef.current.setColorAt(i, tmpColor);
      armLRef.current?.setColorAt(i, tmpColor);
      armRRef.current?.setColorAt(i, tmpColor);
    }

    panRef.current.instanceMatrix.needsUpdate = true;
    backRef.current.instanceMatrix.needsUpdate = true;
    if (armLRef.current) armLRef.current.instanceMatrix.needsUpdate = true;
    if (armRRef.current) armRRef.current.instanceMatrix.needsUpdate = true;
    if (hitRef.current) hitRef.current.instanceMatrix.needsUpdate = true;

    if (panRef.current.instanceColor) panRef.current.instanceColor.needsUpdate = true;
    if (backRef.current.instanceColor) backRef.current.instanceColor.needsUpdate = true;
    if (armLRef.current?.instanceColor) armLRef.current.instanceColor.needsUpdate = true;
    if (armRRef.current?.instanceColor) armRRef.current.instanceColor.needsUpdate = true;
  }, [seats, hoveredId, focusedSeatId, count, dummy, tmpColor]);

  useEffect(() => {
    updateInstances();
  }, [updateInstances]);

  // Soft pulse only on selected seats (subtle, not distracting)
  useFrame(({ clock }) => {
    if (!panRef.current || count === 0) return;
    const t = clock.elapsedTime;
    let needsUpdate = false;
    for (let i = 0; i < count; i++) {
      const seat = seats[i];
      if (seat.status !== 'selected') continue;
      const [x, y, z] = seat.position;
      const bounce = Math.sin(t * 2.2 + i * 0.4) * 0.02;
      const scale =
        seat.category === 'vip' ? 1.14 : seat.category === 'premium' ? 1.06 : 1;
      dummy.position.set(x, y + 0.04 + bounce, z);
      dummy.rotation.set(0, -seat.rotation + Math.PI / 2, 0);
      dummy.scale.set(scale * 1.04, scale * 1.04, scale * 1.04);
      dummy.updateMatrix();
      panRef.current.setMatrixAt(i, dummy.matrix);
      backRef.current?.setMatrixAt(i, dummy.matrix);
      armLRef.current?.setMatrixAt(i, dummy.matrix);
      armRRef.current?.setMatrixAt(i, dummy.matrix);
      needsUpdate = true;
    }
    if (needsUpdate) {
      panRef.current.instanceMatrix.needsUpdate = true;
      if (backRef.current) backRef.current.instanceMatrix.needsUpdate = true;
      if (armLRef.current) armLRef.current.instanceMatrix.needsUpdate = true;
      if (armRRef.current) armRRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const resolveSeat = (e: ThreeEvent<MouseEvent> | ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined || idx < 0 || idx >= count) return null;
    const id = indexToId[idx];
    if (!id) return null;
    return { idx, id, seat: seats[idx] };
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const resolved = resolveSeat(e);
    if (!resolved) return;
    const { id, seat } = resolved;
    if (seat.status === 'booked') return;
    if (seat.status === 'selected') {
      deselectSeat(id);
    } else {
      selectSeat(id);
    }
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    const resolved = resolveSeat(e);
    if (!resolved) return;
    const { id, seat } = resolved;
    if (seat.status === 'booked') return;
    if (seat.status !== 'selected') selectSeat(id);
    enterSeatView(id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    const resolved = resolveSeat(e);
    if (!resolved) return;
    document.body.style.cursor =
      resolved.seat.status === 'booked' ? 'not-allowed' : 'pointer';
    setHovered(resolved.id);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    setHovered(null);
  };

  if (count === 0) return null;

  const matProps = {
    roughness: 0.48,
    metalness: 0.12,
  };

  return (
    <group>
      {/* Visual seat parts — no pointer events (hitbox handles them) */}
      <instancedMesh
        ref={panRef}
        args={[SEAT_PAN, undefined, count]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
      <instancedMesh
        ref={backRef}
        args={[SEAT_BACK, undefined, count]}
        castShadow
        frustumCulled={false}
      >
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
      <instancedMesh
        ref={armLRef}
        args={[ARM_L, undefined, count]}
        castShadow
        frustumCulled={false}
      >
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
      <instancedMesh
        ref={armRRef}
        args={[ARM_R, undefined, count]}
        castShadow
        frustumCulled={false}
      >
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>

      {/* Invisible larger hit volume — sole source of pointer events */}
      <instancedMesh
        ref={hitRef}
        args={[HIT_GEO, undefined, count]}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        frustumCulled={false}
      >
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}
