import { useSyncExternalStore } from 'react'

/**
 * Visitor-controlled motion switch for the /websites page, on top of the
 * device's reduced-motion setting. Stored per browser (a convenience only).
 * The choice is applied to <html data-motion="off"> before first paint by
 * MOTION_BOOT_SCRIPT, and CSS in app.css stills every animation under it.
 */
const KEY = 'btbs-motion'
const EVENT = 'btbs:motion'
const OS = '(prefers-reduced-motion: reduce)'

export const MOTION_BOOT_SCRIPT = `try{if(localStorage.getItem('${KEY}')==='off'||matchMedia('${OS}').matches)document.documentElement.dataset.motion='off'}catch(e){}`

function read(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (localStorage.getItem(KEY) === 'off') return true
  } catch {
    /* storage blocked: fall through to the device setting */
  }
  return window.matchMedia(OS).matches
}

function subscribe(cb: () => void) {
  const mql = window.matchMedia(OS)
  mql.addEventListener('change', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    mql.removeEventListener('change', cb)
    window.removeEventListener(EVENT, cb)
  }
}

/** True when motion should be still: the visitor switched it off, or the device asks for reduced motion. */
export function useMotionOff() {
  return useSyncExternalStore(subscribe, read, () => false)
}

export const deviceReducesMotion = () => typeof window !== 'undefined' && window.matchMedia(OS).matches

export function setMotionOff(off: boolean) {
  try {
    if (off) localStorage.setItem(KEY, 'off')
    else localStorage.removeItem(KEY)
  } catch {
    /* not persisted, still applied for this visit */
  }
  if (off) document.documentElement.dataset.motion = 'off'
  else if (!deviceReducesMotion()) delete document.documentElement.dataset.motion
  window.dispatchEvent(new Event(EVENT))
}
