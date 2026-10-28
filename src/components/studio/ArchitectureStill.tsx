import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping, Vignette, N8AO } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

/**
 * Architecture stills for the fictional ATELIER NORTH concept. Procedural,
 * real-time renders composed like architectural photography: low camera,
 * corrected verticals (no camera roll, minimal pitch), blue-hour skies, warm
 * interiors. Rendered once through /studio and shipped as images; this module
 * never loads on the public site.
 */

// ───────────────────────── Textures ─────────────────────────

function rand(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, color = true) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  t.anisotropy = 8
  return t
}

/** Board-formed concrete: 4 boards per tile, per-board tone, speckle, tie holes. Tile = 1.2 m. */
function concreteTexture(tone = 178, formwork = true) {
  const r = rand(5)
  return canvasTexture(512, 512, (g) => {
    for (let b = 0; b < 4; b++) {
      const v = tone + (r() - 0.5) * (formwork ? 14 : 4)
      g.fillStyle = `rgb(${v},${v - 2},${v - 6})`
      g.fillRect(0, b * 128, 512, 128)
      if (formwork) {
        g.fillStyle = 'rgba(0,0,0,0.08)'
        g.fillRect(0, b * 128, 512, 2)
      }
    }
    for (let i = 0; i < 9000; i++) {
      const a = r() * 0.08
      g.fillStyle = r() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`
      g.fillRect(r() * 512, r() * 512, 1 + r() * 2, 1 + r() * 2)
    }
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(60,55,50,${0.04 + r() * 0.06})`
      g.fillRect(r() * 512, r() * 512, 4 + r() * 40, 120 + r() * 200)
    }
    g.fillStyle = 'rgba(40,38,36,0.55)'
    if (formwork) for (const x of [128, 384]) for (const y of [64, 320]) {
      g.beginPath()
      g.arc(x, y, 3.2, 0, Math.PI * 2)
      g.fill()
    }
  })
}

/** Vertical timber battens, warm and slightly irregular. Tile = 1.2 m. */
function timberTexture(dark = false) {
  const r = rand(17)
  return canvasTexture(512, 512, (g) => {
    const base = dark ? [74, 52, 38] : [146, 102, 66]
    const n = 12
    for (let i = 0; i < n; i++) {
      const k = 0.85 + r() * 0.3
      g.fillStyle = `rgb(${base[0] * k},${base[1] * k},${base[2] * k})`
      g.fillRect((i * 512) / n, 0, 512 / n - 6, 512)
      g.fillStyle = 'rgba(15,10,6,0.85)'
      g.fillRect(((i + 1) * 512) / n - 6, 0, 6, 512)
      for (let s = 0; s < 18; s++) {
        g.fillStyle = `rgba(${r() > 0.5 ? '255,220,180' : '40,25,15'},${0.05 + r() * 0.06})`
        g.fillRect((i * 512) / n + r() * (512 / n - 8), 0, 1 + r() * 2, 512)
      }
    }
  })
}

/** Warm interior seen through glazing: lit volume, a few furniture silhouettes, a lamp. */
function interiorTexture(seed: number, warmth = 1) {
  const r = rand(seed)
  return canvasTexture(1024, 512, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 512)
    grad.addColorStop(0, `rgb(${120 * warmth},${82 * warmth},${48 * warmth})`)
    grad.addColorStop(0.55, `rgb(${236},${180},${112})`)
    grad.addColorStop(1, `rgb(${150},${100},${60})`)
    g.fillStyle = grad
    g.fillRect(0, 0, 1024, 512)
    // pools of light
    for (let i = 0; i < 4; i++) {
      const x = 100 + r() * 824
      const rg = g.createRadialGradient(x, 120, 5, x, 200, 260)
      rg.addColorStop(0, 'rgba(255,236,200,0.9)')
      rg.addColorStop(1, 'rgba(255,220,170,0)')
      g.fillStyle = rg
      g.fillRect(0, 0, 1024, 512)
    }
    // furniture silhouettes
    g.fillStyle = 'rgba(40,26,16,0.85)'
    for (let i = 0; i < 4; i++) {
      const x = r() * 900
      const w = 120 + r() * 200
      const h = 60 + r() * 70
      g.fillRect(x, 512 - 70 - h, w, h)
    }
    for (let i = 0; i < 3; i++) {
      const x = r() * 980
      g.fillRect(x, 140, 4, 300)
      g.beginPath()
      g.ellipse(x + 2, 140, 26, 12, 0, 0, Math.PI * 2)
      g.fill()
    }
    // floor line
    g.fillStyle = 'rgba(70,45,28,0.9)'
    g.fillRect(0, 512 - 70, 1024, 70)
  })
}

