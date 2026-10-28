import { useMemo, useEffect } from 'react'
import { createMaterials } from './materials'
import { Gateway } from './Gateway'
import { Pavilion } from './Pavilion'
import { Atmosphere } from './Atmosphere'
import { Network } from './Network'
import { Lighting } from './Lighting'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { useThreshold } from './context'

export function ThresholdScene({ effects = true }: { effects?: boolean }) {
  const rt = useThreshold()
  const materials = useMemo(() => createMaterials(), [])
  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose())
    },
    [materials],
  )
  const full = rt.tier === 'full'
  return (
    <>
      <color attach="background" args={['#08111f']} />
      <fogExp2 attach="fog" args={['#08111f', 0.021]} />
      <CameraRig />
      <Lighting
        shadows={full}
        dimmed={[
          { material: materials.finStone, share: 0.1 },
          { material: materials.wall, share: 0.12 },
          { material: materials.blackStone, share: 0.45 },
        ]}
      />
      <Pavilion materials={materials} />
      <Gateway materials={materials} shadows={full} />
      <Atmosphere dust={full} />
      <Network />
      {full && effects && <Effects />}
    </>
  )
}
