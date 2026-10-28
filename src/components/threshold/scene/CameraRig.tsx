import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useThreshold } from './context'
import { HORIZON } from './Pavilion'
import { CAMERA_KEYS, cameraSegment, fovForAspect, sceneState } from '../choreography'

/**
 * Scroll-driven camera. Reads the damped progress shared with the DOM overlays
 * and follows a centripetal Catmull-Rom path through the keyframes. The pointer
 * adds a restrained parallax lean.
 */
export function CameraRig() {
  const rt = useThreshold()
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const scene = useThree((s) => s.scene)

  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos)), false, 'centripetal'),
      look: new THREE.CatmullRomCurve3(CAMERA_KEYS.map((k) => new THREE.Vector3(...k.look)), false, 'centripetal'),
      tmpPos: new THREE.Vector3(),
      tmpLook: new THREE.Vector3(),
      lean: new THREE.Vector2(),
      fogColor: new THREE.Color('#08111f'),
      fogNear: new THREE.Color('#08111f'),
      fogFar: HORIZON.clone().multiplyScalar(0.62),
    }),
    [],
  )

  useFrame((state, dt) => {
    const pr = rt.progress
    const studio = rt.frozenTime !== null
    // The DOM ticker (Threshold.tsx) owns damping so overlays and camera share one value.
    if (studio) pr.current = pr.target

    const [seg, t] = cameraSegment(pr.current)
    const u = (seg + t) / (CAMERA_KEYS.length - 1)
    curves.pos.getPoint(u, curves.tmpPos)
    curves.look.getPoint(u, curves.tmpLook)

    if (!studio) {
      curves.lean.x = THREE.MathUtils.damp(curves.lean.x, rt.pointer.x, 2.2, dt)
      curves.lean.y = THREE.MathUtils.damp(curves.lean.y, rt.pointer.y, 2.2, dt)
      const breathe = Math.sin(state.clock.elapsedTime * 0.35) * 0.04
      curves.tmpPos.x += curves.lean.x * 0.55
      curves.tmpPos.y += curves.lean.y * 0.3 + breathe
      curves.tmpLook.x += curves.lean.x * 0.25
    }
    camera.position.copy(curves.tmpPos)
    camera.lookAt(curves.tmpLook)

    const fov = fovForAspect(state.size.width / state.size.height)
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    const st = sceneState(pr.current)
    const fog = scene.fog as THREE.FogExp2 | null
    if (fog) {
      fog.density = st.fogDensity
      fog.color.copy(curves.fogNear).lerp(curves.fogFar, st.outside * st.dawn)
    }
  })

  return null
}
