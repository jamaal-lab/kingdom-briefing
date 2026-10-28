import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { Materials } from './materials'
import { createLightPathMaterial } from './LightPathMaterial'
import { sceneState } from '../choreography'
import { useThreshold, sceneTime } from './context'
import { useEnvShare } from './Lighting'

/**
 * The pavilion: a polished black stone floor that mirrors the gate, a
 * processional deck (the bridge) running through the opening, colonnades of
 * stone fins giving scale and parallax, a skylight slot overhead, and the warm
 * horizon that waits on the other side.
 */

const FIN_Z = Array.from({ length: 7 }, (_, i) => 38 - i * 6.5)

function Floor({ materials, tier }: { materials: Materials; tier: 'full' | 'lite' }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  // The planar reflection carries the full tier; the lite floor keeps a little sheen.
  useEnvShare(mat, tier === 'full' ? 0.04 : 0.1)
  if (tier === 'full') {
    return (
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -40]} receiveShadow>
        <planeGeometry args={[1600, 1600]} />
        <MeshReflectorMaterial
          ref={mat as never}
          resolution={1024}
          blur={[300, 90]}
          mixBlur={0.8}
          mixStrength={48}
          mixContrast={1.1}
          mirror={0.85}
          depthScale={0}
          color="#0e1218"
          metalness={0.1}
          roughness={0.7}
          roughnessMap={materials.floorRoughness}
          alphaMap={materials.floorFade}
          transparent
        />
      </mesh>
    )
  }
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -40]}>
      <planeGeometry args={[1600, 1600]} />
      <meshStandardMaterial ref={mat} color="#070b12" metalness={0.5} roughness={0.3} roughnessMap={materials.floorRoughness} alphaMap={materials.floorFade} transparent />
    </mesh>
  )
}

/**
 * Sky dome — the destination light. A warm horizon glow concentrated toward
 * the far side of the gate, deep navy overhead. It follows the camera, is
 * unfogged, and is mirrored by the polished floor. The fog colour shifts to
 * this horizon colour once we are outside, so the floor dissolves into it.
 */
export const HORIZON = new THREE.Color('#b9844a')

function Dome() {
  const rt = useThreshold()
  const ref = useRef<THREE.Mesh>(null)
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uStrength: { value: 0.6 }, uHorizon: { value: HORIZON } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main(){
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uStrength; uniform vec3 uHorizon; varying vec3 vDir;
          void main(){
            float e = vDir.y;
            float forward = pow(max(0.0, -vDir.z * 0.5 + 0.5), 2.2);
            float glow = exp(-max(e, 0.0) * 7.0) * forward;
            float core = exp(-max(e, 0.0) * 26.0) * pow(max(0.0, -vDir.z), 6.0);
            vec3 top = vec3(0.012, 0.022, 0.05);
            vec3 col = top + uHorizon * glow * uStrength * 0.8 + vec3(1.0, 0.72, 0.42) * core * uStrength * 1.5;
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )
  useEffect(() => () => mat.dispose(), [mat])
  useFrame((state) => {
    mat.uniforms.uStrength.value = sceneState(rt.progress.current).dawn
    ref.current?.position.copy(state.camera.position)
  })
  return (
    <mesh ref={ref} material={mat} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[380, 48, 24]} />
    </mesh>
  )
}

export function Pavilion({ materials }: { materials: Materials }) {
  const rt = useThreshold()
  const deckLines = useMemo(() => {
    return [-1, 1].map((side, i) => {
      const geo = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(side * 1.9, 0.012, 46), new THREE.Vector3(side * 1.9, 0.012, -18)),
        400,
        0.022,
        6,
        false,
      )
      const mat = createLightPathMaterial({ intensity: 3.4, speed: 0.06, density: 3, offset: i * 0.5, base: 0.38 })
      return { geo, mat }
    })
  }, [])

  useEffect(
    () => () =>
      deckLines.forEach((l) => {
        l.geo.dispose()
        l.mat.dispose()
      }),
    [deckLines],
  )

  useFrame((state) => {
    const t = sceneTime(rt, state.clock.elapsedTime)
    for (const l of deckLines) l.mat.uniforms.uTime.value = t
  })

  return (
    <group>
      <Floor materials={materials} tier={rt.tier} />

      {/* Processional path: two gold inlays in the polished floor, leading through the threshold */}
      {deckLines.map((l, i) => (
        <mesh key={i} geometry={l.geo} material={l.mat} />
      ))}

      {/* Colonnades */}
      {[-1, 1].map((side) =>
        FIN_Z.map((z) => (
          <mesh key={`${side}${z}`} position={[side * 18.6, 17, z]} material={materials.finStone} receiveShadow>
            <boxGeometry args={[1.6, 34, 1.4]} />
          </mesh>
        )),
      )}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 19.6, 17, 19]} material={materials.wall}>
          <boxGeometry args={[0.6, 34, 44]} />
        </mesh>
      ))}

      {/* End wall: the gate is the only way through. */}
      {[-1, 1].map((side) => (
        <mesh key={`w${side}`} position={[side * 13.45, 17, -0.6]} material={materials.wall} receiveShadow>
          <boxGeometry args={[12.5, 34, 2.2]} />
        </mesh>
      ))}
      <mesh position={[0, 27.2, -0.6]} material={materials.wall}>
        <boxGeometry args={[14.4, 13.6, 2.2]} />
      </mesh>


      <Dome />
    </group>
  )
}
