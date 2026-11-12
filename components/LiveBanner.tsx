"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCountdown, getNextService, type NextService } from "@/lib/schedule";
import { Container } from "./ui";

/** Homepage strip: "Live Now" during a service, otherwise a countdown to the next one. */
export function LiveBanner() {
  const [next, setNext] = useState<NextService | null>(null);
  useEffect(() => {
    const tick = () => setNext(getNextService());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const c = next ? formatCountdown(next.msUntil) : null;
  const live = next?.isLive;

  return (
    <section
      aria-label="Livestream status"
      className={`border-y border-line ${live ? "bg-gradient-to-r from-live/25 via-hull to-hull" : "bg-hull"}`}
    >
      <Container className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
            {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />}
            <span className={`relative inline-flex h-3 w-3 rounded-full ${live ? "bg-live" : "bg-tide/50"}`} />
          </span>
          <p className="text-base sm:text-lg" aria-live="polite">
            {!next ? (
              <span className="text-tide">Checking the schedule…</span>
            ) : live ? (
              <>
                <strong className="font-semibold">Live now:</strong> {next.service.label}, {next.service.display}
              </>
            ) : (
              <>
                <span className="text-tide">Next livestream: </span>
                <strong className="font-semibold">
                  {next.service.day} {next.service.display}
                </strong>
                <span className="ml-3 font-display text-xl font-extrabold tabular-nums tracking-wide text-foam">
                  {c!.days}D {String(c!.hours).padStart(2, "0")}H {String(c!.minutes).padStart(2, "0")}M{" "}
                  <span className="text-tide">{String(c!.seconds).padStart(2, "0")}S</span>
                </span>
              </>
            )}
          </p>
        </div>
        <Link
          href="/watch"
          className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition ${
            live ? "bg-live text-white hover:brightness-110" : "border border-line text-foam hover:border-foam"
          }`}
        >
          {live ? "Watch live" : "Go to Watch"} <span className="sr-only">page</span>
        </Link>
      </Container>
    </section>
  );
}
