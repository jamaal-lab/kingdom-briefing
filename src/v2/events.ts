/** Deep links between Studio-edition sections and the shared demos. */
export function openConsult(detail: { project?: string; note?: string }) {
  window.dispatchEvent(new CustomEvent('bridge:consult', { detail }))
  document.getElementById('consult')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

export function openIntelligence(businessId: string) {
  window.dispatchEvent(new CustomEvent('bridge:business', { detail: businessId }))
  document.getElementById('intelligence')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
