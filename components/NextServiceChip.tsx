"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCountdown, getNextService, type NextService } from "@/lib/schedule";

/** Small live / countdown indicator. Renders nothing until mounted (avoids SSR clock mismatch). */
export function NextServiceChip() {
  const [next, setNext] = useState<NextService | null>(null);

  useEffect(() => {
    const tick = () => setNext(getNextService());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!next) return <span className="h-6" aria-hidden="true" />;

  if (next.isLive) {
    return (
      <Link
        href="/watch"
        className="inline-flex items-center gap-2 rounded-full bg-live/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ff8a8a]"
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
        </span>
        Live now
      </Link>
    );
  }

  const c = formatCountdown(next.msUntil);
  const label = c.days > 0 ? `${c.days}d ${c.hours}h` : c.hours > 0 ? `${c.hours}h ${c.minutes}m` : `${c.minutes}m`;
  return (
    <span className="text-xs font-medium text-tide">
      Next in <span className="font-semibold text-foam tabular-nums">{label}</span>
    </span>
  );
}
