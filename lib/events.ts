import { events } from "@/content/events";
import { serviceTimes } from "@/content/site";

const TZ = "America/Chicago";

export type EventCard = {
  key: string;
  title: string;
  date: Date;
  summary: string;
  location?: string;
  href?: string;
  recurring?: boolean;
};

export const fmtDay = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(d);
export const fmtMonth = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short" }).format(d);
export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, day: "numeric" }).format(d);
export const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(d);

/** Chicago UTC offset (minutes) for a given instant. */
function offsetMinutes(d: Date) {
  const s = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" }).format(d);
  const m = s.match(/GMT([+-])(\d{2}):(\d{2})/);
  return m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : -360;
}

const DAY_IDX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 } as const;

/** Next occurrences of recurring services (real schedule) over `days`. */
function recurring(now: Date, days: number, includeSeasonal: boolean): EventCard[] {
  const out: EventCard[] = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(now.getTime() + i * 86_400_000);
    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(day); // YYYY-MM-DD
    const dow = new Date(`${ymd}T12:00:00Z`).getUTCDay();
    for (const s of serviceTimes) {
      if (DAY_IDX[s.day] !== dow || (s.seasonal && !includeSeasonal)) continue;
      const [h, m] = s.time.split(":").map(Number);
      const utc = Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10), h, m);
      const date = new Date(utc - offsetMinutes(new Date(utc)) * 60_000);
      if (date < now) continue;
      out.push({ key: `${s.id}-${ymd}`, title: s.label, date, summary: s.note ?? "All are welcome.", recurring: true });
    }
  }
  return out;
}

/**
 * Upcoming cards: staff-entered special events first, padded with the real
 * recurring service schedule so the section is never empty.
 */
export function upcoming(limit = 6, now = new Date()): EventCard[] {
  const special: EventCard[] = events
    .map((e) => ({
      key: e.slug,
      title: e.title,
      date: new Date(e.start),
      summary: e.summary,
      location: e.location,
      href: `/events#${e.slug}`,
    }))
    .filter((e) => e.date >= now)
    .sort((a, b) => +a.date - +b.date);
  const pad = recurring(now, 14, false).filter((r) => r.title !== "Refuel Midweek");
  return [...special, ...pad].slice(0, limit);
}
