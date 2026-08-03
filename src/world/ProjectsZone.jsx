import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PROJECT_DATA = [
  { name: 'PhishShield AI', pos: [-6, 2, 0], color: '#00a8ff' },
  { name: 'AttendAI', pos: [-3, -1, -3], color: '#00e5ff' },
  { name: 'SkyLens AI', pos: [0, 3, -6], color: '#0080cc' },
  { name: 'Aura', pos: [4, 0, -2], color: '#4da6ff' },
  { name: 'GetIt', pos: [6, -2, -5], color: '#3399ff' },
  { name: 'SignalLens AR', pos: [-5, 1, -8], color: '#00a8ff' },
  { name: 'NovaLang', pos: [2, -3, -10], color: '#00e5ff' },
  { name: 'RISC-V CPU', pos: [-2, 2, -12], color: '#0080cc' },
  { name: 'Brick Breaker', pos: [5, 1, -14], color: '#4da6ff' },
  { name: 'Chess Game', pos: [-4, -1, -16], color: '#3399ff' },
  { name: 'FlappyCrow', pos: [1, 3, -18], color: '#00a8ff' },
];

function ProjectModule({ project, index }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle bob
    meshRef.current.position.y = project.pos[1] + Math.sin(t * 0.4 + index * 0.5) * 0.3;
    meshRef.current.rotation.y = t * 0.1 + index;
    meshRef.current.rotation.x = Math.sin(t * 0.2 + index) * 0.1;

    // Orbiting ring
    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position);
      ringRef.current.rotation.z = t * 0.5 + index;
      ringRef.current.rotation.x = Math.PI / 3;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={project.pos}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh ref={ringRef} position={project.pos}>
        <torusGeometry args={[1, 0.015, 16, 64]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </>
  );
}

export default function ProjectsZone({ position, scrollProgress }) {
  return (
    <group position={position}>
      {PROJECT_DATA.map((project, idx) => (
        <ProjectModule key={project.name} project={project} index={idx} />
      ))}
      <pointLight position={[0, 0, -8]} color="#00a8ff" intensity={4} distance={25} />
      <pointLight position={[3, 2, -12]} color="#00e5ff" intensity={2} distance={15} />
    </group>
  );
}
