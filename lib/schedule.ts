import { serviceTimes } from "@/content/site";
import type { ServiceTime } from "@/content/types";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const TZ = "America/Chicago";

/** Wall-clock parts for `date` as seen in Chicago. */
function chicagoParts(date: Date) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    dayIndex: DAYS.indexOf(p.weekday as (typeof DAYS)[number]),
    minutes: Number(p.hour) * 60 + Number(p.minute),
    seconds: Number(p.second),
  };
}

export type NextService = {
  service: ServiceTime;
  /** ms until start; <= 0 while live */
  msUntil: number;
  isLive: boolean;
};

/** A service counts as "live" from start until this many minutes after. */
const LIVE_WINDOW_MIN = 100;

/**
 * Next upcoming (or currently live) service. Seasonal services are included
 * only when `includeSeasonal` is true (toggle in content when Refuel is on).
 */
export function getNextService(now = new Date(), includeSeasonal = false): NextService {
  const { dayIndex, minutes, seconds } = chicagoParts(now);
  const nowWeekMin = dayIndex * 1440 + minutes + seconds / 60;
  let best: NextService | null = null;

  for (const s of serviceTimes) {
    if (s.seasonal && !includeSeasonal) continue;
    const [h, m] = s.time.split(":").map(Number);
    const start = DAYS.indexOf(s.day) * 1440 + h * 60 + m;
    let delta = start - nowWeekMin;
    if (delta < -LIVE_WINDOW_MIN) delta += 7 * 1440;
    if (delta > 7 * 1440 - LIVE_WINDOW_MIN) delta -= 7 * 1440;
    const candidate = { service: s, msUntil: delta * 60_000, isLive: delta <= 0 && delta > -LIVE_WINDOW_MIN };
    if (!best || candidate.isLive || (!best.isLive && candidate.msUntil < best.msUntil)) best = candidate;
  }
  return best!;
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
