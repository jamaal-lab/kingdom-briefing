import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { createLightPathMaterial } from './LightPathMaterial'
import { useThreshold, sceneTime } from './context'
import { sceneState, JOURNEY_STAGES } from '../choreography'

/**
 * Sequence D — Intelligence. Beyond the gate, an art-directed constellation:
 * six primary stages of a customer journey joined by bright arcs, with a
 * quieter field of supporting signals. It draws itself in with scroll, then a
 * single packet of light travels the journey end to end.
 */

const PRIMARY: [number, number, number][] = [
  [-14, 2.6, -52],
  [-8.5, 4.8, -58],
  [-2.5, 3.2, -64],
  [3.5, 5.4, -60],
  [9.5, 3.6, -66],
  [15, 5, -58],
]

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
}

function arc(a: THREE.Vector3, b: THREE.Vector3, lift: number) {
  const mid = a.clone().add(b).multiplyScalar(0.5)
  mid.y += lift
  return new THREE.QuadraticBezierCurve3(a, mid, b)
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,240,210,1)')
  grad.addColorStop(0.18, 'rgba(240,205,130,0.55)')
  grad.addColorStop(0.5, 'rgba(201,162,39,0.12)')
  grad.addColorStop(1, 'rgba(201,162,39,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function Network() {
  const rt = useThreshold()
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const packet = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Object3D | null)[]>([])

  const data = useMemo(() => {
    const r = rng(42)
    const primary = PRIMARY.map((p) => new THREE.Vector3(...p))
    const primaryArcs = primary.slice(0, -1).map((a, i) => arc(a, primary[i + 1], 2.2 + (i % 2) * 1.2))
    const journey = new THREE.CurvePath<THREE.Vector3>()
    primaryArcs.forEach((c) => journey.add(c))

    const secondary: THREE.Vector3[] = []
    const secondaryArcs: { curve: THREE.QuadraticBezierCurve3; order: number }[] = []
    primary.forEach((p, i) => {
      const n = 7
      for (let k = 0; k < n; k++) {
        const ang = r() * Math.PI * 2
        const rad = 2.5 + r() * 5
        const s = new THREE.Vector3(p.x + Math.cos(ang) * rad, Math.max(0.8, p.y + (r() - 0.45) * 5), p.z + Math.sin(ang) * rad)
        secondary.push(s)
        secondaryArcs.push({ curve: arc(s, p, 0.6 + r() * 1.6), order: i + r() * 0.8 })
      }
    })
    // A few lateral links between neighbouring signals.
    for (let i = 0; i < secondary.length - 7; i += 3) {
      secondaryArcs.push({ curve: arc(secondary[i], secondary[i + 7], 1 + r() * 2), order: Math.floor(i / 7) + 0.5 })
    }

    const primaryEdges = primaryArcs.map((curve, i) => ({
      geo: new THREE.TubeGeometry(curve, 120, 0.035, 6, false),
      mat: createLightPathMaterial({ intensity: 6, speed: 0.22, density: 1.4, offset: i * 0.2, base: 0.55, color: '#efd08a' }),
      order: i,
    }))
    const secondaryEdges = secondaryArcs.map(({ curve, order }, i) => ({
      geo: new THREE.TubeGeometry(curve, 48, 0.012, 4, false),
      mat: createLightPathMaterial({ intensity: 2.6, speed: 0.3, density: 1, offset: (i * 0.137) % 1, base: 0.32, color: '#9fb4dc' }),
      order,
    }))

    const glow = glowTexture()
    const secGeo = new THREE.SphereGeometry(0.06, 10, 8)
    const secMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.8, 2.4), toneMapped: false, transparent: true, opacity: 0 })
    const primGeo = new THREE.SphereGeometry(0.17, 24, 16)
    const primMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 4.8, 2.6), toneMapped: false })
    const haloMat = new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })

    return { primary, secondary, journey, primaryEdges, secondaryEdges, glow, secGeo, secMat, primGeo, primMat, haloMat }
  }, [])

  const secInstances = useRef<THREE.InstancedMesh>(null)
  useEffect(() => {
    const mesh = secInstances.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    data.secondary.forEach((p, i) => mesh.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)))
    mesh.instanceMatrix.needsUpdate = true
  }, [data])

  useEffect(
    () => () => {
      ;[...data.primaryEdges, ...data.secondaryEdges].forEach((e) => {
        e.geo.dispose()
        e.mat.dispose()
      })
      data.glow.dispose()
      data.secGeo.dispose()
      data.secMat.dispose()
      data.primGeo.dispose()
      data.primMat.dispose()
      data.haloMat.dispose()
    },
    [data],
  )

  useFrame((state) => {
    const t = sceneTime(rt, state.clock.elapsedTime)
    const { network: n, resolve } = sceneState(rt.progress.current)
    const clamp = (v: number) => Math.min(1.04, Math.max(0, v))

    data.primaryEdges.forEach((e) => {
      e.mat.uniforms.uTime.value = t
      e.mat.uniforms.uReveal.value = clamp((n - e.order * 0.12) / 0.32)
    })
    data.secondaryEdges.forEach((e) => {
      e.mat.uniforms.uTime.value = t
      e.mat.uniforms.uReveal.value = clamp((n - 0.2 - e.order * 0.09) / 0.3)
    })
    data.secMat.opacity = Math.min(1, Math.max(0, (n - 0.25) / 0.4))
    data.haloMat.opacity = Math.min(1, n * 1.5) * (0.7 + resolve * 0.3)

    data.primary.forEach((_, i) => {
      const lit = Math.min(1, Math.max(0, (n - i * 0.12 + 0.05) / 0.12))
      const node = nodeRefs.current[i]
      if (node) node.scale.setScalar(0.001 + lit * (1 + Math.sin(t * 1.6 + i) * 0.06))
      const label = labelRefs.current[i]
      if (label) {
        label.style.opacity = String(lit)
        label.style.transform = `translate3d(0, ${(1 - lit) * 6}px, 0)`
      }
    })

    if (packet.current) {
      const visible = n > 0.95 ? 1 : 0
      packet.current.visible = visible > 0
      const u = (t * 0.075) % 1
      packet.current.position.copy(data.journey.getPointAt(u))
    }
  })

  return (
    <group>
      {data.primaryEdges.map((e, i) => (
        <mesh key={`p${i}`} geometry={e.geo} material={e.mat} />
      ))}
      {data.secondaryEdges.map((e, i) => (
        <mesh key={`s${i}`} geometry={e.geo} material={e.mat} />
      ))}
      <instancedMesh ref={secInstances} args={[data.secGeo, data.secMat, data.secondary.length]} />

      {data.primary.map((p, i) => (
        <group key={i} position={p} ref={(el) => void (nodeRefs.current[i] = el)}>
          <mesh geometry={data.primGeo} material={data.primMat} />
          <sprite material={data.haloMat} scale={[2.6, 2.6, 1]} />
          <Html center position={[0, 0.9, 0]} zIndexRange={[2, 0]} style={{ pointerEvents: 'none' }}>
            <div
              ref={(el) => void (labelRefs.current[i] = el)}
              aria-hidden="true"
              style={{ opacity: 0 }}
              className="hidden whitespace-nowrap font-mono text-[10px] tracking-[0.18em] uppercase text-champagne/90 min-[1200px]:block"
            >
              <span className="text-gold/80">0{i + 1}</span> {JOURNEY_STAGES[i]}
            </div>
          </Html>
        </group>
      ))}

      <group ref={packet} visible={false}>
        <mesh>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshBasicMaterial color={new THREE.Color(9, 8, 6)} toneMapped={false} />
        </mesh>
        <sprite material={data.haloMat} scale={[1.6, 1.6, 1]} />
      </group>
    </group>
  )
}