// ───────────────────────── Primitives ─────────────────────────

type MatKind = 'concrete' | 'concreteDark' | 'timber' | 'timberDark' | 'stone' | 'black' | 'bronze' | 'plaster'

function useMaterials() {
  return useMemo(() => {
    const concrete = concreteTexture(182)
    const concreteDark = concreteTexture(120)
    const timber = timberTexture()
    const timberDark = timberTexture(true)
    const stone = concreteTexture(160, false)
    const mk = (map: THREE.Texture | null, color: string, roughness: number, metalness = 0) =>
      new THREE.MeshStandardMaterial({ map, color, roughness, metalness })
    return {
      textures: { concrete, concreteDark, timber, timberDark, stone },
      base: {
        concrete: mk(concrete, '#ffffff', 0.86),
        concreteDark: mk(concreteDark, '#ffffff', 0.9),
        timber: mk(timber, '#ffffff', 0.72),
        timberDark: mk(timberDark, '#ffffff', 0.75),
        stone: mk(stone, '#d2c8ba', 0.92),
        black: mk(null, '#141414', 0.55, 0.2),
        bronze: mk(null, '#6b5132', 0.35, 0.9),
        plaster: mk(null, '#cdc6ba', 0.96),
      } satisfies Record<MatKind, THREE.MeshStandardMaterial>,
      glass: new THREE.MeshPhysicalMaterial({ color: '#0c1218', metalness: 0.15, roughness: 0.03, reflectivity: 1, clearcoat: 1, transparent: true, opacity: 0.55, envMapIntensity: 1.6 }),
    }
  }, [])
}

/** Box whose texture repeats per world metre, so every surface shares one scale. */
function Block({ size, position, mat, mats, cast = true, rotation }: { size: [number, number, number]; position: [number, number, number]; mat: MatKind; mats: ReturnType<typeof useMaterials>; cast?: boolean; rotation?: [number, number, number] }) {
  const material = useMemo(() => {
    const base = mats.base[mat]
    if (!base.map) return base
    const m = base.clone()
    const t = base.map.clone()
    t.needsUpdate = true
    // Slabs (thin in Y) map their texture across the plan; walls map across their face.
    if (size[1] < Math.min(size[0], size[2])) t.repeat.set(size[0] / 1.2, size[2] / 1.2)
    else t.repeat.set(Math.max(size[0], size[2]) / 1.2, size[1] / 1.2)
    m.map = t
    return m
  }, [mat, mats, size])
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={cast} receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  )
}

/** Glazing with a lit interior plane set just behind it. */
function Glazing({ size, position, rotationY = 0, seed = 1, mats, glow = 1 }: { size: [number, number]; position: [number, number, number]; rotationY?: number; seed?: number; mats: ReturnType<typeof useMaterials>; glow?: number }) {
  const interior = useMemo(() => {
    const t = interiorTexture(seed)
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    return new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(glow, glow, glow), toneMapped: true })
  }, [seed, glow])
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, -0.6]} material={interior}>
        <planeGeometry args={size} />
      </mesh>
      <mesh material={mats.glass}>
        <planeGeometry args={size} />
      </mesh>
      {/* mullions */}
      {Array.from({ length: Math.max(1, Math.round(size[0] / 2.4)) - 1 }, (_, i) => {
        const n = Math.max(1, Math.round(size[0] / 2.4))
        return (
          <mesh key={i} position={[-size[0] / 2 + ((i + 1) * size[0]) / n, 0, 0.02]} material={mats.base.black}>
            <boxGeometry args={[0.06, size[1], 0.08]} />
          </mesh>
        )
      })}
    </group>
  )
}

// ───────────────────────── Environment ─────────────────────────

type Sky = { top: string; mid: string; horizon: string; sun: [number, number, number]; sunColor: string; glow: number }

function SkyDome({ sky }: { sky: Sky }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color(sky.top) },
          uMid: { value: new THREE.Color(sky.mid) },
          uHorizon: { value: new THREE.Color(sky.horizon) },
          uSun: { value: new THREE.Vector3(...sky.sun).normalize() },
          uSunColor: { value: new THREE.Color(sky.sunColor) },
          uGlow: { value: sky.glow },
        },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform vec3 uTop, uMid, uHorizon, uSun, uSunColor; uniform float uGlow; varying vec3 vDir;
          void main(){
            float e = max(vDir.y, 0.0);
            vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.18, e));
            col = mix(col, uTop, smoothstep(0.15, 0.7, e));
            float s = max(dot(normalize(vDir), uSun), 0.0);
            col += uSunColor * (pow(s, 8.0) * 0.35 + pow(s, 120.0) * 2.0) * uGlow * (1.0 - smoothstep(0.0, 0.5, e));
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [sky],
  )
  return (
    <mesh material={mat} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[900, 48, 24]} />
    </mesh>
  )
}

