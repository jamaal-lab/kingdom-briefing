import { test, expect } from '@playwright/test'
import { createHmac } from 'node:crypto'
import { pathOf, PROJECT_TYPES, STEPS, summarize, validateIntake, visibleSteps, type Answers } from '../../src/websites/intake/schema'
import { botCheck, buildSubmission, configuredAdapter, webhookAdapter } from '../../src/server/intake'

/** Consent defaults to given; a test can override it. */
const check = (a: object) => validateIntake({ consent: true, ...a })

const base = {
  name: 'Ada Lovelace',
  organization: 'Analytical Works',
  email: 'ada@example.com',
  contact_method: 'Email',
  has_website: 'No',
  industry: 'Professional Services',
  what_you_do: 'We design engines.',
  who_you_serve: 'Mathematicians.',
  timeline: 'Flexible / exploring',
  approver: 'Just me',
  content_ready: 'Partly ready',
}
const quick: Answers = { ...base, has_website: 'Yes', website_url: 'example.com', project_type: PROJECT_TYPES[0], task_description: 'Contact form is broken', affected_area: 'Contact page', blocking_customers: 'Yes' }
const fresh: Answers = { ...base, project_type: PROJECT_TYPES[3], must_accomplish: 'Take bookings', visitor_feeling: 'Confident', primary_action: 'Book a call' }

test('branching: quick jobs skip vision and journey; new and redesign paths include them', () => {
  expect(pathOf(quick)).toBe('quick')
  expect(visibleSteps(quick).map((s) => s.id)).toEqual(['project', 'organization', 'change', 'features', 'scope'])
  expect(pathOf(fresh)).toBe('new')
  expect(visibleSteps(fresh)).toHaveLength(STEPS.length)
  expect(pathOf({ project_type: PROJECT_TYPES[2] })).toBe('existing')
  expect(pathOf({ project_type: PROJECT_TYPES[5], has_website: 'Yes' })).toBe('existing')
  expect(pathOf({ project_type: PROJECT_TYPES[5], has_website: 'No' })).toBe('new')
})

test('never more than eight steps including review', () => {
  expect(STEPS.length + 1).toBeLessThanOrEqual(8)
})

test('accepts complete submissions for each path', () => {
  expect(check(quick).ok).toBe(true)
  expect(check(fresh).ok).toBe(true)
})

test('requires branch-specific answers, consent, and phone when phone contact is chosen', () => {
  const r = check({ ...fresh, must_accomplish: '', consent: false, contact_method: 'Phone call' })
  expect(r.ok).toBe(false)
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['consent', 'must_accomplish', 'phone'])
})

test('rejects unknown options, bad email and over-long text', () => {
  const r = check({ ...fresh, industry: 'Hacking', email: 'nope', what_you_do: 'x'.repeat(5000), features: ['Teleportation'] })
  expect(r.ok).toBe(false)
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['email', 'features', 'industry', 'what_you_do'])
})

test('drops answers from hidden branches and unknown keys', () => {
  const r = check({ ...quick, visitor_feeling: 'should be dropped', must_accomplish: 'dropped', evil: '<script>' })
  expect(r.ok).toBe(true)
  if (r.ok) {
    expect(r.answers.visitor_feeling).toBeUndefined()
    expect(r.answers.must_accomplish).toBeUndefined()
    expect((r.answers as Record<string, unknown>).evil).toBeUndefined()
  }
})

test('summary lists answered questions by step', () => {
  const s = summarize(quick)
  expect(s).toContain('What needs attention?')
  expect(s).toContain('Contact form is broken')
})

test('bot check: honeypot and timing', () => {
  const now = 1_800_000_000_000
  expect(botCheck({ startedAt: now - 20_000 }, now)).toBe(true)
  expect(botCheck({ startedAt: now - 2_000 }, now)).toBe(false)
  expect(botCheck({ startedAt: now - 20_000, company_fax: 'x' }, now)).toBe(false)
  expect(botCheck({}, now)).toBe(false)
})

test('adapter configuration: off by default, webhook needs https URL and a real secret', () => {
  expect(configuredAdapter({})).toBeNull()
  expect(configuredAdapter({ INTAKE_DELIVERY: 'log' })).not.toBeNull()
  expect(configuredAdapter({ INTAKE_DELIVERY: 'webhook', INTAKE_WEBHOOK_URL: 'http://x.test', INTAKE_WEBHOOK_SECRET: 'a'.repeat(32) })).toBeNull()
  expect(configuredAdapter({ INTAKE_DELIVERY: 'webhook', INTAKE_WEBHOOK_URL: 'https://x.test', INTAKE_WEBHOOK_SECRET: 'short' })).toBeNull()
  expect(configuredAdapter({ INTAKE_DELIVERY: 'webhook', INTAKE_WEBHOOK_URL: 'https://x.test', INTAKE_WEBHOOK_SECRET: 'a'.repeat(32) })).not.toBeNull()
})

test('webhook adapter signs the body and fails on non-2xx', async () => {
  const r = check(fresh)
  if (!r.ok) throw new Error('fixture invalid')
  const sub = buildSubmission(r.answers, r.path)
  const secret = 's'.repeat(32)
  let seen: { body: string; sig: string | null } | null = null
  const ok = webhookAdapter('https://hook.test', secret, (async (_u: string, init: RequestInit) => {
    seen = { body: String(init.body), sig: new Headers(init.headers).get('x-btbs-signature') }
    return new Response(null, { status: 200 })
  }) as typeof fetch)
  await ok(sub)
  expect(seen).not.toBeNull()
  const { body, sig } = seen!
  expect(sig).toBe(`sha256=${createHmac('sha256', secret).update(body).digest('hex')}`)
  const payload = JSON.parse(body)
  expect(payload).toMatchObject({ type: 'website_project_intake', reference: sub.reference, email: 'ada@example.com', organization: 'Analytical Works' })
  expect(sub.reference).toMatch(/^BTBS-\d{8}-[0-9A-F]{6}$/)

  const failing = webhookAdapter('https://hook.test', secret, (async () => new Response(null, { status: 500 })) as typeof fetch)
  await expect(failing(sub)).rejects.toThrow('500')
})
