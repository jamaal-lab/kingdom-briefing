/**
 * Stand-in for the flagship home page in the /websites build (see the alias in
 * vite.config.ts). The flagship is never rendered there; aliasing it away keeps
 * its code, and the retired studio name, out of the /websites bundles.
 */
export function HomePage(): null {
  return null
}
