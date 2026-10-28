import * as THREE from 'three'
import { brushedMetal, stone, floorSlabs, horizonFade } from './textures'

/**
 * Physically based material set for the Threshold. Values chosen to read as
 * real finishes under the environment lighting: brushed dark titanium with
 * anisotropic streaks, satin champagne gold, honed and polished black stone.
 */
export function createMaterials() {
  const brushedV = brushedMetal([1, 5])
  brushedV.rotation = Math.PI / 2
  const brushedH = brushedMetal([4, 1])
  const stoneMap = stone([2, 12], 3)
  const finMap = stone([1, 6], 9)

  const titanium = new THREE.MeshPhysicalMaterial({
    color: '#5f5d5a',
    metalness: 1,
    roughness: 0.34,
    roughnessMap: brushedV,
    anisotropy: 0.75,
    anisotropyRotation: Math.PI / 2,
    envMapIntensity: 1,
  })
  const gold = new THREE.MeshPhysicalMaterial({
    color: '#d4b064',
    metalness: 1,
    roughness: 0.26,
    roughnessMap: brushedV,
    anisotropy: 0.55,
    anisotropyRotation: Math.PI / 2,
    envMapIntensity: 1,
  })
  const goldLintel = gold.clone()
  goldLintel.roughnessMap = brushedH
  goldLintel.anisotropyRotation = 0

  const blackStone = new THREE.MeshStandardMaterial({
    color: '#14171d',
    roughness: 0.58,
    roughnessMap: stoneMap,
    bumpMap: stoneMap,
    bumpScale: 0.05,
    metalness: 0,
  })
  const finStone = new THREE.MeshStandardMaterial({
    color: '#080b11',
    roughness: 0.82,
    roughnessMap: finMap,
    metalness: 0,
  })
  const deck = new THREE.MeshStandardMaterial({
    color: '#12161d',
    roughness: 0.22,
    roughnessMap: stone([1, 14], 21),
    metalness: 0.1,
  })

  const wall = new THREE.MeshStandardMaterial({
    color: '#0b111c',
    roughness: 0.78,
    roughnessMap: stone([14, 10], 31),
    metalness: 0,
  })

  return { wall, titanium, gold, goldLintel, blackStone, finStone, deck, floorRoughness: floorSlabs([68, 68]), floorFade: horizonFade(0.07, 0.19) }
}

export type Materials = ReturnType<typeof createMaterials>
