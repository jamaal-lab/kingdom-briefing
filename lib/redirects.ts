/**
 * Old WordPress URLs → new routes (301). Paths confirmed from the brief.
 * TODO: crawl the old sitemap.xml once fellowshipchicago.com is reachable and
 * add any remaining paths (ministry subpages, event posts, /live/, /give/ variants).
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/new-to-fellowship", destination: "/im-new" },
  { source: "/ministries", destination: "/connect" },
  { source: "/history", destination: "/our-story#timeline" },
  { source: "/meet-reverend-clay", destination: "/our-story#clay-evans" },
  { source: "/our-beliefs", destination: "/our-story#beliefs" },
  { source: "/our-core-values", destination: "/our-story#values" },
  { source: "/vision", destination: "/our-story#mission" },
  { source: "/our-leadership", destination: "/our-story#leadership" },
  // Likely paths on the old site. Verify against its sitemap:
  { source: "/live", destination: "/watch" },
  { source: "/giving", destination: "/give" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/prayer-request", destination: "/care#prayer" },
];
