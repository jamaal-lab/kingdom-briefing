/**
 * The Intelligent Project Intake — single source of truth for questions,
 * branching and validation. Imported by the browser (to render and check each
 * step) and by the server route (to validate the submission again). The field
 * map against Lovable and DemoDrop is in docs/websites/01-AUDIT-AND-PLAN.md §5.
 */
import { BUDGET_RANGES, SHOW_BUDGET_RANGES } from '../config'

export type Answers = Record<string, string | string[] | undefined>
export type Path = 'quick' | 'existing' | 'new'

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select' | 'radio' | 'checkboxes'

export type Field = {
  id: string
  label: string
  type: FieldType
  required?: boolean | ((a: Answers) => boolean)
  showIf?: (a: Answers) => boolean
  options?: readonly string[]
  placeholder?: string
  help?: string
  max?: number
  autoComplete?: string
}

export type Step = {
  id: string
  title: string | ((a: Answers) => string)
  intro: string | ((a: Answers) => string)
  fields: Field[]
  showIf?: (a: Answers) => boolean
}

export const PROJECT_TYPES = [
  'A quick website fix or update',
  'A landing page or microsite',
  'A redesign of an existing site',
  'A completely new website',
  'An advanced interactive digital experience',
  "I'm not sure yet",
] as const

export const INDUSTRIES = [
  'Beauty & Wellness',
  'Home & Property Services',
  'Professional Services',
  'Nonprofits & Community',
  'Faith & Ministries',
  'Education & Youth',
  'Events & Creatives',
  'Retail & Products',
  'Other',
] as const

export const FEATURES = [
  'Appointment scheduling',
  'Contact forms or lead capture',
  'Online payments or e-commerce',
  'Customer portal',
  'Email marketing',
  'CRM integration',
  'Automated follow-up',
  'AI-assisted visitor support',
  'Custom calculators or interactive features',
  'Analytics and reporting',
  'Memberships or gated content',
  'Other requirements',
] as const

export const CONCEPTS = ['None yet', 'Atelier North', 'Serene Bloom', 'Summit Renovations', 'Evergreen Counsel', 'Riverside Community', 'Grace Hill', 'Ignite Academy', 'Lumen Studio', 'Vérité'] as const

const str = (a: Answers, k: string) => (typeof a[k] === 'string' ? (a[k] as string) : '')

/** Which branch of questions applies. */
export function pathOf(a: Answers): Path {
  const t = str(a, 'project_type')
  if (t === PROJECT_TYPES[0]) return 'quick'
  if (t === PROJECT_TYPES[2]) return 'existing'
  if (t === PROJECT_TYPES[5]) return str(a, 'has_website') === 'Yes' ? 'existing' : 'new'
  return 'new'
}

const notQuick = (a: Answers) => pathOf(a) !== 'quick'

