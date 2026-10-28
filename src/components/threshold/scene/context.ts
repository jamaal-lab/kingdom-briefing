import { createContext, useContext } from 'react'
import type { Tier } from '~/lib/capabilities'

export type ProgressStore = { target: number; current: number }

export type ThresholdRuntime = {
  tier: Exclude<Tier, 'poster'>
  progress: ProgressStore
  /** Normalised pointer, -1..1, damped by the camera rig. */
  pointer: { x: number; y: number }
  /** Studio renders freeze time so posters are deterministic. */
  frozenTime: number | null
}

export const ThresholdContext = createContext<ThresholdRuntime | null>(null)

export function useThreshold() {
  const ctx = useContext(ThresholdContext)
  if (!ctx) throw new Error('useThreshold outside ThresholdContext')
  return ctx
}

export function sceneTime(rt: ThresholdRuntime, elapsed: number) {
  return rt.frozenTime ?? elapsed
}
