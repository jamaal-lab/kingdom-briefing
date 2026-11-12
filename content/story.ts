import type { Leader, TimelineEntry } from "./types";

/** T.H.E. S.H.I.P. mission framework */
export const mission = [
  { letter: "T", word: "Teaching" },
  { letter: "H", word: "Hospitality" },
  { letter: "E", word: "Engagement" },
  { letter: "S", word: "Service" },
  { letter: "H", word: "Holistic Ministry" },
  { letter: "I", word: "Innovation" },
  { letter: "P", word: "Praise & Worship" },
] as const;

export const logoMeaning = [
  { symbol: "Anchor", meaning: "Stability in Christ." },
  { symbol: "Ankh", meaning: "Our African history." },
  { symbol: "Five-strand rope", meaning: "Family across five generations since 1950." },
  { symbol: "Crown of thorns & cross beam", meaning: "The price Jesus paid." },
] as const;

/**
 * Key beats supplied by the church. Body copy is filled in from /history/
 * once that page can be fetched. Do not add years not on the source page.
 */
export const timeline: TimelineEntry[] = [
  { year: 1950, title: "Founded as Mount Carmel Missionary Baptist Church", body: "Rev. Dr. Clay Evans begins the church." },
  { year: 1952, title: "Renamed Fellowship; first radio broadcast" },
  { year: 1959, title: "Purchases the 45th & Princeton site" },
  { year: 1965, title: "First LP recording; Jesse Jackson Sr. ordained" },
  { year: 1973, title: "Current building opens" },
  { year: 1977, title: "Television broadcast and credit union launch" },
  { year: 2000, title: "Rev. Clay Evans retires" },
  { year: 2001, title: "Pastor Charles Jenkins inaugurated" },
  { year: 2007, title: "Live streaming begins" },
  { year: 2013, title: "Five Stellar Awards" },
  { year: 2018, title: "Sanctuary remodeled" },
  { year: 2019, title: "Rev. Reginald W. Sharpe Jr. named Pastor" },
];

export const leadership: Leader[] = [
  { slug: "reginald-sharpe", name: "Reginald W. Sharpe Jr.", role: "Senior Pastor", featured: true },
  { slug: "brianna-sharpe", name: "Brianna Sharpe", role: "First Lady", featured: true },
  { slug: "frazlier-pope", name: "Frazlier L. Pope III", role: "Executive Pastor" },
  { slug: "kesha-brown", name: "Kesha Brown", role: "Chief Financial Officer" },
  { slug: "wendy-irby", name: "Wendy Irby", role: "Director of Membership Services & Assimilation" },
  { slug: "kevin-vasser", name: "Kevin Vasser", role: "Pastor of Worship & Arts" },
  { slug: "jillian-twiggs", name: "Jillian Twiggs", role: "Youth Pastor" },
  { slug: "damien-martin", name: "Damien Martin", role: "Director of Ministry Operations" },
  { slug: "debra-earl", name: "Debra Earl", role: "Executive Assistant to the Pastor" },
  { slug: "rafael-evans", name: "Rafael Evans", role: "Office Coordinator" },
  { slug: "roxanne-montgomery", name: "Roxanne Montgomery", role: "Accounts Payable Manager" },
  { slug: "ashley-cheeks", name: "Ashley Cheeks", role: "Digital Communications Strategist" },
];
