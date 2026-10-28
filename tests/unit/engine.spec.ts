import { test, expect } from '@playwright/test'
import { BUSINESSES } from '../../src/components/intelligence/scenarios'
import { runJourney, extractFromMessage, questionsFor } from '../../src/components/intelligence/engine'

const biz = (id: string) => BUSINESSES.find((b) => b.id === id)!

test('extracts budget and timing from free text', () => {
  const { facts } = extractFromMessage('We are thinking $80k and would like to start in the next couple of months.')
  expect(facts.find((f) => f.key === 'budget')?.value).toBe('≈ $80k')
  expect(facts.find((f) => f.key === 'timeline')?.value).toBe('Within 3 months')
})

test('every preset produces a complete, explainable journey', () => {
  for (const b of BUSINESSES)
    for (const p of b.presets) {
      const j = runJourney(b, p.message, p.answers)
      expect(j.score, `${b.id}/${p.id}`).toBeGreaterThanOrEqual(5)
      expect(j.score).toBeLessThanOrEqual(98)
      expect(j.reasons.reduce((n, r) => n + r.delta, 0)).toBe(Math.max(5, Math.min(98, j.score)))
      expect(j.nextStep.title.length).toBeGreaterThan(0)
      expect(j.draft.body).toContain(`The ${b.name} team`)
    }
})

test('urgent clinic aftercare routes to a clinician and advises urgent care', () => {
  const p = biz('clinic').presets.find((x) => x.id === 'aftercare')!
  const j = runJourney(biz('clinic'), p.message, p.answers)
  expect(j.intent).toBe('Urgent request')
  expect(j.responseTarget).toBe('Within 30 minutes')
  expect(j.draft.body).toContain('seek urgent medical care')
})

test('pricing questions get a guide, not a bare number', () => {
  const j = runJourney(biz('clinic'), 'How much is botox per area?', {})
  expect(j.intent).toBe('Pricing question')
  expect(j.nextStep.title).toContain('pricing guide')
})

test('skipped answers are not counted as known details', () => {
  const j = runJourney(biz('renovation'), 'Do you do bathrooms?', { budget: 'Skipped', timeline: 'ASAP' })
  expect(j.facts.some((f) => f.value === 'Skipped')).toBe(false)
  expect(j.missing).toContain('budget')
})

test('asks for the most valuable missing details first', () => {
  expect(questionsFor('Do you do bathrooms?')).toEqual(['scope', 'budget', 'timeline'])
})
