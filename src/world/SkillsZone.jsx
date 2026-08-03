import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CATEGORIES = [
  { id: 'languages', label: 'Languages', color: '#00a8ff', pos: [-4, 2, 0] },
  { id: 'frameworks', label: 'Frameworks', color: '#00e5ff', pos: [4, 2, -3] },
  { id: 'ai', label: 'AI & ML', color: '#4da6ff', pos: [-3, -2, -5] },
  { id: 'tools', label: 'Tools', color: '#3399ff', pos: [3, -2, -2] },
];

const SKILLS = [
  { label: 'Python', cat: 'languages', offset: [0, 1.5, 0] },
  { label: 'C++', cat: 'languages', offset: [-1.5, 0, 0.5] },
  { label: 'Kotlin', cat: 'languages', offset: [1.5, 0, -0.5] },
  { label: 'JS', cat: 'languages', offset: [0, -1.5, 0.5] },
  { label: 'Dart', cat: 'languages', offset: [1, 1, 1] },
  { label: 'SQL', cat: 'languages', offset: [-1, -1, -0.5] },
  { label: 'React', cat: 'frameworks', offset: [0, 1.5, 0] },
  { label: 'Flutter', cat: 'frameworks', offset: [-1.5, 0, 0] },
  { label: 'Flask', cat: 'frameworks', offset: [1.5, 0, 0.5] },
  { label: 'FastAPI', cat: 'frameworks', offset: [0, -1.5, 0] },
  { label: 'Compose', cat: 'frameworks', offset: [1, 1, -0.5] },
  { label: 'ML', cat: 'ai', offset: [0, 1.5, 0] },
  { label: 'Scikit', cat: 'ai', offset: [-1.5, 0, 0] },
  { label: 'OpenCV', cat: 'ai', offset: [1.5, 0, 0.5] },
  { label: 'DeepFace', cat: 'ai', offset: [0, -1.5, 0] },
  { label: 'Git', cat: 'tools', offset: [0, 1.5, 0] },
  { label: 'MongoDB', cat: 'tools', offset: [-1.5, 0, 0] },
  { label: 'Android', cat: 'tools', offset: [1.5, 0, 0.5] },
  { label: 'Figma', cat: 'tools', offset: [0, -1.5, 0] },
  { label: 'DSA', cat: 'tools', offset: [1, 1, -0.5] },
];

const CONNECTIONS = [
  ['Python', 'Flask'], ['Python', 'FastAPI'], ['Python', 'ML'],
  ['ML', 'Scikit'], ['ML', 'OpenCV'], ['ML', 'DeepFace'],
  ['Kotlin', 'Compose'], ['Kotlin', 'Android'],
  ['Dart', 'Flutter'], ['JS', 'React'],
  ['Flask', 'Git'], ['React', 'Git'],
];

function SkillNode({ position, color, size }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + position[0]) * 0.1;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function ConnectionLine({ start, end, color }) {
  const lineRef = useRef();
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    g.setFromPoints(points);
    return g;
  }, [start, end]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        linewidth={1}
      />
    </line>
  );
}

export default function SkillsZone({ position, scrollProgress }) {
  const groupRef = useRef();

  // Build positions map
  const positionMap = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((cat) => {
      map[cat.label] = cat.pos;
    });
    SKILLS.forEach((skill) => {
      const cat = CATEGORIES.find((c) => c.id === skill.cat);
      if (cat) {
        map[skill.label] = [
          cat.pos[0] + skill.offset[0],
          cat.pos[1] + skill.offset[1],
          cat.pos[2] + skill.offset[2],
        ];
      }
    });
    return map;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Category hub nodes */}
      {CATEGORIES.map((cat) => (
        <SkillNode key={cat.id} position={cat.pos} color={cat.color} size={0.35} />
      ))}

      {/* Skill nodes */}
      {SKILLS.map((skill) => {
        const cat = CATEGORIES.find((c) => c.id === skill.cat);
        const pos = [
          cat.pos[0] + skill.offset[0],
          cat.pos[1] + skill.offset[1],
          cat.pos[2] + skill.offset[2],
        ];
        return <SkillNode key={skill.label} position={pos} color={cat.color} size={0.15} />;
      })}

      {/* Connection lines from skills to hubs */}
      {SKILLS.map((skill) => {
        const cat = CATEGORIES.find((c) => c.id === skill.cat);
        const skillPos = [
          cat.pos[0] + skill.offset[0],
          cat.pos[1] + skill.offset[1],
          cat.pos[2] + skill.offset[2],
        ];
        return (
          <ConnectionLine
            key={`hub-${skill.label}`}
            start={cat.pos}
            end={skillPos}
            color={cat.color}
          />
        );
      })}

      {/* Cross-category connections */}
      {CONNECTIONS.map(([from, to], idx) => {
        if (positionMap[from] && positionMap[to]) {
          return (
            <ConnectionLine
              key={`cc-${idx}`}
              start={positionMap[from]}
              end={positionMap[to]}
              color="#00a8ff"
            />
          );
        }
        return null;
      })}

      <pointLight position={[0, 0, -2]} color="#00a8ff" intensity={3} distance={20} />
    </group>
  );
}
