import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const YEARS = [
  { year: '2021', pos: [-5, 0, 0], color: '#3399ff' },
  { year: '2023', pos: [-2.5, 1, -5], color: '#4da6ff' },
  { year: '2024', pos: [0, -0.5, -10], color: '#00a8ff' },
  { year: '2025', pos: [2.5, 1, -15], color: '#00e5ff' },
  { year: '2026', pos: [5, 0, -20], color: '#00a8ff' },
];

function YearMarker({ year, position, color, index }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 0.4 + index) * 0.3;
    meshRef.current.rotation.y = t * 0.2;

    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position);
      ringRef.current.rotation.x = Math.PI / 2;
      const pulse = 1 + Math.sin(t * 2 + index) * 0.1;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <>
      {/* Year node */}
      <mesh ref={meshRef} position={position}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={ringRef} position={position}>
        <torusGeometry args={[0.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Glow */}
      <pointLight position={position} color={color} intensity={2} distance={8} />
    </>
  );
}

function TimelineLine() {
  const lineRef = useRef();
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      YEARS.map((y) => new THREE.Vector3(...y.pos))
    );
    const points = curve.getPoints(100);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#00a8ff" transparent opacity={0.3} />
    </line>
  );
}

export default function JourneyZone({ position, scrollProgress }) {
  return (
    <group position={position}>
      {/* Timeline connecting line */}
      <TimelineLine />

      {/* Year markers */}
      {YEARS.map((yearData, idx) => (
        <YearMarker
          key={yearData.year}
          year={yearData.year}
          position={yearData.pos}
          color={yearData.color}
          index={idx}
        />
      ))}
    </group>
  );
}
