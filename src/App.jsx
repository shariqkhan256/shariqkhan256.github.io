import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';

import { profile } from './data/portfolio.js';
import CameraRig from './CameraRig.jsx';
import Experience from './Experience.jsx';
import PostProcessing from './effects/PostProcessing.jsx';

import BootSequence from './overlays/BootSequence.jsx';
import HUD from './overlays/HUD.jsx';
import ZoneOverlays from './overlays/ZoneOverlays.jsx';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bootCompleted, setBootCompleted] = useState(false);

  // Initialize Lenis Smooth Scroll and Scroll Progress tracker
  useEffect(() => {
    if (!bootCompleted) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [bootCompleted]);

  return (
    <div className="portfolio-app">
      {!bootCompleted && (
        <BootSequence onComplete={() => setBootCompleted(true)} />
      )}

      {bootCompleted && (
        <>
          {/* Fixed HUD elements */}
          <HUD scrollProgress={scrollProgress} />
          
          {/* Fixed HTML text overlays that fade in/out */}
          <ZoneOverlays scrollProgress={scrollProgress} />

          {/* R3F Canvas container */}
          <div className="canvas-wrapper">
            <Canvas
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
              camera={{ fov: 60, near: 0.1, far: 1000 }}
            >
              <color attach="background" args={['#030810']} />
              
              {/* Cinematic fog */}
              <fogExp2 attach="fog" args={['#030810', 0.008]} />
              
              <Suspense fallback={null}>
                {/* Ambient lights */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00a8ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00e5ff" />

                {/* Animated Camera Rig following scroll spline */}
                <CameraRig scrollProgress={scrollProgress} />

                {/* Single continuous 3D world */}
                <Experience scrollProgress={scrollProgress} />

                {/* Postprocessing effects */}
                <PostProcessing />
              </Suspense>
            </Canvas>
          </div>

          {/* Scroll track dummy block to allow scroll actions */}
          <div className="scroll-container"></div>
        </>
      )}
    </div>
  );
}
