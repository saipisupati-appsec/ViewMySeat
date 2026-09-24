import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSeatStore } from '../../store/seatStore';
import type { Seat } from '../../types';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../types';

const SEAT_GEO = new THREE.BoxGeometry(0.55, 0.35, 0.55);
const BACK_GEO = new THREE.BoxGeometry(0.55, 0.5, 0.12);

function getSeatColor(seat: Seat, hovered: boolean, focused: boolean): THREE.Color {
  if (focused) return new THREE.Color('#f472b6');
  if (hovered && seat.status === 'available') return new THREE.Color('#a3e635');
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

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const backRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const indexToId = useMemo(() => seats.map((s) => s.id), [seats]);

  const updateInstances = useCallback(() => {
    if (!meshRef.current || !backRef.current || seats.length === 0) return;

    seats.forEach((seat, i) => {
      const [x, y, z] = seat.position;
      const rot = seat.rotation;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, -rot + Math.PI / 2, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(
        x + Math.cos(rot) * 0.22,
        y + 0.35,
        z + Math.sin(rot) * 0.22
      );
      dummy.rotation.set(0, -rot + Math.PI / 2, 0);
      dummy.updateMatrix();
      backRef.current!.setMatrixAt(i, dummy.matrix);

      const c = getSeatColor(seat, seat.id === hoveredId, seat.id === focusedSeatId);
      meshRef.current!.setColorAt(i, c);
      backRef.current!.setColorAt(i, c);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    backRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    if (backRef.current.instanceColor) backRef.current.instanceColor.needsUpdate = true;
  }, [seats, hoveredId, focusedSeatId, dummy]);

  useEffect(() => {
    updateInstances();
  }, [updateInstances]);

  useFrame(({ clock }) => {
    if (!meshRef.current || seats.length === 0) return;
    const t = clock.elapsedTime;
    let needsUpdate = false;
    seats.forEach((seat, i) => {
      if (seat.status === 'selected') {
        const [x, y, z] = seat.position;
        const bounce = Math.sin(t * 3 + i * 0.5) * 0.04;
        dummy.position.set(x, y + bounce, z);
        dummy.rotation.set(0, -seat.rotation + Math.PI / 2, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      }
    });
    if (needsUpdate) meshRef.current.instanceMatrix.needsUpdate = true;
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

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[SEAT_GEO, undefined, seats.length]}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial vertexColors roughness={0.6} metalness={0.15} />
      </instancedMesh>
      <instancedMesh ref={backRef} args={[BACK_GEO, undefined, seats.length]} castShadow>
        <meshStandardMaterial vertexColors roughness={0.6} metalness={0.15} />
      </instancedMesh>
    </group>
  );
}
