import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useThreshold, sceneTime } from './context'
import { sceneState } from '../choreography'

/**
 * Volumetric light shafts falling from the skylight onto the gate, and a
 * restrained field of dust motes that only exists inside those shafts.
 * Shafts are soft additive cones: fresnel-faded at their silhouettes and
 * faded along their length so they never read as geometry.
 */

const shaftVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`
const shaftFragment = /* glsl */ `
  uniform float uStrength;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    float along = vUv.y;
    float fade = smoothstep(0.0, 0.35, along) * smoothstep(1.0, 0.82, along);
    float soft = pow(vFacing, 2.2);
    float shimmer = 0.9 + 0.1 * sin(uTime * 0.6 + vUv.x * 18.0);
    gl_FragColor = vec4(uColor * soft * fade * uStrength * shimmer, 1.0);
  }
`

const SHAFTS = [
  { from: [-7.5, 36, 9], to: [-1.5, 0, 2.5], r0: 0.5, r1: 4.6, strength: 0.085 },
  { from: [2, 36, 14], to: [2.5, 0, 6], r0: 0.4, r1: 3.4, strength: 0.06 },
  { from: [-2, 36, -2], to: [0.5, 0, -6], r0: 0.5, r1: 5, strength: 0.05 },
] as const

export function Atmosphere({ dust = true }: { dust?: boolean }) {
  const rt = useThreshold()

  const shafts = useMemo(
    () =>
      SHAFTS.map((s) => {
        const from = new THREE.Vector3(...s.from)
        const to = new THREE.Vector3(...s.to)
        const len = from.distanceTo(to)
        const geo = new THREE.CylinderGeometry(s.r0, s.r1, len, 48, 1, true)
        // Align cylinder (Y axis) with the shaft direction; uv.y = 1 at the top.
        const mid = from.clone().add(to).multiplyScalar(0.5)
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), from.clone().sub(to).normalize())
        const mat = new THREE.ShaderMaterial({
          vertexShader: shaftVertex,
          fragmentShader: shaftFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          uniforms: {
            uStrength: { value: s.strength },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#f3dfb4') },
          },
        })
        return { geo, mat, mid, quat, base: s.strength }
      }),
    [],
  )

  const motes = useMemo(() => {
    if (!dust) return null
    const count = 320
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    let s = 1234
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < count; i++) {
      const shaft = SHAFTS[i % SHAFTS.length]
      const t = rnd()
      const from = shaft.from
      const to = shaft.to
      const r = (shaft.r0 + (shaft.r1 - shaft.r0) * (1 - t)) * Math.sqrt(rnd()) * 0.8
      const a = rnd() * Math.PI * 2
      positions[i * 3] = to[0] + (from[0] - to[0]) * t * 0.6 + Math.cos(a) * r
      positions[i * 3 + 1] = to[1] + (from[1] - to[1]) * t * 0.6 + 0.4
      positions[i * 3 + 2] = to[2] + (from[2] - to[2]) * t * 0.6 + Math.sin(a) * r
      seeds[i] = rnd()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixel: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute float seed; uniform float uTime; uniform float uPixel; varying float vAlpha;
        void main(){
          vec3 p = position;
          p.y += mod(uTime * (0.05 + seed * 0.08) + seed * 20.0, 14.0) - 1.0;
          p.x += sin(uTime * 0.2 + seed * 40.0) * 0.4;
          p.z += cos(uTime * 0.17 + seed * 30.0) * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = max(1.0, uPixel * (0.025 + seed * 0.035) / -mv.z);
          vAlpha = (0.25 + 0.75 * seed) * smoothstep(60.0, 8.0, -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.8;
          gl_FragColor = vec4(vec3(1.0, 0.9, 0.72) * a, 1.0);
        }`,
    })
    return { geo, mat }
  }, [dust])

  useEffect(
    () => () => {
      shafts.forEach((s) => {
        s.geo.dispose()
        s.mat.dispose()
      })
      motes?.geo.dispose()
      motes?.mat.dispose()
    },
    [shafts, motes],
  )

  useFrame((state) => {
    const t = sceneTime(rt, state.clock.elapsedTime)
    const p = rt.progress.current
    const st = sceneState(p)
    // Shafts belong to the pavilion; they recede once we're through the gate.
    const inside = 1 - Math.min(1, Math.max(0, (p - 0.52) / 0.12))
    for (const s of shafts) {
      s.mat.uniforms.uTime.value = t
      s.mat.uniforms.uStrength.value = s.base * inside * (0.9 + st.channels * 0.1)
    }
    if (motes) {
      motes.mat.uniforms.uTime.value = t
      const cam = state.camera as THREE.PerspectiveCamera
      motes.mat.uniforms.uPixel.value = (state.gl.getPixelRatio() * state.size.height) / (2 * Math.tan((cam.fov * Math.PI) / 360))
    }
  })

  return (
    <group>
      {shafts.map((s, i) => (
        <mesh key={i} geometry={s.geo} material={s.mat} position={s.mid} quaternion={s.quat} renderOrder={10} />
      ))}
      {motes && <points geometry={motes.geo} material={motes.mat} renderOrder={11} />}
    </group>
  )
}
