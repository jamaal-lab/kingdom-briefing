import type { ChurchEvent } from "./types";

/**
 * SPECIAL EVENTS. Staff add one object per event: text, not graphics.
 * Empty until the church supplies its calendar (no events were invented).
 *
 * Example:
 * {
 *   slug: "fall-revival-2026",
 *   title: "Fall Revival",
 *   start: "2026-11-18T19:00:00-06:00",
 *   location: "Main Sanctuary",
 *   summary: "Three nights of preaching and praise.",
 *   registerUrl: "https://...",
 * }
 */
export const events: ChurchEvent[] = [];
