import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Satellite({ orbitRadius, speed, offset, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.y = Math.sin(t * 0.7) * orbitRadius * 0.3;
    ref.current.position.z = Math.sin(t) * orbitRadius;
    ref.current.rotation.y = t;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.15, 0.15, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
        />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.25, 0, 0]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshStandardMaterial
          color="#4da6ff"
          emissive="#4da6ff"
          emissiveIntensity={1}
          side={2}
        />
      </mesh>
      <mesh position={[-0.25, 0, 0]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshStandardMaterial
          color="#4da6ff"
          emissive="#4da6ff"
          emissiveIntensity={1}
          side={2}
        />
      </mesh>
    </group>
  );
}

export default function VisionZone({ position, scrollProgress }) {
  const earthRef = useRef();

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#0a3d7a"
          emissive="#003366"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshStandardMaterial
          color="#00a8ff"
          emissive="#00a8ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Atmosphere ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 128]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Satellites */}
      <Satellite orbitRadius={5} speed={0.3} offset={0} color="#00e5ff" />
      <Satellite orbitRadius={6} speed={0.2} offset={2} color="#00a8ff" />
      <Satellite orbitRadius={4.5} speed={0.4} offset={4} color="#4da6ff" />

      {/* Earth glow light */}
      <pointLight position={[0, 0, 0]} color="#00a8ff" intensity={5} distance={20} />
      <pointLight position={[5, 3, 5]} color="#ffffff" intensity={2} distance={15} />
    </group>
  );
}