/** Distant ridgelines: layered silhouettes that pick up fog for aerial perspective. */
function Ridges({ layers, color = '#1a2433' }: { layers: { z: number; height: number; seed: number; x?: number; width?: number }[]; color?: string }) {
  const geos = useMemo(
    () =>
      layers.map((l) => {
        const r = rand(l.seed)
        const w = l.width ?? 900
        const shape = new THREE.Shape()
        shape.moveTo(-w / 2, -5)
        const n = 60
        let h = l.height * 0.5
        for (let i = 0; i <= n; i++) {
          h = Math.max(l.height * 0.15, Math.min(l.height, h + (r() - 0.5) * l.height * 0.35))
          shape.lineTo(-w / 2 + (i / n) * w, h)
        }
        shape.lineTo(w / 2, -5)
        return new THREE.ShapeGeometry(shape)
      }),
    [layers],
  )
  return (
    <>
      {layers.map((l, i) => (
        <mesh key={i} geometry={geos[i]} position={[l.x ?? 0, 0, l.z]}>
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </>
  )
}

function Water({ size = 400, position = [0, 0, 0] as [number, number, number], color = '#4a5866' }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={position} receiveShadow>
      <planeGeometry args={[size, size]} />
      <MeshReflectorMaterial resolution={1024} mirror={0.92} mixStrength={6} blur={[60, 20]} mixBlur={0.4} color={color} roughness={0.2} metalness={0.3} depthScale={0} />
    </mesh>
  )
}

/** Ground with fine tonal variation (meadow, gravel) so it never reads as a flat CG plane. */
function Ground({ color, size = 600, position = [0, 0, 0] as [number, number, number], roughness = 1, grain = 0.22 }: { color: string; size?: number; position?: [number, number, number]; roughness?: number; grain?: number }) {
  const map = useMemo(() => {
    const r = rand(77)
    const t = canvasTexture(512, 512, (g) => {
      g.fillStyle = '#808080'
      g.fillRect(0, 0, 512, 512)
      for (let i = 0; i < 26000; i++) {
        const v = 128 + (r() - 0.5) * 255 * grain * 2
        g.fillStyle = `rgba(${v},${v},${v},0.5)`
        g.fillRect(r() * 512, r() * 512, 1 + r() * 3, 1 + r() * 3)
      }
      for (let i = 0; i < 60; i++) {
        const v = 128 + (r() - 0.5) * 70
        g.fillStyle = `rgba(${v},${v},${v},0.12)`
        g.beginPath()
        g.ellipse(r() * 512, r() * 512, 20 + r() * 80, 10 + r() * 40, r() * 3, 0, Math.PI * 2)
        g.fill()
      }
    }, false)
    t.colorSpace = THREE.SRGBColorSpace
    t.repeat.set(size / 6, size / 6)
    return t
  }, [size, grain])
  return (
    <mesh rotation-x={-Math.PI / 2} position={position} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={roughness} map={map} />
    </mesh>
  )
}

function Sun({ position, color, intensity, target = [0, 0, 0] as [number, number, number], size = 30 }: { position: [number, number, number]; color: string; intensity: number; target?: [number, number, number]; size?: number }) {
  const light = useRef<THREE.DirectionalLight>(null)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    if (!light.current) return
    light.current.target.position.set(...target)
    scene.add(light.current.target)
  }, [scene, target])
  return (
    <directionalLight
      ref={light}
      position={position}
      color={color}
      intensity={intensity}
      castShadow
      shadow-mapSize={[4096, 4096]}
      shadow-bias={-0.0003}
      shadow-normalBias={0.04}
      shadow-camera-left={-size}
      shadow-camera-right={size}
      shadow-camera-top={size}
      shadow-camera-bottom={-size}
      shadow-camera-near={1}
      shadow-camera-far={300}
    />
  )
}