export const STEPS: Step[] = [
  {
    id: 'project',
    title: "Let's start with your project",
    intro: 'A few basics so we know who we are talking with and where to begin.',
    fields: [
      { id: 'name', label: 'What is your name?', type: 'text', required: true, max: 120, autoComplete: 'name' },
      { id: 'organization', label: 'What is your business or organization called?', type: 'text', required: true, max: 160, autoComplete: 'organization' },
      { id: 'email', label: 'Best email address', type: 'email', required: true, max: 254, autoComplete: 'email' },
      { id: 'contact_method', label: 'How would you prefer we reach you?', type: 'radio', required: true, options: ['Email', 'Phone call', 'Text message'] },
      {
        id: 'phone',
        label: 'Phone number',
        type: 'tel',
        max: 40,
        autoComplete: 'tel',
        showIf: (a) => !!str(a, 'contact_method') && str(a, 'contact_method') !== 'Email',
        required: (a) => !!str(a, 'contact_method') && str(a, 'contact_method') !== 'Email',
      },
      { id: 'has_website', label: 'Do you have an existing website?', type: 'radio', required: true, options: ['Yes', 'No'] },
      {
        id: 'website_url',
        label: 'Website address',
        type: 'url',
        placeholder: 'yourwebsite.com',
        max: 300,
        showIf: (a) => str(a, 'has_website') === 'Yes',
        required: (a) => str(a, 'has_website') === 'Yes',
      },
      { id: 'project_type', label: 'What type of project do you need?', type: 'radio', required: true, options: PROJECT_TYPES },
    ],
  },
  {
    id: 'organization',
    title: 'Tell us about your organization',
    intro: 'We like to understand the work before we talk about technology.',
    fields: [
      { id: 'industry', label: 'Which best describes your organization?', type: 'select', required: true, options: INDUSTRIES },
      { id: 'what_you_do', label: 'What does your organization do?', type: 'textarea', required: true, max: 1200 },
      { id: 'who_you_serve', label: 'Who do you serve?', type: 'textarea', required: true, max: 800, help: 'Your primary audience — the people the website is for.' },
      { id: 'offerings', label: 'What are your primary services, products or programs?', type: 'textarea', max: 1200 },
      { id: 'difference', label: 'What makes your organization different?', type: 'textarea', max: 800 },
    ],
  },
  {
    id: 'change',
    title: (a) => ({ quick: 'What needs attention?', existing: 'What needs to change?', new: 'What should the new website do?' })[pathOf(a)],
    intro: (a) =>
      ({
        quick: 'Describe the task as precisely as you can — it helps us scope it quickly and accurately.',
        existing: 'Honest answers here shape the redesign more than anything else.',
        new: 'Start with outcomes; pages and features follow from them.',
      })[pathOf(a)],
    fields: [
      // Quick jobs
      { id: 'task_description', label: 'Describe the exact task', type: 'textarea', max: 1500, showIf: (a) => pathOf(a) === 'quick', required: (a) => pathOf(a) === 'quick' },
      { id: 'affected_area', label: 'Which page or feature is affected?', type: 'text', max: 300, showIf: (a) => pathOf(a) === 'quick', required: (a) => pathOf(a) === 'quick' },
      {
        id: 'blocking_customers',
        label: 'Is this stopping customers from contacting you or completing a purchase?',
        type: 'radio',
        options: ['Yes', 'No', 'Not sure'],
        showIf: (a) => pathOf(a) === 'quick',
        required: (a) => pathOf(a) === 'quick',
      },
      { id: 'deadline_impact', label: 'Is there a genuine deadline or business impact?', type: 'text', max: 300, showIf: (a) => pathOf(a) === 'quick' },
      // Existing websites
      { id: 'working_well', label: 'What is working well today?', type: 'textarea', max: 1000, showIf: (a) => pathOf(a) === 'existing' },
      { id: 'frustrations', label: 'What is frustrating or underperforming?', type: 'textarea', max: 1200, showIf: (a) => pathOf(a) === 'existing', required: (a) => pathOf(a) === 'existing' },
      { id: 'top_improvements', label: 'What are the top three improvements you want?', type: 'textarea', max: 800, showIf: (a) => pathOf(a) === 'existing', required: (a) => pathOf(a) === 'existing' },
      { id: 'must_preserve', label: 'Are there functions or content that must be preserved?', type: 'textarea', max: 800, showIf: (a) => pathOf(a) === 'existing' },
      // New websites
      { id: 'must_accomplish', label: 'What must your new website accomplish?', type: 'textarea', max: 1200, showIf: (a) => pathOf(a) === 'new', required: (a) => pathOf(a) === 'new' },
      { id: 'pages_envisioned', label: 'What pages or experiences do you envision?', type: 'textarea', max: 800, showIf: (a) => pathOf(a) === 'new' },
      { id: 'problems_to_solve', label: 'What problems are you trying to solve?', type: 'textarea', max: 800, showIf: (a) => pathOf(a) === 'new' },
    ],
  },
  {
    id: 'vision',
    title: 'Your vision',
    intro: 'This is where a website stops being generic.',
    showIf: notQuick,
    fields: [
      { id: 'visitor_feeling', label: 'How should visitors feel when they experience your website?', type: 'textarea', required: true, max: 600 },
      { id: 'brand_words', label: 'What three words should describe your brand online?', type: 'text', max: 120 },
      { id: 'admired_sites', label: 'Two or three websites you admire — and what specifically appeals to you', type: 'textarea', max: 1000 },
      { id: 'assets_available', label: 'What do you already have?', type: 'checkboxes', options: ['Brand guidelines', 'Logo files', 'Professional photos', 'Video', 'Written content', 'None of these yet'] },
      { id: 'avoid', label: 'Any colors, styles or approaches you want to avoid?', type: 'textarea', max: 600 },
      { id: 'inspired_concept', label: 'Did one of our concepts inspire you?', type: 'select', options: CONCEPTS },
    ],
  },
  {
    id: 'journey',
    title: 'Your ideal customer journey',
    intro: 'Websites succeed when they lead people somewhere specific.',
    showIf: notQuick,
    fields: [
      { id: 'primary_action', label: 'What is the single most important action visitors should take?', type: 'text', required: true, max: 200, placeholder: 'e.g. book a consultation, donate, request an estimate' },
      { id: 'visitor_questions', label: 'What questions or concerns must the website answer before someone acts?', type: 'textarea', max: 1000 },
      { id: 'conversion_barriers', label: 'What typically stops a visitor from becoming a customer or inquiry?', type: 'textarea', max: 800 },
      { id: 'success_90_days', label: 'What would a successful website accomplish in its first 90 days?', type: 'textarea', max: 800 },
    ],
  },
  {
    id: 'features',
    title: 'Features, systems & intelligence',
    intro: (a) => (pathOf(a) === 'quick' ? 'Does the task touch any of these? Skip if not.' : 'Choose anything that may be part of the project. Nothing here is a commitment.'),
    fields: [
      { id: 'features', label: 'Which of these may be needed?', type: 'checkboxes', options: FEATURES },
      { id: 'features_other', label: 'Other requirements', type: 'text', max: 300, showIf: (a) => Array.isArray(a.features) && a.features.includes('Other requirements') },
      {
        id: 'current_systems',
        label: 'Which systems or tools do you already use?',
        type: 'textarea',
        max: 800,
        help: 'For example a booking tool, CRM or email platform. Please never share passwords or login details here.',
      },
    ],
  },
  {
    id: 'scope',
    title: 'Scope, timeline & readiness',
    intro: 'Timelines and investment are agreed together in a written proposal — this simply helps us prepare.',
    fields: [
      { id: 'timeline', label: 'When would you like to launch?', type: 'radio', required: true, options: ['As soon as possible', 'Within 1–3 months', '3–6 months', '6+ months', 'Flexible / exploring'] },
      { id: 'launch_date', label: 'Target date, if you have one', type: 'date' },
      { id: 'date_driver', label: 'Is that date tied to an event, campaign or business deadline?', type: 'text', max: 300 },
      ...(SHOW_BUDGET_RANGES ? [{ id: 'budget', label: 'What investment range have you planned?', type: 'select' as const, options: BUDGET_RANGES }] : []),
      { id: 'approver', label: 'Who will approve the project?', type: 'radio', required: true, options: ['Just me', 'Me and a partner', 'A team or board', 'Not sure yet'] },
      { id: 'content_ready', label: 'Are your content and assets ready?', type: 'radio', required: true, options: ['Ready', 'Partly ready', 'Not yet'] },
      { id: 'ongoing_support', label: 'Would ongoing support or maintenance be helpful?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
]

export const CONSENT_TEXT =
  'I agree that Bridge to Better Solutions, LLC may store the information above and contact me about this inquiry. It will not be sold or shared for marketing.'

export function resolve<T>(v: T | ((a: Answers) => T), a: Answers): T {
  return typeof v === 'function' ? (v as (a: Answers) => T)(a) : v
}

export const visibleSteps = (a: Answers) => STEPS.filter((s) => !s.showIf || s.showIf(a))
export const visibleFields = (s: Step, a: Answers) => s.fields.filter((f) => !f.showIf || f.showIf(a))

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,253}\.[a-z]{2,}$/i
const URLISH = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i
const PHONE = /^[+()\d\s.-]{7,40}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g

export function clean(v: unknown, max = 2000) {
  return typeof v === 'string' ? v.replace(CONTROL, '').trim().slice(0, max) : ''
}

/** Validate one field. Returns an error message or null. */
export function fieldError(f: Field, a: Answers): string | null {
  const required = resolve(f.required ?? false, a)
  const v = a[f.id]
  if (f.type === 'checkboxes') {
    const list = Array.isArray(v) ? v : []
    if (required && !list.length) return 'Choose at least one option.'
    if (list.some((x) => !f.options?.includes(x))) return 'Unknown option.'
    return null
  }
  const s = typeof v === 'string' ? v.trim() : ''
  if (!s) return required ? (f.type === 'radio' || f.type === 'select' ? 'Please choose an option.' : 'Please fill this in.') : null
  if (f.max && s.length > f.max) return `Please keep this under ${f.max} characters.`
  if ((f.type === 'radio' || f.type === 'select') && !f.options?.includes(s)) return 'Please choose one of the options.'
  if (f.type === 'email' && !EMAIL.test(s)) return 'Please enter a valid email address.'
  if (f.type === 'url' && !URLISH.test(s)) return 'Please enter a web address, e.g. yourwebsite.com.'
  if (f.type === 'tel' && !PHONE.test(s)) return 'Please enter a phone number.'
  if (f.type === 'date' && !DATE.test(s)) return 'Please use a valid date.'
  return null
}

export function stepErrors(s: Step, a: Answers) {
  const errors: Record<string, string> = {}
  for (const f of visibleFields(s, a)) {
    const e = fieldError(f, a)
    if (e) errors[f.id] = e
  }
  return errors
}

/**
 * Full validation of untrusted input (server). Keeps only visible, known
 * fields, normalised; hidden-branch answers are dropped so nothing irrelevant
 * is stored.
 */
export function validateIntake(input: unknown): { ok: true; answers: Answers; path: Path } | { ok: false; errors: Record<string, string> } {
  const o = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const raw: Answers = {}
  for (const s of STEPS)
    for (const f of s.fields) {
      const v = o[f.id]
      raw[f.id] = f.type === 'checkboxes' ? (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => clean(x, 120)).slice(0, 20) : []) : clean(v, (f.max ?? 2000) + 1)
    }
  const errors: Record<string, string> = {}
  const answers: Answers = {}
  for (const s of visibleSteps(raw))
    for (const f of visibleFields(s, raw)) {
      const e = fieldError(f, raw)
      if (e) errors[f.id] = e
      const v = raw[f.id]
      if ((Array.isArray(v) && v.length) || (typeof v === 'string' && v)) answers[f.id] = v
    }
  if (o.consent !== true) errors.consent = 'Please confirm consent so we can reply.'
  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, answers, path: pathOf(raw) }
}

/** Human-readable summary, used for the review step, the email fallback and the webhook. */
export function summarize(a: Answers) {
  const lines: string[] = []
  for (const s of visibleSteps(a)) {
    const fields = visibleFields(s, a).filter((f) => {
      const v = a[f.id]
      return Array.isArray(v) ? v.length : !!(typeof v === 'string' && v.trim())
    })
    if (!fields.length) continue
    lines.push(`— ${resolve(s.title, a)} —`)
    for (const f of fields) {
      const v = a[f.id]
      lines.push(`${f.label}\n  ${Array.isArray(v) ? v.join(', ') : v}`)
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}
