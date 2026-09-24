import * as THREE from 'three';

function StandStructure({
  startAngle,
  endAngle,
  innerR,
  outerR,
  yBase,
  height,
  color = '#3a3f4b',
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
  const segments = 32;
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
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
    </mesh>
  );
}

export function Stands() {
  return (
    <group>
      <StandStructure startAngle={-0.5} endAngle={0.5} innerR={34} outerR={48} yBase={0} height={6} color="#2c3140" />
      <StandStructure startAngle={-0.45} endAngle={0.45} innerR={40} outerR={52} yBase={6.5} height={8} color="#252a36" />
      <StandStructure startAngle={Math.PI - 0.5} endAngle={Math.PI + 0.5} innerR={34} outerR={48} yBase={0} height={6} color="#2c3140" />
      <StandStructure startAngle={Math.PI - 0.45} endAngle={Math.PI + 0.45} innerR={40} outerR={52} yBase={6.5} height={8} color="#252a36" />
      <StandStructure startAngle={Math.PI / 2 - 0.6} endAngle={Math.PI / 2 + 0.6} innerR={40} outerR={55} yBase={0} height={6} color="#2c3140" />
      <StandStructure startAngle={Math.PI / 2 - 0.55} endAngle={Math.PI / 2 + 0.55} innerR={46} outerR={58} yBase={6.5} height={7} color="#252a36" />
      <StandStructure startAngle={-Math.PI / 2 - 0.55} endAngle={-Math.PI / 2 + 0.55} innerR={36} outerR={50} yBase={0} height={7} color="#1e2430" />
      <StandStructure startAngle={-Math.PI / 2 - 0.5} endAngle={-Math.PI / 2 + 0.5} innerR={42} outerR={54} yBase={7.5} height={7} color="#181d28" />

      {[
        { a: 0, r: 50, w: 40, d: 12 },
        { a: Math.PI, r: 50, w: 40, d: 12 },
        { a: Math.PI / 2, r: 56, w: 50, d: 10 },
        { a: -Math.PI / 2, r: 52, w: 45, d: 10 },
      ].map((roof, i) => (
        <mesh
          key={i}
          position={[Math.cos(roof.a) * roof.r * 0.7, 15, Math.sin(roof.a) * roof.r * 0.7]}
          rotation={[0.15, -roof.a + Math.PI / 2, 0]}
          castShadow
        >
          <boxGeometry args={[roof.w, 0.4, roof.d]} />
          <meshStandardMaterial color="#1a1f2a" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial color="#1a1d24" roughness={1} />
      </mesh>
    </group>
  );
}