function SkyLight({ sky, intensity = 1 }: { sky: Sky; intensity?: number }) {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <color attach="background" args={[sky.mid]} />
      <Lightformer form="rect" intensity={1.2 * intensity} color={sky.top} scale={[200, 200, 1]} position={[0, 80, 0]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.6 * intensity} color={sky.horizon} scale={[300, 30, 1]} position={[0, 8, -120]} />
      <Lightformer form="rect" intensity={0.8 * intensity} color={sky.mid} scale={[300, 30, 1]} position={[0, 8, 120]} rotation-y={Math.PI} />
      <Lightformer form="circle" intensity={4 * intensity} color={sky.sunColor} scale={20} position={sky.sun.map((v) => v * 4) as [number, number, number]} />
    </Environment>
  )
}

// ───────────────────────── Shots ─────────────────────────

type ShotDef = {
  camera: { position: [number, number, number]; target: [number, number, number]; fov: number }
  fog: [string, number]
  exposure: number
  content: (m: ReturnType<typeof useMaterials>) => ReactNode
}

const BLUE_HOUR: Sky = { top: '#0c1a33', mid: '#2c4467', horizon: '#c99a6b', sun: [-0.6, 0.04, -1], sunColor: '#ffb070', glow: 1 }
const DUSK_WARM: Sky = { top: '#1a2340', mid: '#5a5f7a', horizon: '#e7a66a', sun: [0.7, 0.08, -1], sunColor: '#ffbf7a', glow: 1.3 }
const INTERIOR_DUSK: Sky = { top: '#1a2340', mid: '#5a5f7a', horizon: '#e7a66a', sun: [1, 0.05, -0.35], sunColor: '#ffbf7a', glow: 1 }
const GOLDEN: Sky = { top: '#3b5b86', mid: '#9db1c6', horizon: '#f0c896', sun: [-1, 0.16, -0.4], sunColor: '#ffd29a', glow: 1.2 }

function MorrowPavilion({ m, sky, sun, sunIntensity, glow, skyIntensity, ground, hemi }: { m: ReturnType<typeof useMaterials>; sky: Sky; sun: [number, number, number]; sunIntensity: number; glow: number; skyIntensity: number; ground: string; hemi: [string, string, number] }) {
  return (
    <>
      <SkyDome sky={sky} />
      <SkyLight sky={sky} intensity={skyIntensity} />
      <Sun position={sun} color="#ffcf92" intensity={sunIntensity} target={[0, 0, 0]} size={35} />
      <hemisphereLight args={hemi} />
      <Ground color={ground} size={600} grain={0.3} />
      <Block mats={m} mat="concrete" size={[22, 0.4, 13]} position={[0, 0.2, 0]} />
      <Block mats={m} mat="timber" size={[26, 0.55, 17]} position={[0, 3.9, 0]} />
      <Block mats={m} mat="black" size={[26.1, 0.12, 17.1]} position={[0, 3.6, 0]} />
      {[-10, -5, 0, 5, 10].flatMap((x) => [-7.6, 7.6].map((z) => <Block key={`${x}${z}`} mats={m} mat="black" size={[0.16, 3.2, 0.16]} position={[x, 2, z]} />))}
      <Glazing mats={m} size={[18, 3.2]} position={[0, 2, 5.4]} seed={21} glow={glow} />
      <Glazing mats={m} size={[9, 3.2]} position={[-9.1, 2, 1]} rotationY={-Math.PI / 2} seed={23} glow={glow * 0.95} />
      <Glazing mats={m} size={[9, 3.2]} position={[9.1, 2, 1]} rotationY={Math.PI / 2} seed={25} glow={glow * 0.95} />
      <Block mats={m} mat="timberDark" size={[4, 3.2, 3]} position={[4, 2, -2]} />
      <Ridges color="#6b7766" layers={[{ z: -180, height: 18, seed: 5 }, { z: -300, height: 40, seed: 14 }, { z: -460, height: 70, seed: 33 }]} />
    </>
  )
}

