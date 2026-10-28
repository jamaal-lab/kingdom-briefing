import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useThreshold } from './context'
import { sceneState, arrival } from '../choreography'

/**
 * Cinematographic lighting. Reflections on the metals come from a studio
 * environment built from light-formers (soft boxes and strips) rather than a
 * stock HDRI, so every highlight on the titanium and gold is art-directed.
 * Direct light: a high warm key raking the gate, a cool fill, a rim behind the
 * opening, and a "hand light" that follows the visitor's pointer.
 */
/** Same idea for materials declared in JSX: take a share of the scene environment. */
export function useEnvShare(ref: React.RefObject<THREE.MeshStandardMaterial | null>, share: number) {
  const scene = useThree((s) => s.scene)
  useFrame(() => {
    const m = ref.current
    if (!m || !scene.environment) return
    if (m.envMap !== scene.environment) {
      m.envMap = scene.environment
      m.needsUpdate = true
    }
    m.envMapIntensity = share * (scene.environmentIntensity / 0.55)
  })
}

export type DimmedMaterial = { material: THREE.MeshStandardMaterial; share: number }

export function Lighting({ shadows, dimmed = [] }: { shadows: boolean; dimmed?: DimmedMaterial[] }) {
  const rt = useThreshold()
  const scene = useThree((s) => s.scene)
  const key = useRef<THREE.SpotLight>(null)
  const fill = useRef<THREE.SpotLight>(null)
  const rim = useRef<THREE.PointLight>(null)
  const hand = useRef<THREE.PointLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(0, 7, 0)
    return o
  }, [])
  const start = useRef<number | null>(null)

  useFrame(() => {
    if (start.current === null) start.current = performance.now()
    const p = rt.progress.current
    const st = sceneState(p)
    const k = (rt.frozenTime !== null ? 1 : arrival(performance.now())) * st.exposure
    if (key.current) key.current.intensity = 5200 * k
    if (fill.current) fill.current.intensity = 420 * k
    if (rim.current) rim.current.intensity = 120 * k * (0.6 + st.dawn * 0.6)
    if (hemi.current) hemi.current.intensity = 0.12 * k
    scene.environmentIntensity = 0.55 * k
    // Dark stone surfaces take a reduced share of the studio environment so
    // they read as polished black rather than lit beige.
    if (scene.environment) {
      for (const m of dimmed) {
        if (m.material.envMap !== scene.environment) {
          m.material.envMap = scene.environment
          m.material.needsUpdate = true
        }
        m.material.envMapIntensity = m.share * k
      }
    }
    if (hand.current) {
      // The hand light rakes across the gate's face; it stays with the gate.
      hand.current.position.set(rt.pointer.x * 6.5, 4 + rt.pointer.y * 4.5, 6.2)
      hand.current.intensity = 70 * k * (1 - Math.min(1, Math.max(0, (p - 0.5) / 0.1)))
    }
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#24395f', '#05080d', 0.35]} />
      <primitive object={target} />
      <spotLight
        ref={key}
        position={[-10, 34, 18]}
        angle={0.33}
        penumbra={0.85}
        decay={2}
        color="#ffe8c4"
        target={target}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.03}
        shadow-camera-near={10}
        shadow-camera-far={80}
      />
      <spotLight ref={fill} position={[12, 20, 16]} angle={0.42} penumbra={1} decay={2} color="#b9c6de" target={target} />
      <pointLight ref={rim} position={[0, 3.5, -12]} distance={40} decay={2} color="#f0c27a" />
      <pointLight ref={hand} position={[0, 4, 6.2]} distance={16} decay={2} color="#ffd9a0" />

      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={['#020409']} />
        {/* Overhead soft box, warm: long gold highlights on top faces. */}
        <Lightformer form="rect" intensity={1.3} color="#f2dcae" scale={[26, 5, 1]} position={[0, 26, 4]} rotation-x={Math.PI / 2} />
        {/* Large warm panel behind the viewer: satin sheen across the gold front faces. */}
        <Lightformer form="rect" intensity={1.5} color="#f0d49a" scale={[30, 14, 1]} position={[0, 12, 34]} rotation-y={Math.PI} />
        {/* Side strips: vertical streaks down the brushed frames. */}
        <Lightformer form="rect" intensity={1.1} color="#a9bde0" scale={[2.2, 26, 1]} position={[-22, 9, 8]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} color="#e8d2a2" scale={[2.2, 30, 1]} position={[22, 9, -2]} rotation-y={-Math.PI / 2} />
        {/* Low frontal band: a horizon line across front faces. */}
        <Lightformer form="rect" intensity={0.55} color="#ffffff" scale={[40, 1.2, 1]} position={[0, 2.5, 30]} rotation-y={Math.PI} />
        {/* The dawn beyond the gate, reflected on the inner faces. */}
        <Lightformer form="rect" intensity={3.2} color="#ffcf86" scale={[60, 8, 1]} position={[0, 4, -40]} />
        <Lightformer form="ring" intensity={1.4} color="#e7d2a0" scale={6} position={[0, 18, 22]} rotation-y={Math.PI} />
      </Environment>
    </>
  )
}
