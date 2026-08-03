import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const INTEREST_NODES = [
  { id: 'ai', label: 'AI', color: '#00a8ff', angle: 0, geometry: 'icosahedron' },
  { id: 'cyber', label: 'Cyber', color: '#00e5ff', angle: Math.PI * 0.4, geometry: 'octahedron' },
  { id: 'space', label: 'Space', color: '#4da6ff', angle: Math.PI * 0.8, geometry: 'dodecahedron' },
  { id: 'aviation', label: 'Aviation', color: '#0080cc', angle: Math.PI * 1.2, geometry: 'tetrahedron' },
  { id: 'software', label: 'Software', color: '#3399ff', angle: Math.PI * 1.6, geometry: 'box' },
];

function InterestNode({ node, orbitRadius }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Orbit around center
    const x = Math.cos(node.angle + t * 0.1) * orbitRadius;
    const y = Math.sin(t * 0.3 + node.angle) * 1.5;
    const z = Math.sin(node.angle + t * 0.1) * orbitRadius;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.2;

    // Scale on hover
    const targetScale = hovered ? 1.5 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Ring pulse
    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position);
      ringRef.current.rotation.x = Math.PI / 2;
      const ringScale = hovered ? 1.8 : 1.2;
      ringRef.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.1);
    }
  });

  const GeometryComponent = () => {
    switch (node.geometry) {
      case 'icosahedron': return <icosahedronGeometry args={[0.6, 0]} />;
      case 'octahedron': return <octahedronGeometry args={[0.6, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.5, 0]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[0.6, 0]} />;
      case 'box': return <boxGeometry args={[0.7, 0.7, 0.7]} />;
      default: return <sphereGeometry args={[0.5, 16, 16]} />;
    }
  };

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <GeometryComponent />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 3 : 1.5}
          wireframe
          transparent
          opacity={hovered ? 0.9 : 0.6}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 2 : 0.5}
          transparent
          opacity={hovered ? 0.7 : 0.3}
        />
      </mesh>
    </>
  );
}

export default function InterestsZone({ position, scrollProgress }) {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position}>
      {/* Central hub sphere */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Orbital interest nodes */}
      {INTEREST_NODES.map((node) => (
        <InterestNode key={node.id} node={node} orbitRadius={6} />
      ))}

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.01, 16, 128]} />
        <meshStandardMaterial
          color="#00a8ff"
          emissive="#00a8ff"
          emissiveIntensity={1}
          transparent
          opacity={0.2}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} color="#00e5ff" intensity={3} distance={20} />
    </group>
  );
}
