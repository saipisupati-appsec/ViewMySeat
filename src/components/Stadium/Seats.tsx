import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSeatStore } from '../../store/seatStore';
import type { Seat } from '../../types';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

/**
 * Recognizable stadium seat geometry:
 * - Slightly cupped seat pan
 * - Tall backrest (reclined via matrix)
 * - Armrests (VIP/Premium feel)
 * All instanced for performance.
 */
function createSeatPanGeometry() {
  const geo = new THREE.BoxGeometry(0.54, 0.09, 0.5, 1, 1, 1);
  geo.translate(0, 0.05, 0.03);
  return geo;
}

function createSeatBackGeometry() {
  const geo = new THREE.BoxGeometry(0.54, 0.62, 0.08, 1, 1, 1);
  geo.translate(0, 0.4, -0.24);
  return geo;
}

function createArmGeometry() {
  const geo = new THREE.BoxGeometry(0.055, 0.24, 0.42, 1, 1, 1);
  geo.translate(0, 0.2, 0.02);
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

function getSeatColor(seat: Seat, hovered: boolean, focused: boolean): THREE.Color {
  if (focused) return new THREE.Color('#d478a0');
  if (hovered && seat.status === 'available') return new THREE.Color('#8eb8d8');
  if (seat.status === 'selected') return new THREE.Color(STATUS_COLORS.selected);
  if (seat.status === 'booked') return new THREE.Color(STATUS_COLORS.booked);
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
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const indexToId = useMemo(() => seats.map((s) => s.id), [seats]);

  const updateInstances = useCallback(() => {
    if (!panRef.current || !backRef.current || seats.length === 0) return;

    seats.forEach((seat, i) => {
      const [x, y, z] = seat.position;
      const rot = seat.rotation;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, -rot + Math.PI / 2, 0);
      const scale =
        seat.category === 'vip' ? 1.14 : seat.category === 'premium' ? 1.06 : 1;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      panRef.current!.setMatrixAt(i, dummy.matrix);
      backRef.current!.setMatrixAt(i, dummy.matrix);
      armLRef.current?.setMatrixAt(i, dummy.matrix);
      armRRef.current?.setMatrixAt(i, dummy.matrix);

      const c = getSeatColor(seat, seat.id === hoveredId, seat.id === focusedSeatId);
      panRef.current!.setColorAt(i, c);
      backRef.current!.setColorAt(i, c);
      armLRef.current?.setColorAt(i, c);
      armRRef.current?.setColorAt(i, c);
    });

    panRef.current.instanceMatrix.needsUpdate = true;
    backRef.current.instanceMatrix.needsUpdate = true;
    if (armLRef.current) armLRef.current.instanceMatrix.needsUpdate = true;
    if (armRRef.current) armRRef.current.instanceMatrix.needsUpdate = true;

    if (panRef.current.instanceColor) panRef.current.instanceColor.needsUpdate = true;
    if (backRef.current.instanceColor) backRef.current.instanceColor.needsUpdate = true;
    if (armLRef.current?.instanceColor) armLRef.current.instanceColor.needsUpdate = true;
    if (armRRef.current?.instanceColor) armRRef.current.instanceColor.needsUpdate = true;
  }, [seats, hoveredId, focusedSeatId, dummy]);

  useEffect(() => {
    updateInstances();
  }, [updateInstances]);

  useFrame(({ clock }) => {
    if (!panRef.current || seats.length === 0) return;
    const t = clock.elapsedTime;
    let needsUpdate = false;
    seats.forEach((seat, i) => {
      if (seat.status === 'selected') {
        const [x, y, z] = seat.position;
        const bounce = Math.sin(t * 3 + i * 0.5) * 0.035;
        const scale =
          seat.category === 'vip' ? 1.14 : seat.category === 'premium' ? 1.06 : 1;
        dummy.position.set(x, y + bounce, z);
        dummy.rotation.set(0, -seat.rotation + Math.PI / 2, 0);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        panRef.current!.setMatrixAt(i, dummy.matrix);
        backRef.current!.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      panRef.current.instanceMatrix.needsUpdate = true;
      if (backRef.current) backRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined) return;
    const id = indexToId[idx];
    if (!id) return;
    const seat = seats[idx];
    if (seat.status === 'booked') return;
    if (seat.status === 'selected') deselectSeat(id);
    else selectSeat(id);
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined) return;
    const id = indexToId[idx];
    if (!id) return;
    const seat = seats[idx];
    if (seat.status === 'booked') return;
    if (seat.status !== 'selected') selectSeat(id);
    enterSeatView(id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined) return;
    document.body.style.cursor = seats[idx]?.status === 'booked' ? 'not-allowed' : 'pointer';
    setHovered(indexToId[idx] ?? null);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    setHovered(null);
  };

  if (seats.length === 0) return null;

  const matProps = {
    roughness: 0.5,
    metalness: 0.1,
  };

  return (
    <group>
      <instancedMesh
        ref={panRef}
        args={[SEAT_PAN, undefined, seats.length]}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
      <instancedMesh ref={backRef} args={[SEAT_BACK, undefined, seats.length]} castShadow>
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
      <instancedMesh ref={armLRef} args={[ARM_L, undefined, seats.length]} castShadow>
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
      <instancedMesh ref={armRRef} args={[ARM_R, undefined, seats.length]} castShadow>
        <meshStandardMaterial vertexColors {...matProps} />
      </instancedMesh>
    </group>
  );
}
