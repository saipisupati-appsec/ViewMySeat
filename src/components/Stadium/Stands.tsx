import * as THREE from 'three';

function StandStructure({
  startAngle,
  endAngle,
  innerR,
  outerR,
  yBase,
  height,
  color = '#4a5568',
}: {
  startAngle: number;
  endAngle: number;
  innerR: number;
  outerR: number;
  yBase: number;
  height: number;
  color?: string;
}) {
  const shape = new THREE.Shape();
  const segments = 40;
  const span = endAngle - startAngle;

  for (let i = 0; i <= segments; i++) {
    const a = startAngle + (i / segments) * span;
    const x = Math.cos(a) * outerR;
    const z = Math.sin(a) * outerR;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  for (let i = segments; i >= 0; i--) {
    const a = startAngle + (i / segments) * span;
    const x = Math.cos(a) * innerR;
    const z = Math.sin(a) * innerR;
    shape.lineTo(x, z);
  }
  shape.closePath();

  const extrude = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });
  extrude.rotateX(-Math.PI / 2);
  extrude.translate(0, yBase, 0);

  return (
    <mesh geometry={extrude} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.1} />
    </mesh>
  );
}

/** Thin rail / barrier strip between tiers */
function TierBarrier({
  startAngle,
  endAngle,
  radius,
  y,
  color = '#c8d0d8',
}: {
  startAngle: number;
  endAngle: number;
  radius: number;
  y: number;
  color?: string;
}) {
  const pts: THREE.Vector3[] = [];
  const segments = 36;
  const span = endAngle - startAngle;
  for (let i = 0; i <= segments; i++) {
    const a = startAngle + (i / segments) * span;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, segments, 0.14, 6, false);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.3} />
    </mesh>
  );
}

export function Stands() {
  return (
    <group>
      {/* VIP terrace floor (west) — closest, distinct darker stone */}
      <StandStructure
        startAngle={-Math.PI / 2 - 0.45}
        endAngle={-Math.PI / 2 + 0.45}
        innerR={29}
        outerR={37}
        yBase={0}
        height={5.2}
        color="#3a4250"
      />
      {/* Premium lower N/S */}
      <StandStructure
        startAngle={-0.52}
        endAngle={0.52}
        innerR={33}
        outerR={43}
        yBase={0}
        height={6.2}
        color="#454e60"
      />
      <StandStructure
        startAngle={Math.PI - 0.52}
        endAngle={Math.PI + 0.52}
        innerR={33}
        outerR={43}
        yBase={0}
        height={6.2}
        color="#454e60"
      />
      {/* General upper N/S */}
      <StandStructure
        startAngle={-0.48}
        endAngle={0.48}
        innerR={43}
        outerR={55}
        yBase={6.5}
        height={9.5}
        color="#3a4354"
      />
      <StandStructure
        startAngle={Math.PI - 0.48}
        endAngle={Math.PI + 0.48}
        innerR={43}
        outerR={55}
        yBase={6.5}
        height={9.5}
        color="#3a4354"
      />
      {/* East general */}
      <StandStructure
        startAngle={Math.PI / 2 - 0.6}
        endAngle={Math.PI / 2 + 0.6}
        innerR={37}
        outerR={51}
        yBase={0}
        height={5.8}
        color="#454e60"
      />
      <StandStructure
        startAngle={Math.PI / 2 - 0.55}
        endAngle={Math.PI / 2 + 0.55}
        innerR={45}
        outerR={57}
        yBase={6.2}
        height={8.5}
        color="#3a4354"
      />
      {/* West upper premium */}
      <StandStructure
        startAngle={-Math.PI / 2 - 0.42}
        endAngle={-Math.PI / 2 + 0.42}
        innerR={37}
        outerR={50}
        yBase={5.5}
        height={7.5}
        color="#3d4555"
      />

      {/* Tier separation rails — clearly mark VIP / Premium / General boundaries */}
      <TierBarrier
        startAngle={-Math.PI / 2 - 0.44}
        endAngle={-Math.PI / 2 + 0.44}
        radius={37.2}
        y={5.4}
        color="#d4a574"
      />
      <TierBarrier startAngle={-0.5} endAngle={0.5} radius={43.2} y={6.7} />
      <TierBarrier startAngle={Math.PI - 0.5} endAngle={Math.PI + 0.5} radius={43.2} y={6.7} />
      <TierBarrier
        startAngle={Math.PI / 2 - 0.58}
        endAngle={Math.PI / 2 + 0.58}
        radius={44.8}
        y={6.3}
      />

      {/* Roof canopies */}
      {[
        { a: 0, r: 51, w: 44, d: 14 },
        { a: Math.PI, r: 51, w: 44, d: 14 },
        { a: Math.PI / 2, r: 55, w: 50, d: 13 },
        { a: -Math.PI / 2, r: 51, w: 42, d: 13 },
      ].map((roof, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(roof.a) * roof.r * 0.72,
            16.5,
            Math.sin(roof.a) * roof.r * 0.72,
          ]}
          rotation={[0.12, -roof.a + Math.PI / 2, 0]}
          castShadow
        >
          <boxGeometry args={[roof.w, 0.35, roof.d]} />
          <meshStandardMaterial color="#2e3648" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}

      {/* Ground plaza — lighter so stadium doesn't sink into black */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[78, 64]} />
        <meshStandardMaterial color="#2e3648" roughness={0.92} />
      </mesh>
    </group>
  );
}
