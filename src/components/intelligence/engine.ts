/**
 * A small, deterministic rules engine that runs entirely in the browser.
 * It stands in for the intake, classification and drafting layer of an
 * intelligent website. It is deliberately transparent (every score has a
 * reason) and is not a language model; nothing is sent or stored.
 */
import type { Business, FieldKey, Service } from './scenarios'

export const FIELD_LABEL: Record<FieldKey, string> = {
  location: 'Site / location',
  scope: 'Scope',
  budget: 'Budget',
  timeline: 'Timing',
  decision: 'Decision',
}
const FIELD_ORDER: FieldKey[] = ['scope', 'budget', 'timeline', 'location', 'decision']

export type Fact = { key: FieldKey; value: string; source: 'message' | 'asked' }

export type Journey = {
  message: string
  facts: Fact[]
  asked: { key: FieldKey; question: string; answer: string }[]
  missing: FieldKey[]
  service: Service
  serviceConfident: boolean
  intent: 'Urgent request' | 'Pricing question' | 'Availability' | 'New project' | 'Early enquiry'
  urgent: boolean
  budgetValue?: number
  fit: 'Strong fit' | 'Likely fit' | 'Needs qualification' | 'Below typical scope'
  score: number
  priority: 'High' | 'Medium' | 'Standard'
  reasons: { text: string; delta: number }[]
  nextStep: { title: string; detail: string; visitor: string }
  responseTarget: string
  draft: { subject: string; body: string }
  owner: string
}

const MONEY = /\$\s?(\d+(?:[.,]\d+)?)\s?(k|m|million|thousand)?\b|\b(\d+(?:\.\d+)?)\s?(k|m)\b/i
const URGENT = /\b(today|tonight|asap|as soon as possible|urgent|emergency|right away|immediately|coming through the ceiling|leak(?:ing)?|flood(?:ing)?|still (?:quite a lot of )?(?:redness|swelling)|swelling|reaction)\b/i
const PRICE = /\b(price|pricing|cost|costs|charge|how much|fee|fees|rate|rates|per area|quote)\b/i
const AVAIL = /\b(availability|available|book|booking|date|dates)\b/i
const TIMING = [
  { re: /\b(today|tonight|asap|as soon as possible|right away|this week)\b/i, label: 'Immediate', soon: true },
  { re: /\b(?:in|within|about|around)\s+(?:the\s+)?(?:next\s+)?(\d+|a few|a couple of|couple of|two|three|four|five|six)\s+(day|week)s?\b/i, label: 'Within weeks', soon: true },
  { re: /\b(?:in|within|about|around)\s+(?:the\s+)?(?:next\s+)?(\d+|a few|a couple of|couple of|two|three)\s+months?\b/i, label: 'Within 3 months', soon: true },
  { re: /\b(?:next|in)\s+(?:couple of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|spring|summer|autumn|fall|winter|year)\b/i, label: 'Next year / season', soon: false },
  { re: /\bthis year\b/i, label: 'This year', soon: false },
  { re: /\bflexible\b/i, label: 'Flexible', soon: false },
]
const SCOPE = /\b(\d{1,4})\s+(guests|people|attendees|staff)\b|\bteam of (\d{1,4})\b|\b(\d{3,5})\s?(sq\.? ?ft|square feet)\b/i

function parseMoney(text: string): number | undefined {
  const m = text.match(MONEY)
  if (!m) return undefined
  const n = parseFloat((m[1] ?? m[3]).replace(',', ''))
  const unit = (m[2] ?? m[4] ?? '').toLowerCase()
  const mult = unit === 'k' || unit === 'thousand' ? 1e3 : unit === 'm' || unit === 'million' ? 1e6 : 1
  return n * mult
}

/** Map an answer option like "$750k – $2M" or "Under $40k" to a representative value. */
function moneyFromOption(option: string): number | undefined {
  const parts = option.split(/–|-|to/).map((p) => parseMoney(p)).filter((v): v is number => v !== undefined)
  if (!parts.length) return undefined
  if (/under/i.test(option)) return parts[0] * 0.8
  if (/above|\+/.test(option)) return parts[0] * 1.2
  return parts.length > 1 ? (parts[0] + parts[1]) / 2 : parts[0]
}

