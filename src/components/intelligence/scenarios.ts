/**
 * Fictional businesses and inquiries for the Intelligence Experience.
 * Every business here is invented for demonstration; none is a real company.
 */

export type FieldKey = 'budget' | 'timeline' | 'scope' | 'location' | 'decision'

export type Service = { id: string; label: string; keywords: string[]; owner: string }

export type Business = {
  id: string
  name: string
  kind: string
  services: Service[]
  /** Budget band (USD) that represents a good fit for the business. */
  fitBudget: [number, number]
  /** Questions an intelligent site asks when a field is missing. */
  questions: Record<FieldKey, { ask: string; options: string[] }>
  presets: { id: string; label: string; message: string; answers: Partial<Record<FieldKey, string>> }[]
}

export const BUSINESSES: Business[] = [
  {
    id: 'architecture',
    name: 'Atelier North',
    kind: 'Architecture studio',
    fitBudget: [600_000, 8_000_000],
    services: [
      { id: 'new-home', label: 'New residence', keywords: ['new home', 'build', 'house', 'residence', 'plot', 'site', 'land'], owner: 'Principal architect' },
      { id: 'extension', label: 'Renovation & extension', keywords: ['renovat', 'extension', 'extend', 'remodel', 'kitchen', 'addition'], owner: 'Project architect' },
      { id: 'cultural', label: 'Cultural & gallery', keywords: ['gallery', 'museum', 'cultural', 'studio space', 'library'], owner: 'Principal architect' },
      { id: 'pavilion', label: 'Pavilion & landscape', keywords: ['pavilion', 'garden', 'outbuilding', 'cabin', 'pool house'], owner: 'Design lead' },
    ],
    questions: {
      budget: { ask: 'Do you have a construction budget in mind?', options: ['Under $750k', '$750k – $2M', '$2M – $5M', 'Not yet'] },
      timeline: { ask: 'When would you hope to start design?', options: ['Within 3 months', '3–6 months', 'Next year', 'Flexible'] },
      scope: { ask: 'Roughly how large is the project?', options: ['Under 2,000 sq ft', '2,000–4,000 sq ft', '4,000+ sq ft', 'Not sure'] },
      location: { ask: 'Do you already have a site?', options: ['Yes, purchased', 'Under offer', 'Still looking'] },
      decision: { ask: 'Who else is involved in the decision?', options: ['Just me', 'My partner and I', 'A board or committee'] },
    },
    presets: [
      {
        id: 'lake-home',
        label: 'New lakeside home',
        message: 'We bought a lakeside plot last spring and want to build a family home there — something that really uses the view. Budget is around $2.4M and we would love to start design this year.',
        answers: { scope: '2,000–4,000 sq ft', decision: 'My partner and I' },
      },
      {
        id: 'fees',
        label: 'Asking about fees',
        message: 'Hi, what do you charge for designing an extension? Just trying to get a rough idea.',
        answers: { budget: 'Not yet', location: 'Yes, purchased', timeline: 'Flexible' },
      },
      {
        id: 'gallery',
        label: 'Private gallery commission',
        message: 'I am a collector looking to commission a small private gallery on our estate. Timeline is flexible but the quality bar is very high.',
        answers: { budget: '$2M – $5M', location: 'Yes, purchased', decision: 'Just me' },
      },
    ],
  },
  {
    id: 'clinic',
    name: 'Solace Clinic',
    kind: 'Medical aesthetics clinic',
    fitBudget: [400, 20_000],
    services: [
      { id: 'consult', label: 'New-patient consultation', keywords: ['first time', 'consult', 'new patient', 'never had'], owner: 'Patient coordinator' },
      { id: 'skin', label: 'Skin treatment program', keywords: ['skin', 'acne', 'pigment', 'laser', 'peel', 'scarring'], owner: 'Lead clinician' },
      { id: 'injectables', label: 'Injectables', keywords: ['botox', 'filler', 'injectable', 'lines', 'wrinkle'], owner: 'Nurse injector' },
      { id: 'aftercare', label: 'Aftercare question', keywords: ['after my', 'swelling', 'redness', 'aftercare', 'since my treatment', 'reaction'], owner: 'Clinical lead' },
    ],
    questions: {
      budget: { ask: 'Do you have a budget in mind for treatment?', options: ['Under $500', '$500 – $2,000', '$2,000+', 'Not sure'] },
      timeline: { ask: 'When would you like to be seen?', options: ['This week', 'Within a month', 'Before an event', 'Flexible'] },
      scope: { ask: 'Have you had this treatment before?', options: ['Never', 'Yes, elsewhere', 'Yes, here'] },
      location: { ask: 'Which location suits you?', options: ['Downtown', 'Northside', 'Either'] },
      decision: { ask: 'Would you prefer a call or a visit first?', options: ['A call', 'A visit', 'Either'] },
    },
    presets: [
      {
        id: 'first-laser',
        label: 'First-time laser enquiry',
        message: 'I have some pigmentation from sun damage and I am thinking about laser. I have never had it done — is it right for me? Hoping to sort it before a wedding in about 3 months.',
        answers: { budget: '$500 – $2,000', location: 'Downtown' },
      },
      {
        id: 'aftercare',
        label: 'Aftercare concern',
        message: 'I had a peel here on Tuesday and there is still quite a lot of redness and some swelling today. Is that normal?',
        answers: { scope: 'Yes, here', timeline: 'This week' },
      },
      {
        id: 'price',
        label: 'Price shopping',
        message: 'How much is botox per area?',
        answers: { scope: 'Yes, elsewhere', timeline: 'Flexible' },
      },
    ],
  },
  {
    id: 'renovation',
    name: 'Ridgeline Renovations',
    kind: 'Home renovation contractor',
    fitBudget: [25_000, 600_000],
    services: [
      { id: 'kitchen', label: 'Kitchen renovation', keywords: ['kitchen', 'cabinet', 'countertop'], owner: 'Design-build lead' },
      { id: 'bath', label: 'Bathroom renovation', keywords: ['bath', 'shower', 'ensuite', 'tile'], owner: 'Design-build lead' },
      { id: 'whole-home', label: 'Whole-home renovation', keywords: ['whole house', 'whole home', 'gut', 'full renovation', 'addition'], owner: 'Senior estimator' },
      { id: 'repair', label: 'Urgent repair', keywords: ['leak', 'flood', 'water damage', 'urgent', 'emergency', 'ceiling'], owner: 'Service manager' },
    ],
    questions: {
      budget: { ask: 'What budget range are you working with?', options: ['Under $40k', '$40k – $120k', '$120k+', 'Need guidance'] },
      timeline: { ask: 'When would you like work to begin?', options: ['ASAP', '1–3 months', '3–6 months', 'Just planning'] },
      scope: { ask: 'Roughly how big is the space?', options: ['Small', 'Medium', 'Large / multiple rooms'] },
      location: { ask: 'Which area is the property in?', options: ['City', 'Suburbs', 'Outside service area'] },
      decision: { ask: 'Do you own the property?', options: ['Yes', 'Renting', 'Buying soon'] },
    },
    presets: [
      {
        id: 'kitchen',
        label: 'Kitchen remodel',
        message: 'Looking to completely redo our kitchen — new layout, island, the works. We are thinking $80k and would like to start in the next couple of months.',
        answers: { location: 'Suburbs', decision: 'Yes' },
      },
      {
        id: 'leak',
        label: 'Urgent leak',
        message: 'Water is coming through the ceiling under our upstairs bathroom. Can someone come out today?',
        answers: { location: 'City', decision: 'Yes' },
      },
      {
        id: 'vague',
        label: 'Vague first contact',
        message: 'Do you do bathrooms?',
        answers: {},
      },
    ],
  },
  {
    id: 'venue',
    name: 'The Glasshouse',
    kind: 'Event venue',
    fitBudget: [8_000, 150_000],
    services: [
      { id: 'wedding', label: 'Wedding', keywords: ['wedding', 'ceremony', 'reception', 'married', 'engaged'], owner: 'Wedding planner' },
      { id: 'corporate', label: 'Corporate event', keywords: ['company', 'corporate', 'offsite', 'conference', 'launch', 'team'], owner: 'Events manager' },
      { id: 'private', label: 'Private celebration', keywords: ['birthday', 'anniversary', 'party', 'celebration', 'dinner'], owner: 'Events coordinator' },
    ],
    questions: {
      budget: { ask: 'Do you have a budget for the venue and catering?', options: ['Under $15k', '$15k – $40k', '$40k+', 'Not sure'] },
      timeline: { ask: 'Which date or season are you considering?', options: ['Within 3 months', 'This season', 'Next year', 'Flexible'] },
      scope: { ask: 'How many guests are you expecting?', options: ['Under 50', '50–150', '150–300', '300+'] },
      location: { ask: 'Will guests be travelling in?', options: ['Mostly local', 'Some travel', 'Destination event'] },
      decision: { ask: 'Would you like to visit the venue?', options: ['Yes, in person', 'Virtual tour first', 'Not yet'] },
    },
    presets: [
      {
        id: 'wedding',
        label: 'Wedding next June',
        message: 'We got engaged and are looking at a June wedding next year for about 140 guests. Do you have availability, and what would a package look like?',
        answers: { budget: '$40k+', decision: 'Yes, in person' },
      },
      {
        id: 'offsite',
        label: 'Company offsite',
        message: 'Our team of 60 needs a venue for a two-day offsite in about 6 weeks. Need breakout rooms and AV.',
        answers: { budget: '$15k – $40k', location: 'Some travel' },
      },
      {
        id: 'party',
        label: 'Small birthday',
        message: 'Can I book a room for a 40th birthday dinner, maybe 20 people?',
        answers: { budget: 'Under $15k', timeline: 'Within 3 months' },
      },
    ],
  },
]