const SHOTS: Record<string, ShotDef> = {
  /** Halden House — cantilevered concrete over a still lake at blue hour. */
  halden: {
    camera: { position: [-26, 1.6, 30], target: [2, 4.2, 0], fov: 34 },
    fog: ['#3a4a60', 0.006],
    exposure: 1.05,
    content: (m) => (
      <>
        <SkyDome sky={BLUE_HOUR} />
        <SkyLight sky={BLUE_HOUR} intensity={0.55} />
        <Sun position={[-60, 6, -80]} color="#ffb27a" intensity={0.7} size={40} />
        <hemisphereLight args={['#5a6f92', '#1a1f26', 0.6]} />
        <Water position={[0, 0, 10]} color="#3d4a58" />
        <Ground color="#1f2722" size={300} position={[0, 0.25, -150]} />
        {/* bank */}
        <Block mats={m} mat="stone" size={[70, 1.4, 22]} position={[0, 0.3, -12]} />
        {/* lower volume, set into the bank */}
        <Block mats={m} mat="concrete" size={[16, 3.4, 9]} position={[-4, 2.4, -9]} />
        <Glazing mats={m} size={[11, 2.4]} position={[-4.5, 2.3, -4.48]} seed={3} glow={1.1} />
        {/* upper cantilever, reaching over the water */}
        <Block mats={m} mat="concrete" size={[24, 0.6, 9.6]} position={[4, 4.4, -6]} />
        <Block mats={m} mat="concrete" size={[24, 0.7, 9.6]} position={[4, 7.85, -6]} />
        <Block mats={m} mat="concrete" size={[0.5, 3.1, 9.6]} position={[15.75, 6.15, -6]} />
        <Glazing mats={m} size={[21.5, 2.9]} position={[3.6, 6.15, -1.3]} seed={7} glow={1.25} />
        <Block mats={m} mat="timberDark" size={[3, 3.1, 0.2]} position={[-6.2, 6.15, -1.25]} />
        {/* terrace + steps */}
        <Block mats={m} mat="timber" size={[8, 0.25, 4]} position={[-12, 1.15, -1]} />
        <Block mats={m} mat="black" size={[0.05, 1, 4]} position={[-16, 1.8, -1]} />
        <Ridges color="#18222e" layers={[{ z: -170, height: 26, seed: 3 }, { z: -260, height: 48, seed: 9 }, { z: -380, height: 70, seed: 21 }]} />
      </>
    ),
  },
  /** Kestrel Gallery — a long stone gallery, slot window, raking dusk light, reflecting pool. */
  kestrel: {
    camera: { position: [27, 1.4, 36], target: [-5, 3.6, 0], fov: 32 },
    fog: ['#6f6a73', 0.004],
    exposure: 1.0,
    content: (m) => (
      <>
        <SkyDome sky={DUSK_WARM} />
        <SkyLight sky={DUSK_WARM} intensity={0.7} />
        <Sun position={[60, 9, 34]} color="#ffb46e" intensity={2.6} target={[0, 2, 0]} size={50} />
        <hemisphereLight args={['#7d84a3', '#2a2622', 0.45]} />
        <Ground color="#4b443b" size={500} />
        <Water size={60} position={[2, 0.06, 13]} color="#4a4e5a" />
        <Block mats={m} mat="stone" size={[62, 0.5, 8]} position={[0, 0.25, 13]} cast={false} />
        <Block mats={m} mat="stone" size={[40, 6.2, 12]} position={[-4, 3.1, -4]} />
        <Block mats={m} mat="stone" size={[14, 9, 12]} position={[-28, 4.5, -4]} />
        <Glazing mats={m} size={[30, 0.9]} position={[-1, 4.2, 2.02]} seed={11} glow={1.4} />
        <Glazing mats={m} size={[5, 4.2]} position={[13, 2.1, 2.02]} seed={13} glow={1.2} />
        <Block mats={m} mat="bronze" size={[6, 0.25, 1.6]} position={[13, 4.45, 2.6]} />
        <Block mats={m} mat="stone" size={[1, 3.5, 1]} position={[-24, 1.75, 6]} />
        <Ridges color="#3a3644" layers={[{ z: -220, height: 30, seed: 4 }, { z: -360, height: 60, seed: 12 }]} />
      </>
    ),
  },
  /** Morrow Pavilion — timber roof plane on slender columns, glazed, in a meadow at golden hour. */
  morrow: {
    camera: { position: [-18, 1.7, 22], target: [1, 2.4, 0], fov: 38 },
    fog: ['#b7b3a8', 0.006],
    exposure: 1.0,
    content: (m) => <MorrowPavilion m={m} sky={GOLDEN} sun={[-80, 14, -30]} sunIntensity={3.2} glow={0.85} skyIntensity={0.9} ground="#9aa274" hemi={['#a9bdd6', '#3d4630', 0.55]} />,
  },
  /** Morrow Pavilion at blue hour — the same building, lit from within. */
  nocturne: {
    camera: { position: [14, 1.3, 19], target: [-2, 2.3, 0], fov: 40 },
    fog: ['#2c3a52', 0.008],
    exposure: 1.1,
    content: (m) => <MorrowPavilion m={m} sky={BLUE_HOUR} sun={[-70, 4, -60]} sunIntensity={0.5} glow={1.35} skyIntensity={0.6} ground="#3b4434" hemi={['#5a6f92', '#141a1f', 0.6]} />,
  },
  /** Interior — concrete living space opening to a dusk landscape. */
  interior: {
    camera: { position: [-5.5, 1.35, 7.5], target: [1.5, 1.6, -4], fov: 46 },
    fog: ['#2f3b52', 0.004],
    exposure: 1.1,
    content: (m) => (
      <>
        <SkyDome sky={INTERIOR_DUSK} />
        <SkyLight sky={INTERIOR_DUSK} intensity={0.35} />
        <Sun position={[60, 9, -22]} color="#ffb06a" intensity={2.8} target={[0, 0, 0]} size={20} />
        <hemisphereLight args={['#6b6f8a', '#2a211a', 0.25]} />
        <pointLight position={[-2, 1.7, 2]} intensity={6} distance={8} color="#ffc98a" decay={2} />
        <pointLight position={[3, 0.6, -1]} intensity={4} distance={5} color="#ffbf80" decay={2} />
        <Ground color="#3c3f35" size={400} position={[0, -0.6, 0]} />
        {/* floor, ceiling, walls */}
        <Block mats={m} mat="timber" size={[16, 0.2, 14]} position={[0, -0.1, 0]} />
        <Block mats={m} mat="plaster" size={[16, 0.4, 14]} position={[0, 3.4, 0]} />
        <Block mats={m} mat="concrete" size={[0.4, 3.6, 14]} position={[-8, 1.6, 0]} />
        <Block mats={m} mat="concrete" size={[5, 3.6, 0.4]} position={[-5.5, 1.6, -7]} />
        {/* the opening: full-height glazing with a slim frame */}
        <Block mats={m} mat="black" size={[11, 0.12, 0.2]} position={[2.5, 3.14, -7]} />
        <Block mats={m} mat="black" size={[0.1, 3.2, 0.2]} position={[-3, 1.6, -7]} />
        <Block mats={m} mat="black" size={[0.1, 3.2, 0.2]} position={[2.5, 1.6, -7]} />
        {/* furniture */}
        <Block mats={m} mat="stone" size={[4.2, 0.42, 1.1]} position={[0.5, 0.21, -2.5]} />
        <Block mats={m} mat="timberDark" size={[2.4, 0.72, 1]} position={[-3.6, 0.36, 1.2]} />
        <Block mats={m} mat="bronze" size={[0.04, 1.6, 0.04]} position={[-6.8, 0.8, -5.6]} />
        <Block mats={m} mat="concreteDark" size={[3, 0.5, 0.9]} position={[-6.2, 0.25, -1]} />
        <Ridges color="#2a2c3c" layers={[{ z: -120, height: 20, seed: 6 }, { z: -240, height: 45, seed: 16 }]} />
        <Water size={200} position={[0, -0.55, -80]} color="#4a4d58" />
      </>
    ),
  },
}