const fmtMoney = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(v % 1e6 === 0 ? 0 : 1)}M` : v >= 1e3 ? `$${Math.round(v / 1e3)}k` : `$${Math.round(v)}`)

export function extractFromMessage(message: string) {
  const facts: Fact[] = []
  const money = parseMoney(message)
  if (money !== undefined) facts.push({ key: 'budget', value: `≈ ${fmtMoney(money)}`, source: 'message' })
  const timing = TIMING.find((t) => t.re.test(message))
  if (timing) facts.push({ key: 'timeline', value: timing.label, source: 'message' })
  const scope = message.match(SCOPE)
  if (scope) facts.push({ key: 'scope', value: scope[0], source: 'message' })
  if (/\b(bought|own|purchased|our (?:plot|site|land|estate|property))\b/i.test(message)) facts.push({ key: 'location', value: 'Site secured', source: 'message' })
  return { facts, money, timing }
}

/** Which questions the site should ask next (missing fields, most valuable first). */
export function questionsFor(message: string, limit = 3): FieldKey[] {
  const known = new Set(extractFromMessage(message).facts.map((f) => f.key))
  return FIELD_ORDER.filter((k) => !known.has(k)).slice(0, limit)
}

function pickService(business: Business, text: string): [Service, boolean] {
  const lower = text.toLowerCase()
  let best = business.services[0]
  let bestScore = 0
  for (const s of business.services) {
    const score = s.keywords.reduce((n, k) => n + (lower.includes(k) ? 1 : 0), 0)
    if (score > bestScore) {
      best = s
      bestScore = score
    }
  }
  return [best, bestScore > 0]
}

export function runJourney(business: Business, message: string, answers: Partial<Record<FieldKey, string>>): Journey {
  const text = message.trim()
  const { facts: fromMessage, money, timing } = extractFromMessage(text)
  const known = new Set(fromMessage.map((f) => f.key))
  const asked: Journey['asked'] = []
  const facts: Fact[] = [...fromMessage]
  for (const key of FIELD_ORDER) {
    const a = answers[key]
    if (!a || known.has(key)) continue
    asked.push({ key, question: business.questions[key].ask, answer: a })
    facts.push({ key, value: a, source: 'asked' })
  }
  const missing = FIELD_ORDER.filter((k) => !facts.some((f) => f.key === k))

  const [service, serviceConfident] = pickService(business, `${text} ${Object.values(answers).join(' ')}`)
  const urgent = URGENT.test(text) || /repair|aftercare/.test(service.id)
  const intent: Journey['intent'] = urgent
    ? 'Urgent request'
    : PRICE.test(text)
      ? 'Pricing question'
      : AVAIL.test(text) && business.id === 'venue'
        ? 'Availability'
        : text.length < 45
          ? 'Early enquiry'
          : 'New project'

  const budgetValue = money ?? (answers.budget ? moneyFromOption(answers.budget) : undefined)
  const [lo, hi] = business.fitBudget
  const fit: Journey['fit'] =
    budgetValue === undefined ? (serviceConfident ? 'Likely fit' : 'Needs qualification') : budgetValue < lo ? 'Below typical scope' : budgetValue <= hi * 1.5 ? 'Strong fit' : 'Likely fit'

  const reasons: Journey['reasons'] = [{ text: 'Baseline for a direct website enquiry', delta: 30 }]
  if (urgent) reasons.push({ text: 'Time-sensitive language detected', delta: 28 })
  if (fit === 'Strong fit') reasons.push({ text: `Budget within typical range (${fmtMoney(lo)}–${fmtMoney(hi)})`, delta: 22 })
  if (fit === 'Below typical scope') reasons.push({ text: 'Budget below the usual project range', delta: -12 })
  if (timing?.soon) reasons.push({ text: `Wants to start soon (${timing.label.toLowerCase()})`, delta: 10 })
  const completeness = 5 - missing.length
  if (completeness > 0) reasons.push({ text: `${completeness} of 5 key details known`, delta: completeness * 3 })
  if (text.length > 120) reasons.push({ text: 'Detailed, specific message', delta: 5 })
  if (!serviceConfident) reasons.push({ text: 'Service unclear — needs a clarifying question', delta: -6 })
  const score = Math.max(5, Math.min(98, reasons.reduce((n, r) => n + r.delta, 0)))
  const priority: Journey['priority'] = score >= 72 ? 'High' : score >= 50 ? 'Medium' : 'Standard'

  const owner = urgent ? (business.services.find((s) => /repair|aftercare/.test(s.id))?.owner ?? service.owner) : service.owner
  const nextStep = recommend(business, intent, service, facts, fit, owner)
  const responseTarget = urgent ? 'Within 30 minutes' : priority === 'High' ? 'Within 2 business hours' : priority === 'Medium' ? 'Same business day' : 'Within 2 business days'

  return {
    message: text,
    facts,
    asked,
    missing,
    service,
    serviceConfident,
    intent,
    urgent,
    budgetValue,
    fit,
    score,
    priority,
    reasons,
    nextStep,
    responseTarget,
    draft: draftFollowUp(business, intent, service, facts, nextStep),
    owner,
  }
}

function recommend(business: Business, intent: Journey['intent'], service: Service, facts: Fact[], fit: Journey['fit'], owner: string) {
  const has = (k: FieldKey) => facts.some((f) => f.key === k)
  if (intent === 'Urgent request') {
    if (business.id === 'clinic')
      return {
        title: 'Same-day clinical callback',
        detail: `Route straight to the ${owner.toLowerCase()} for a call today. Share the clinic’s standard aftercare page and how to reach urgent care if symptoms worsen.`,
        visitor: 'One of our clinicians will call you today. If your symptoms get worse before then, please seek urgent medical care.',
      }
    return {
      title: 'Same-day call and site visit',
      detail: `Alert the ${owner.toLowerCase()} now, confirm the address and access, and offer the earliest visit window.`,
      visitor: 'Our service manager will call you shortly to arrange the earliest possible visit.',
    }
  }
  if (intent === 'Pricing question')
    return {
      title: 'Transparent pricing guide + short call',
      detail: `Send the ${service.label.toLowerCase()} pricing guide with typical ranges, and offer a 15-minute call to scope it properly instead of a bare number.`,
      visitor: 'I’ve attached our pricing guide with typical ranges, and we’d be happy to give you a precise figure after a 15-minute call.',
    }
  if (intent === 'Availability')
    return {
      title: 'Share open dates and invite a visit',
      detail: 'Hold the closest matching dates for 72 hours, send the package outline, and offer an in-person or virtual walkthrough.',
      visitor: 'We’ve pencilled in the closest matching dates for 72 hours and attached our package outline. We’d love to show you around.',
    }
  if (intent === 'Early enquiry')
    return {
      title: 'Ask two clarifying questions',
      detail: `Reply with two short questions (${(['scope', 'timeline'] as FieldKey[]).map((k) => FIELD_LABEL[k].toLowerCase()).join(' and ')}) and three relevant examples, rather than a generic brochure.`,
      visitor: 'Could you tell us roughly how large the project is, and when you’d like to begin? I’ve included three similar projects for inspiration.',
    }
  if (fit === 'Below typical scope')
    return {
      title: 'Suggest a right-sized option',
      detail: 'Explain the typical project range kindly, and point to a smaller-scope service or a trusted referral.',
      visitor: 'Projects like ours usually start at a larger scale, but we’d be glad to suggest a smaller-scope option or someone we trust.',
    }
  if (business.id === 'architecture' && has('location'))
    return {
      title: 'Offer a site visit',
      detail: `Propose a site walk with the ${owner.toLowerCase()} in the next two weeks, then a short feasibility note.`,
      visitor: 'We’d love to walk the site with you in the next couple of weeks, and follow up with a short feasibility note.',
    }
  return {
    title: 'Book a discovery consultation',
    detail: `Offer a 30-minute consultation with the ${owner.toLowerCase()}, with a one-page outline of what happens next.`,
    visitor: 'The best next step is a 30-minute conversation — I’ve attached a one-page outline of how we work.',
  }
}

function draftFollowUp(business: Business, intent: Journey['intent'], service: Service, facts: Fact[], next: Journey['nextStep']) {
  const understood = facts.map((f) => `• ${FIELD_LABEL[f.key]}: ${f.value}`).join('\n')
  const opening: Record<Journey['intent'], string> = {
    'Urgent request': 'Thank you for letting us know straight away — we understand this needs attention today.',
    'Pricing question': `Thank you for asking about ${service.label.toLowerCase()}. A single number rarely helps, so here is how pricing usually works for projects like yours.`,
    Availability: 'Congratulations, and thank you for considering us.',
    'New project': `Thank you for telling us about your plans — it sounds like a wonderful ${service.label.toLowerCase()} project.`,
    'Early enquiry': `Thank you for reaching out. We’d be glad to help with ${service.label.toLowerCase()}.`,
  }
  const close: Record<Journey['intent'], string> = {
    'Urgent request': 'A member of our team will call you shortly at the number you provide.',
    'Pricing question': 'If it’s useful, reply with a time that suits you for a quick call.',
    Availability: 'Reply with the dates that work best and we’ll hold them for you.',
    'New project': 'Reply with two or three times that suit you, and we’ll confirm.',
    'Early enquiry': 'A couple of quick answers will let us point you in the right direction.',
  }
  return {
    subject: `Re: ${service.label} — ${next.title.toLowerCase()}`,
    body: [
      'Hello,',
      '',
      opening[intent],
      ...(understood ? ['', 'Here’s what we understood:', understood] : []),
      '',
      next.visitor,
      '',
      close[intent],
      '',
      `Warm regards,\nThe ${business.name} team`,
    ].join('\n'),
  }
}
