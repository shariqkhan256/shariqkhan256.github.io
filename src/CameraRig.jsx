import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraRig({ scrollProgress }) {
  const { camera } = useThree();
  
  // Create a continuous CatmullRom spline for the camera path
  const cameraPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),       // Zone 0: Identity
      new THREE.Vector3(3, 1, -15),      // Transition to Interests
      new THREE.Vector3(-4, 0, -35),     // Zone 1: Interests
      new THREE.Vector3(1, -2, -55),     // Transition to Projects
      new THREE.Vector3(5, 2, -75),      // Zone 2: Projects
      new THREE.Vector3(-2, 0, -95),     // Transition to Skills
      new THREE.Vector3(0, 3, -115),     // Zone 3: Skills
      new THREE.Vector3(3, -1, -135),    // Transition to Journey
      new THREE.Vector3(-3, 0, -155),    // Zone 4: Journey
      new THREE.Vector3(0, 5, -175),     // Transition to Vision
      new THREE.Vector3(5, 2, -195),     // Zone 5: Vision
      new THREE.Vector3(0, 0, -215),     // Transition to Contact
      new THREE.Vector3(0, 0, -230),     // Zone 6: Contact
    ]);
  }, []);

  // Create a spline for what the camera looks at
  const targetPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),         // Looking at Identity
      new THREE.Vector3(0, 0, -35),       // Looking at Interests
      new THREE.Vector3(0, 0, -35),
      new THREE.Vector3(0, 0, -75),       // Looking at Projects
      new THREE.Vector3(0, 0, -75),
      new THREE.Vector3(0, 0, -115),      // Looking at Skills
      new THREE.Vector3(0, 0, -115),
      new THREE.Vector3(0, 0, -155),      // Looking at Journey
      new THREE.Vector3(0, 0, -155),
      new THREE.Vector3(0, 0, -195),      // Looking at Vision (Earth)
      new THREE.Vector3(0, 0, -195),
      new THREE.Vector3(0, 0, -230),      // Looking at Contact
      new THREE.Vector3(0, 0, -235),
    ]);
  }, []);

  const progressRef = useRef(0);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // Smoothly interpolate (lerp) scroll progress to avoid abrupt movements
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, scrollProgress, 0.08);

    // Clamp progress to 0-1 range
    const clampedProgress = Math.min(Math.max(progressRef.current, 0), 1);

    // Get target camera position along the spline
    const targetCamPos = cameraPath.getPointAt(clampedProgress);
    camera.position.copy(targetCamPos);

    // Get look-at target position along the target spline
    const targetLookAt = targetPath.getPointAt(clampedProgress);
    lookTarget.lerp(targetLookAt, 0.1);

    camera.lookAt(lookTarget);
  });

  return null;
}