function ShotScene({ shot, onDone }: { shot: ShotDef; onDone: () => void }) {
  const mats = useMaterials()
  const { camera, gl, scene } = useThree()
  const frames = useRef(0)
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.position.set(...shot.camera.position)
    cam.fov = shot.camera.fov
    // Architectural photography: verticals stay vertical (no roll), target sets heading.
    cam.lookAt(...shot.camera.target)
    cam.updateProjectionMatrix()
    gl.toneMappingExposure = shot.exposure
    scene.fog = new THREE.FogExp2(shot.fog[0], shot.fog[1])
  }, [camera, gl, scene, shot])
  useFrame(() => {
    if (++frames.current === 3) onDone()
  })
  return (
    <>
      {shot.content(mats)}
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <N8AO aoRadius={1.2} intensity={2.2} distanceFalloff={0.6} quality="high" />
        <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.95} radius={0.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.32} darkness={0.55} />
      </EffectComposer>
    </>
  )
}

export default function ArchitectureStill({ shot, onDone }: { shot: string; onDone: () => void }) {
  const def = SHOTS[shot] ?? SHOTS.halden
  return (
    <Canvas shadows="soft" dpr={1} gl={{ preserveDrawingBuffer: true, antialias: false }} camera={{ near: 0.1, far: 2000 }} onCreated={({ gl }) => (gl.toneMapping = THREE.NoToneMapping)}>
      <ShotScene shot={def} onDone={onDone} />
    </Canvas>
  )
}
