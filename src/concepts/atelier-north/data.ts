import { MEDIA } from '~/lib/media'

/**
 * ATELIER NORTH is a fictional architecture practice invented by Bridge Web
 * to demonstrate a website transformation. Projects, places and copy are
 * illustrative. Nothing here describes a real firm, client or building.
 */

export type ProjectType = 'Residential' | 'Cultural' | 'Pavilions'

export const PROJECTS = [
  {
    id: 'halden',
    name: 'Halden House',
    type: 'Residential' as ProjectType,
    summary: 'A lakeside home whose upper floor reaches out over the water, so every room faces the evening light.',
    detail:
      'The lower volume is set into the bank in board-formed concrete; the upper floor cantilevers eleven metres toward the lake. Glazing runs the full length of the living level, with deep reveals that shade the summer sun and frame the far shore.',
    facts: [
      ['Programme', 'Private residence'],
      ['Setting', 'Lakeshore'],
      ['Materials', 'Board-formed concrete, oiled oak'],
      ['Status', 'Concept'],
    ],
    image: MEDIA.halden,
  },
  {
    id: 'kestrel',
    name: 'Kestrel Gallery',
    type: 'Cultural' as ProjectType,
    summary: 'A private gallery of stone and a single long window, choreographed around one slow walk.',
    detail:
      'Visitors move along a forty-metre route lit by a continuous slot window at eye level. A reflecting pool doubles the façade at dusk; the entrance is recessed into a bronze-lined portal.',
    facts: [
      ['Programme', 'Private gallery'],
      ['Setting', 'Open plain'],
      ['Materials', 'Rammed stone, bronze'],
      ['Status', 'Concept'],
    ],
    image: MEDIA.kestrel,
  },
  {
    id: 'morrow',
    name: 'Morrow Pavilion',
    type: 'Pavilions' as ProjectType,
    summary: 'A timber roof plane floating over a glass room — a place for gatherings in the meadow.',
    detail:
      'Ten slender steel columns hold a deep timber roof that overhangs on every side. Glazing slides away entirely in summer, turning the pavilion into a sheltered terrace.',
    facts: [
      ['Programme', 'Event pavilion'],
      ['Setting', 'Meadow'],
      ['Materials', 'Larch, blackened steel, glass'],
      ['Status', 'Concept'],
    ],
    image: MEDIA.morrow,
  },
  {
    id: 'morrow-evening',
    name: 'Morrow Pavilion, evening',
    type: 'Pavilions' as ProjectType,
    summary: 'The same pavilion at blue hour, lit from within like a lantern in the field.',
    detail: 'Lighting was designed with the architecture: warm, low, and concealed, so the roof plane seems to float above a glowing room.',
    facts: [
      ['Programme', 'Event pavilion'],
      ['Setting', 'Meadow'],
      ['Lighting', 'Concealed linear, 2700K'],
      ['Status', 'Concept'],
    ],
    image: MEDIA.nocturne,
  },
  {
    id: 'wren',
    name: 'Wren House',
    type: 'Residential' as ProjectType,
    summary: 'A single long room that opens entirely to the hills and water beyond.',
    detail: 'One continuous window, a timber floor that runs out to the terrace, and a concrete wall that holds the warmth of the afternoon sun.',
    facts: [
      ['Programme', 'Private residence'],
      ['Setting', 'Hillside'],
      ['Materials', 'Concrete, oak, lime plaster'],
      ['Status', 'Concept'],
    ],
    image: MEDIA.interior,
  },
] as const

export const DISCIPLINES = [
  {
    id: 'homes',
    title: 'Homes',
    lede: 'Houses designed around the site, the light and the way you actually live.',
    body: 'We begin on the land: where the sun falls in winter, where the wind comes from, what you see when you wake. Every plan is shaped from there.',
    image: MEDIA.interior,
  },
  {
    id: 'cultural',
    title: 'Galleries & cultural spaces',
    lede: 'Rooms that slow people down, so the work — and the place — can be seen.',
    body: 'Circulation, daylight and material are composed as one sequence, from the approach outside to the last room within.',
    image: MEDIA.kestrel,
  },
  {
    id: 'pavilions',
    title: 'Pavilions & landscape',
    lede: 'Light structures that make a landscape habitable without taking it over.',
    body: 'Seasonal buildings, garden rooms and event pavilions, designed to sit lightly, open fully and age gracefully.',
    image: MEDIA.nocturne,
  },
] as const

export const PROCESS = [
  { step: '01', title: 'Site & brief', body: 'A walk of the land and a conversation about how you want to live, work or gather there.' },
  { step: '02', title: 'Concept', body: 'Models, sketches and light studies — two or three directions, explored honestly.' },
  { step: '03', title: 'Development', body: 'Detailed design, planning and engineering, with costs kept visible at every stage.' },
  { step: '04', title: 'Making', body: 'We stay on site with the builders until the last detail is right.' },
] as const

export const INQUIRY_STEPS = [
  {
    id: 'project',
    question: 'What are you planning?',
    options: ['A new home', 'Renovating or extending', 'A gallery or cultural space', 'A pavilion or garden building', 'Not sure yet'],
  },
  {
    id: 'stage',
    question: 'Where are you in the process?',
    options: ['Just exploring', 'I have a site', 'I have planning permission', 'Ready to start design'],
  },
  {
    id: 'timeline',
    question: 'When would you like to begin?',
    options: ['Within 3 months', '3–6 months', '6–12 months', 'Flexible'],
  },
  {
    id: 'budget',
    question: 'What construction budget are you considering?',
    options: ['Under $750k', '$750k – $2M', '$2M – $5M', 'Above $5M', 'Prefer to discuss'],
  },
] as const
