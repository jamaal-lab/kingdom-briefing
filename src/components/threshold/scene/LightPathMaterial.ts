/**
 * Illuminated pathways: an emissive shader for thin tubes whose UV.x runs
 * along their length. Light pulses travel along the path; uReveal draws the
 * path in from its origin. Output is HDR (> 1) so bloom picks it up, and it
 * respects scene fog so distant channels sink into the atmosphere.
 */
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`

const fragmentShader = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform float uTime;
  uniform float uReveal;
  uniform float uIntensity;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uBase;
  uniform float uOffset;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float along = vUv.x;
    float shown = 1.0 - smoothstep(uReveal - 0.04, uReveal, along);
    float head = fract(along * uDensity - uTime * uSpeed + uOffset);
    float pulse = pow(head, 22.0) * 3.2 + pow(head, 4.0) * 0.35;
    float edge = smoothstep(uReveal - 0.04, uReveal, along) * (1.0 - step(uReveal, along)) * 2.0;
    if (shown < 0.001 && edge < 0.001) discard;
    vec3 col = uColor * (uBase + pulse + edge) * uIntensity * max(shown, edge);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`

export type LightPathUniforms = {
  uTime: { value: number }
  uReveal: { value: number }
  uIntensity: { value: number }
  uSpeed: { value: number }
  uDensity: { value: number }
  uBase: { value: number }
  uOffset: { value: number }
  uColor: { value: THREE.Color }
}

export function createLightPathMaterial(opts: Partial<{ color: string; intensity: number; speed: number; density: number; base: number; offset: number }> = {}) {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    fog: true,
    toneMapped: true,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uTime: { value: 0 },
        uReveal: { value: 1.04 },
        uIntensity: { value: opts.intensity ?? 4 },
        uSpeed: { value: opts.speed ?? 0.12 },
        uDensity: { value: opts.density ?? 1.5 },
        uBase: { value: opts.base ?? 0.45 },
        uOffset: { value: opts.offset ?? 0 },
        uColor: { value: new THREE.Color(opts.color ?? '#e9c46a') },
      },
    ]),
  })
  return material as THREE.ShaderMaterial & { uniforms: LightPathUniforms }
}
