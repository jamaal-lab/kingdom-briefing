"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { youtube, social } from "@/content/site";
import type { Sermon } from "@/content/types";
import { formatCountdown, getNextService, type NextService } from "@/lib/schedule";
import { Container, Display, Eyebrow } from "./ui";

const bookOf = (ref?: string) => ref?.replace(/\s+\d.*$/, "").trim();

export function WatchClient({ sermons }: { sermons: Sermon[] }) {
  const [next, setNext] = useState<NextService | null>(null);
  const [playing, setPlaying] = useState<Sermon | "live" | null>(null);
  const [series, setSeries] = useState("All");
  const [book, setBook] = useState("All");
  const [q, setQ] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setNext(getNextService());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // During a service, default the player to the live stream.
  useEffect(() => {
    if (next?.isLive && playing === null) setPlaying("live");
  }, [next?.isLive, playing]);

  const seriesOpts = useMemo(() => ["All", ...new Set(sermons.map((s) => s.series).filter(Boolean) as string[])], [sermons]);
  const bookOpts = useMemo(
    () => ["All", ...new Set(sermons.map((s) => bookOf(s.scripture)).filter(Boolean) as string[])],
    [sermons],
  );
  const filtered = sermons.filter(
    (s) =>
      (series === "All" || s.series === series) &&
      (book === "All" || bookOf(s.scripture) === book) &&
      (!q || s.title.toLowerCase().includes(q.toLowerCase())),
  );

  const play = (s: Sermon) => {
    setPlaying(s);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const c = next ? formatCountdown(next.msUntil) : null;
  const src =
    playing === "live"
      ? `${youtube.liveEmbed}&autoplay=1`
      : playing
        ? `https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`
        : null;

  return (
    <>
      {/* Player */}
      <section aria-labelledby="player-h" className="pb-16 sm:pb-24">
        <Container>
          <h2 id="player-h" className="sr-only">
            Video player
          </h2>
          <div
            ref={playerRef}
            className="relative aspect-video overflow-hidden rounded-3xl border border-line bg-hull shadow-[0_40px_160px_-40px_rgba(31,86,184,0.7)]"
          >
            {src ? (
              <iframe
                key={src}
                title={playing === "live" ? "Fellowship Chicago live stream" : `Sermon: ${(playing as Sermon).title}`}
                src={src}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <div className="grain absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(80%_80%_at_50%_30%,#0f2240,#04070d)] p-6 text-center">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-tide sm:text-sm sm:tracking-[0.26em]">
                  Next livestream · {next ? `${next.service.day} ${next.service.display}` : "…"}
                </p>
                <p
                  className="mt-3 font-display text-[clamp(2.8rem,10vw,8rem)] font-black tabular-nums leading-none"
                  aria-live="off"
                >
                  {c ? (
                    <>
                      {c.days}
                      <span className="text-tide">d</span> {String(c.hours).padStart(2, "0")}
                      <span className="text-tide">h</span> {String(c.minutes).padStart(2, "0")}
                      <span className="text-tide">m</span> {String(c.seconds).padStart(2, "0")}
                      <span className="text-tide">s</span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {sermons[0] && (
                    <button
                      onClick={() => play(sermons[0])}
                      className="inline-flex min-h-12 items-center rounded-full bg-foam px-6 font-semibold text-ink"
                    >
                      Watch latest sermon
                    </button>
                  )}
                  <button
                    onClick={() => setPlaying("live")}
                    className="inline-flex min-h-12 items-center rounded-full border border-foam/30 px-6 font-semibold hover:border-foam"
                  >
                    Open live player
                  </button>
                </div>
              </div>
            )}
            {next?.isLive && (
              <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-live px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" /> Live now
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-tide">
            Also streaming on{" "}
            <a className="font-semibold text-foam underline" href={social.facebook}>
              Facebook
            </a>{" "}
            and{" "}
            <a className="font-semibold text-foam underline" href={youtube.channelUrl}>
              YouTube
            </a>
            . Tag your watch party with #TheVirtualShip.
          </p>
        </Container>
      </section>

      {/* Library */}
      <section id="library" aria-labelledby="library-h" className="border-t border-line py-16 sm:py-24">
        <Container>
          <Eyebrow>On demand</Eyebrow>
          <Display id="library-h" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
            Sermon library
          </Display>

          <div className="mt-8 grid gap-3 sm:grid-cols-[2fr_1fr_1fr]" role="search">
            <label className="relative block">
              <span className="sr-only">Search sermons</span>
              <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tide" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title"
                className="min-h-12 w-full rounded-full border border-line bg-hull pl-12 pr-4 text-foam placeholder:text-tide/70"
              />
            </label>
            <label className="block">
              <span className="sr-only">Filter by series</span>
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="min-h-12 w-full rounded-full border border-line bg-hull px-4 text-foam"
              >
                {seriesOpts.map((o) => (
                  <option key={o} value={o}>
                    {o === "All" ? "All series" : o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Filter by scripture</span>
              <select
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="min-h-12 w-full rounded-full border border-line bg-hull px-4 text-foam"
              >
                {bookOpts.map((o) => (
                  <option key={o} value={o}>
                    {o === "All" ? "All scripture" : o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {sermons.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-line bg-hull p-8">
              <p className="text-lg">The library loads the latest uploads from our YouTube channel.</p>
              <p className="mt-2 text-tide">
                It couldn&rsquo;t be reached just now. Browse every sermon on{" "}
                <a href={youtube.channelUrl} className="font-semibold text-foam underline">
                  YouTube
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <p className="mt-6 text-sm text-tide" aria-live="polite">
                {filtered.length} of {sermons.length} sermons
              </p>
              <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => play(s)} className="group block w-full text-left">
                      <span className="relative block aspect-video overflow-hidden rounded-2xl border border-line bg-hull">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.thumbnail}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </span>
                      <span className="mt-3 block text-lg font-semibold leading-snug group-hover:text-brand-bright">
                        {s.title}
                      </span>
                      <span className="mt-1 block text-sm text-tide">
                        {new Date(s.published).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {s.series && ` · ${s.series}`}
                        {s.scripture && ` · ${s.scripture}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <a href={youtube.channelUrl} className="mt-10 inline-block font-semibold text-foam underline-offset-4 hover:underline">
            Full archive on YouTube →
          </a>
        </Container>
      </section>
    </>
  );
}
