/**
 * Business settings for the /websites page. Anything here may need owner
 * approval before launch; nothing in this file is a promise to clients.
 */
export const COMPANY = {
  legalName: 'Bridge to Better Solutions, LLC',
  shortName: 'Bridge to Better Solutions',
  tagline: 'Smarter Systems. Better Outcomes.',
  service: 'Web Design & Digital Experiences',
  email: 'jamaal@bridge2bettersolutions.com',
  location: 'Rochester, NY',
  pageUrl: 'https://bridge2bettersolutions.com/websites',
  parentUrl: 'https://bridge2bettersolutions.com',
  founder: { name: 'Jamaal T. Peavy', role: 'Founder & Lead Integrator' },
} as const

/**
 * Investment ranges offered in the intake. Default: the ranges already shown on
 * the owner's Lovable reference form. Set SHOW_BUDGET_RANGES to false to ask
 * only "prefer to discuss". Requires owner approval before launch.
 */
export const SHOW_BUDGET_RANGES = true
export const BUDGET_RANGES = ['Prefer to discuss', 'Under $5k', '$5k–$10k', '$10k–$25k', '$25k+'] as const
