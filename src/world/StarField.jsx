import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ scrollProgress }) {
  const pointsRef = useRef();
  const COUNT = 3000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = Math.random() * -260;

      // Mix of white, blue-white, and cyan stars
      const r = 0.7 + Math.random() * 0.3;
      const g = 0.8 + Math.random() * 0.2;
      const b = 0.9 + Math.random() * 0.1;
      col[i * 3] = r;
      col[i * 3 + 1] = g;
      col[i * 3 + 2] = b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.003) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
