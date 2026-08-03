import { lazy, Suspense } from 'react';

// Lazy load the 3D zones to optimize load times
const StarField = lazy(() => import('./world/StarField.jsx'));
const Particles = lazy(() => import('./world/Particles.jsx'));
const IdentityZone = lazy(() => import('./world/IdentityZone.jsx'));
const InterestsZone = lazy(() => import('./world/InterestsZone.jsx'));
const ProjectsZone = lazy(() => import('./world/ProjectsZone.jsx'));
const SkillsZone = lazy(() => import('./world/SkillsZone.jsx'));
const JourneyZone = lazy(() => import('./world/JourneyZone.jsx'));
const VisionZone = lazy(() => import('./world/VisionZone.jsx'));
const ContactZone = lazy(() => import('./world/ContactZone.jsx'));

export default function Experience({ scrollProgress }) {
  return (
    <group>
      <Suspense fallback={null}>
        {/* Background Star field & dust particles */}
        <StarField scrollProgress={scrollProgress} />
        <Particles scrollProgress={scrollProgress} />

        {/* Storytelling Zones */}
        <IdentityZone position={[0, 0, 0]} scrollProgress={scrollProgress} />
        <InterestsZone position={[0, 0, -35]} scrollProgress={scrollProgress} />
        <ProjectsZone position={[0, 0, -75]} scrollProgress={scrollProgress} />
        <SkillsZone position={[0, 0, -115]} scrollProgress={scrollProgress} />
        <JourneyZone position={[0, 0, -155]} scrollProgress={scrollProgress} />
        <VisionZone position={[0, 0, -195]} scrollProgress={scrollProgress} />
        <ContactZone position={[0, 0, -230]} scrollProgress={scrollProgress} />
      </Suspense>
    </group>
  );
}
