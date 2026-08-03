import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ scrollProgress }) {
  const pointsRef = useRef();
  const COUNT = 800;

  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = Math.random() * -260;
      sd[i * 3] = Math.random();
      sd[i * 3 + 1] = Math.random();
      sd[i * 3 + 2] = Math.random();
    }
    return [pos, sd];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < COUNT; i++) {
      const sx = seeds[i * 3];
      const sy = seeds[i * 3 + 1];
      posArray[i * 3] += Math.sin(time * 0.3 + sx * 6.28) * 0.003;
      posArray[i * 3 + 1] += Math.cos(time * 0.2 + sy * 6.28) * 0.003;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#00a8ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
