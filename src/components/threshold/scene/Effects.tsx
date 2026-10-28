import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

/** Full tier only: HDR bloom on emissive channels, filmic tone map, vignette and fine grain. */
export function Effects({ multisampling = 4 }: { multisampling?: number }) {
  return (
    <EffectComposer multisampling={multisampling} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.85} luminanceThreshold={1.05} luminanceSmoothing={0.2} radius={0.72} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.28} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.08} />
    </EffectComposer>
  )
}
