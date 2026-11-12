/**
 * Content types. Every file in /content is plain typed data so staff can edit
 * copy without touching components, and so a headless CMS can replace these
 * modules later without changing page code.
 */

export type ServiceTime = {
  id: string;
  label: string;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  /** 24h "HH:MM" in America/Chicago */
  time: string;
  /** Human display, e.g. "10:45 AM" */
  display: string;
  note?: string;
  seasonal?: boolean;
  /** Set when a fact still needs church confirmation. Surfaced in NOTES.md. */
  todo?: string;
};

export type Leader = {
  slug: string;
  name: string;
  role: string;
  /** Path under /public. Undefined until a verified photo is downloaded. */
  photo?: string;
  photoAlt?: string;
  /** Leave undefined rather than invent. */
  bio?: string;
  featured?: boolean;
};

export type TimelineEntry = {
  year: number;
  title: string;
  body?: string;
  image?: string;
  imageAlt?: string;
};

export type AgeGroup = "Children" | "Youth" | "Young Adults" | "Adults" | "Seniors" | "All Ages";
export type Interest =
  | "Worship & Arts"
  | "Service & Outreach"
  | "Care"
  | "Discipleship"
  | "Fellowship"
  | "Hospitality"
  | "Media & Tech"
  | "Justice";

export type Ministry = {
  slug: string;
  name: string;
  summary: string;
  description?: string;
  ageGroups: AgeGroup[];
  interests: Interest[];
  leader?: string;
  contactEmail?: string;
  schedule?: string;
  image?: string;
  imageAlt?: string;
};

export type ChurchEvent = {
  slug: string;
  title: string;
  /** ISO date-time in America/Chicago */
  start: string;
  end?: string;
  location?: string;
  summary: string;
  registerUrl?: string;
  image?: string;
  imageAlt?: string;
};

export type Sermon = {
  id: string; // YouTube video id
  title: string;
  published: string; // ISO
  speaker?: string;
  series?: string;
  scripture?: string;
  thumbnail: string;
};
