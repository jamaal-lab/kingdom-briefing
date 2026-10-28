import { test, expect } from '@playwright/test'
import { validateInquiry, createRateLimiter, sameOrigin, newReference } from '../../src/server/inquiry'

const now = 1_800_000_000_000
const good = { name: 'Ada Lovelace', email: 'ada@example.com', project: 'A new website', tier: 'Signature', timing: 'Exploring', message: 'Hello', website: '', renderedAt: now - 10_000 }

test('accepts a well-formed inquiry and trims fields', () => {
  const r = validateInquiry({ ...good, name: '  Ada Lovelace \u0007 ' }, now)
  expect(r.ok).toBe(true)
  if (r.ok) expect(r.value.name).toBe('Ada Lovelace')
})

test('rejects invalid email, unknown options and missing name', () => {
  const r = validateInquiry({ ...good, name: 'A', email: 'nope', project: 'Hack', tier: 'Platinum' }, now)
  expect(r.ok).toBe(false)
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['email', 'name', 'project', 'tier'])
})

test('rejects honeypot and too-fast submissions', () => {
  expect(validateInquiry({ ...good, website: 'http://spam' }, now).ok).toBe(false)
  expect(validateInquiry({ ...good, renderedAt: now - 500 }, now).ok).toBe(false)
  expect(validateInquiry({ ...good, renderedAt: undefined }, now).ok).toBe(false)
})

test('rate limiter allows N per window per key', () => {
  const allow = createRateLimiter(2, 1000)
  expect([allow('a', 0), allow('a', 1), allow('a', 2), allow('b', 2), allow('a', 1001)]).toEqual([true, true, false, true, true])
})

test('same-origin check', () => {
  const mk = (h: Record<string, string>) => new Request('http://x/api/inquiry', { method: 'POST', headers: h })
  expect(sameOrigin(mk({ host: 'bridge.test', origin: 'https://bridge.test' }))).toBe(true)
  expect(sameOrigin(mk({ host: 'bridge.test', origin: 'https://evil.test' }))).toBe(false)
  expect(sameOrigin(mk({ host: 'bridge.test' }))).toBe(false)
})

test('references are short and unique-ish', () => {
  const a = newReference(new Date('2026-10-28'))
  expect(a).toMatch(/^BW-20261028-[0-9A-F]{6}$/)
  expect(newReference()).not.toBe(newReference())
})
