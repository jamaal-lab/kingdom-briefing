import { useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Materials } from './materials'
import { createLightPathMaterial } from './LightPathMaterial'
import { sceneState } from '../choreography'
import { useThreshold, sceneTime } from './context'

/**
 * The gateway: two black stone pylons and a gold-clad lintel framing five
 * telescoping portal frames (alternating satin gold and brushed titanium)
 * that recede into the opening. Gold light channels are inlaid into the
 * titanium frames and the pylons' inner faces.
 */

const FRAMES = [
  { w: 8.5, h: 15.5, t: 0.72, d: 0.62, z: 1.4, metal: 'gold' as const },
  { w: 7.3, h: 14.4, t: 0.56, d: 0.56, z: 0.35, metal: 'titanium' as const },
  { w: 6.3, h: 13.4, t: 0.6, d: 0.52, z: -0.7, metal: 'gold' as const },
  { w: 5.3, h: 12.4, t: 0.46, d: 0.48, z: -1.75, metal: 'titanium' as const },
  { w: 4.4, h: 11.4, t: 0.48, d: 0.44, z: -2.8, metal: 'gold' as const },
]

function frameGeometry(w: number, h: number, t: number, d: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(-w / 2, h)
  s.lineTo(w / 2, h)
  s.lineTo(w / 2, 0)
  s.lineTo(w / 2 - t, 0)
  s.lineTo(w / 2 - t, h - t)
  s.lineTo(-w / 2 + t, h - t)
  s.lineTo(-w / 2 + t, 0)
  s.closePath()
  const bevel = 0.025
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: d - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 1,
  })
  geo.translate(0, 0, -d / 2 + bevel)
  geo.computeVertexNormals()
  return geo
}

/** A U-shaped polyline (foot → over the top → foot) as a thin tube with UV.x along its length. */
function channelGeometry(w: number, h: number, radius = 0.022) {
  const pts = [
    new THREE.Vector3(-w / 2, 0.05, 0),
    new THREE.Vector3(-w / 2, h, 0),
    new THREE.Vector3(w / 2, h, 0),
    new THREE.Vector3(w / 2, 0.05, 0),
  ]
  const path = new THREE.CurvePath<THREE.Vector3>()
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]))
  return new THREE.TubeGeometry(path, 240, radius, 6, false)
}

function lineGeometry(a: THREE.Vector3, b: THREE.Vector3, radius = 0.02) {
  return new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 64, radius, 6, false)
}

export function Gateway({ materials, shadows }: { materials: Materials; shadows: boolean }) {
  const rt = useThreshold()

  const frames = useMemo(() => FRAMES.map((f) => ({ ...f, geo: frameGeometry(f.w, f.h, f.t, f.d) })), [])

  const channels = useMemo(() => {
    const items: { geo: THREE.BufferGeometry; mat: ReturnType<typeof createLightPathMaterial>; position: [number, number, number] }[] = []
    FRAMES.forEach((f, i) => {
      if (f.metal !== 'titanium') return
      items.push({
        geo: channelGeometry(f.w - f.t, f.h - f.t / 2),
        mat: createLightPathMaterial({ intensity: 5, speed: 0.07, density: 1.2, offset: i * 0.37 }),
        position: [0, 0, f.z + f.d / 2 + 0.004],
      })
    })
    // Vertical slits on the pylons' inner faces.
    for (const side of [-1, 1]) {
      items.push({
        geo: lineGeometry(new THREE.Vector3(0, 0.6, 0), new THREE.Vector3(0, 16.2, 0), 0.03),
        mat: createLightPathMaterial({ intensity: 4.2, speed: 0.05, density: 1, offset: side > 0 ? 0.5 : 0 }),
        position: [side * 4.72, 0, 1.72],
      })
    }
    // A single line under the lintel's front face.
    items.push({
      geo: lineGeometry(new THREE.Vector3(-7.4, 0, 0), new THREE.Vector3(7.4, 0, 0), 0.026),
      mat: createLightPathMaterial({ intensity: 3.6, speed: 0.04, density: 1, base: 0.6 }),
      position: [0, 18.05, 1.91],
    })
    return items
  }, [])

  useEffect(
    () => () => {
      frames.forEach((f) => f.geo.dispose())
      channels.forEach((c) => {
        c.geo.dispose()
        c.mat.dispose()
      })
    },
    [frames, channels],
  )

  useFrame((state) => {
    const t = sceneTime(rt, state.clock.elapsedTime)
    const s = sceneState(rt.progress.current)
    for (const c of channels) {
      c.mat.uniforms.uTime.value = t
      c.mat.uniforms.uIntensity.value = 4.2 * s.channels
    }
  })

  const cast = shadows
  return (
    <group>
      {/* Pylons, plinths and lintel */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 5.6, 0, 0]}>
          <RoundedBox args={[2.6, 17, 3.4]} radius={0.05} smoothness={3} position={[0, 8.5, 0]} material={materials.blackStone} castShadow={cast} receiveShadow />
          <RoundedBox args={[3.3, 0.5, 4.3]} radius={0.04} smoothness={3} position={[0, 0.25, 0]} material={materials.blackStone} castShadow={cast} receiveShadow />
          <RoundedBox args={[2.78, 0.16, 3.58]} radius={0.03} smoothness={3} position={[0, 15.4, 0]} material={materials.gold} castShadow={cast} />
        </group>
      ))}
      <RoundedBox args={[15.6, 2.4, 3.8]} radius={0.06} smoothness={3} position={[0, 18.2, 0]} material={materials.blackStone} castShadow={cast} receiveShadow />
      <RoundedBox args={[15.9, 0.34, 4.0]} radius={0.04} smoothness={3} position={[0, 17.0, 0]} material={materials.goldLintel} castShadow={cast} />
      <RoundedBox args={[16.4, 0.7, 4.4]} radius={0.05} smoothness={3} position={[0, 19.75, 0]} material={materials.blackStone} castShadow={cast} />

      {/* Telescoping portal frames */}
      {frames.map((f, i) => (
        <mesh key={i} geometry={f.geo} position={[0, 0, f.z]} material={f.metal === 'gold' ? materials.gold : materials.titanium} castShadow={cast} receiveShadow />
      ))}

      {/* Light channels */}
      {channels.map((c, i) => (
        <mesh key={i} geometry={c.geo} material={c.mat} position={c.position} />
      ))}
    </group>
  )
}
