import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        intensity={1.0}
        radius={0.6}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.8} />
    </EffectComposer>
  );
}
