import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function PulseRing({ radius, color, speed, index }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * speed + index * 2) * 0.15;
    ref.current.scale.set(pulse, pulse, pulse);
    ref.current.material.opacity = 0.15 + Math.sin(t * speed + index) * 0.1;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 128]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function AntennaNode({ position, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.3;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <coneGeometry args={[0.2, 0.6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

export default function ContactZone({ position, scrollProgress }) {
  const dishRef = useRef();

  useFrame((state) => {
    if (dishRef.current) {
      dishRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Central dish structure */}
      <group ref={dishRef}>
        <mesh>
          <torusGeometry args={[2.5, 0.05, 16, 128]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 16, 128]} />
          <meshStandardMaterial
            color="#00a8ff"
            emissive="#00a8ff"
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* Pulse rings expanding outward */}
      <PulseRing radius={3} color="#00a8ff" speed={1} index={0} />
      <PulseRing radius={4} color="#00e5ff" speed={0.8} index={1} />
      <PulseRing radius={5} color="#4da6ff" speed={0.6} index={2} />

      {/* Antenna nodes */}
      <AntennaNode position={[3, 1, 0]} color="#00e5ff" />
      <AntennaNode position={[-3, -1, 1]} color="#00a8ff" />
      <AntennaNode position={[0, 2, -2]} color="#4da6ff" />
      <AntennaNode position={[-2, -2, -1]} color="#3399ff" />

      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={4}
          transparent
          opacity={0.8}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} color="#00e5ff" intensity={5} distance={15} />
    </group>
  );
}
