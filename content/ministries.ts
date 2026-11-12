import type { Ministry } from "./types";

/**
 * MINISTRIES — PARTIAL.
 * The church lists ~27 ministries at fellowshipchicago.com/ministries/. That page
 * could not be fetched from the build environment, so only ministries named in
 * the verified brief are included. Descriptions marked `TODO_COPY` are holding
 * text; replace them with the church's own copy when importing the full list.
 * Leaders are inferred from staff titles and must be confirmed (see NOTES.md).
 */
export const TODO_COPY = "Full description to be imported from the church's ministries page.";

export const ministries: Ministry[] = [
  {
    slug: "kidz-zone",
    name: "Kidz Zone",
    summary: "Children's ministry during the 10:45 AM Sunday service.",
    description: TODO_COPY,
    ageGroups: ["Children"],
    interests: ["Discipleship"],
    schedule: "Sundays, 10:45 AM",
  },
  {
    slug: "youth",
    name: "Youth Ministry",
    summary: "Students meet Sundays at 10:45 AM.",
    description: TODO_COPY,
    ageGroups: ["Youth"],
    interests: ["Discipleship", "Fellowship"],
    leader: "Jillian Twiggs, Youth Pastor",
    schedule: "Sundays, 10:45 AM",
  },
  {
    slug: "worship-arts",
    name: "Worship & Arts",
    summary: "Music and creative arts in worship at The Ship.",
    description: TODO_COPY,
    ageGroups: ["Youth", "Young Adults", "Adults", "Seniors"],
    interests: ["Worship & Arts"],
    leader: "Kevin Vasser, Pastor of Worship & Arts",
  },
  {
    slug: "refuel",
    name: "Refuel",
    summary: "The midweek service: Tuesdays at 7:00 PM, seasonal.",
    description: TODO_COPY,
    ageGroups: ["All Ages"],
    interests: ["Discipleship", "Worship & Arts"],
    schedule: "Tuesdays, 7:00 PM (seasonal)",
  },
  {
    slug: "community-table",
    name: "Community Table",
    summary: "Shared meals for our neighbors.",
    description: TODO_COPY,
    ageGroups: ["All Ages"],
    interests: ["Service & Outreach", "Hospitality"],
  },
  {
    slug: "food-giveaway",
    name: "Food Giveaway",
    summary: "Groceries for families in the community.",
    description: TODO_COPY,
    ageGroups: ["All Ages"],
    interests: ["Service & Outreach"],
  },
  {
    slug: "social-justice",
    name: "Social Justice",
    summary: "Carrying forward Fellowship's civil rights legacy.",
    description: TODO_COPY,
    ageGroups: ["Young Adults", "Adults", "Seniors"],
    interests: ["Justice", "Service & Outreach"],
  },
  {
    slug: "membership-assimilation",
    name: "Membership & Assimilation",
    summary: "Joining Fellowship and finding your place on board.",
    description: TODO_COPY,
    ageGroups: ["Young Adults", "Adults", "Seniors"],
    interests: ["Hospitality", "Fellowship"],
    leader: "Wendy Irby, Director of Membership Services & Assimilation",
  },
  {
    slug: "virtual-ship",
    name: "The Virtual Ship",
    summary: "Worship online with us on YouTube and Facebook. #TheVirtualShip",
    description: TODO_COPY,
    ageGroups: ["All Ages"],
    interests: ["Media & Tech"],
  },
];

export const ageGroups = ["Children", "Youth", "Young Adults", "Adults", "Seniors", "All Ages"] as const;
export const interests = [
  "Worship & Arts",
  "Service & Outreach",
  "Care",
  "Discipleship",
  "Fellowship",
  "Hospitality",
  "Media & Tech",
  "Justice",
] as const;

export const getMinistry = (slug: string) => ministries.find((m) => m.slug === slug);
