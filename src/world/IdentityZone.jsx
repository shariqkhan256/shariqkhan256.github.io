import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HolographicRing({ radius, color, speed, axis }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    if (axis === 'x') ref.current.rotation.x = t * speed;
    else if (axis === 'y') ref.current.rotation.y = t * speed;
    else ref.current.rotation.z = t * speed;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function FloatingShape({ geometry, position, color, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 0.7;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function IdentityZone({ position, scrollProgress }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Subtle floating bob
    groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central holographic rings */}
      <HolographicRing radius={3} color="#00a8ff" speed={0.2} axis="y" />
      <HolographicRing radius={3.5} color="#00e5ff" speed={-0.15} axis="x" />
      <HolographicRing radius={4} color="#4da6ff" speed={0.1} axis="z" />

      {/* Central glow sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#00a8ff"
          emissive="#00a8ff"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting shapes */}
      <FloatingShape
        geometry={<icosahedronGeometry args={[0.5, 0]} />}
        position={[5, 1, -2]}
        color="#00e5ff"
        speed={0.3}
      />
      <FloatingShape
        geometry={<octahedronGeometry args={[0.4, 0]} />}
        position={[-4, -1, 1]}
        color="#4da6ff"
        speed={0.25}
      />
      <FloatingShape
        geometry={<dodecahedronGeometry args={[0.35, 0]} />}
        position={[2, -2, 3]}
        color="#00a8ff"
        speed={0.35}
      />

      {/* Radar grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <ringGeometry args={[2, 8, 64]} />
        <meshStandardMaterial
          color="#00a8ff"
          emissive="#00a8ff"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Point light for the identity zone */}
      <pointLight position={[0, 0, 0]} color="#00a8ff" intensity={5} distance={15} />
    </group>
  );
}
