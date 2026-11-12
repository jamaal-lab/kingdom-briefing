"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { church, serviceTimes, youtube } from "@/content/site";
import { NextServiceChip } from "./NextServiceChip";

const sunday = serviceTimes.filter((s) => s.day === "Sunday");

/**
 * Cinematic full-screen hero.
 * Background: muted YouTube embed of the channel's uploads until real hero
 * footage is supplied (drop /public/media/hero.mp4 and set HERO_VIDEO below).
 */
const HERO_VIDEO: string | null = null; // e.g. "/media/hero.mp4"

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [bgReady, setBgReady] = useState(false);
  const [loadBg, setLoadBg] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  // Defer the third-party embed until after first paint; skip it for reduced motion.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setLoadBg(true), 600);
    return () => clearTimeout(t);
  }, [reduce]);

  const ytSrc =
    `https://www.youtube-nocookie.com/embed/videoseries?list=${youtube.uploadsPlaylist}` +
    `&autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3`;

  const line = {
    hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
    show: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: { duration: reduce ? 0.2 : 1.1, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <section
      ref={ref}
      aria-label="Welcome"
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      {/* Background layer */}
      <motion.div style={{ y }} className="absolute inset-0 -z-20" aria-hidden="true">
        {/* Light-on-water fallback that also shows while the video loads */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_10%,#1f56b8_0%,#0a1424_45%,#04070d_80%)]" />
        <div className="absolute inset-0 animate-[drift_18s_ease-in-out_infinite_alternate] bg-[radial-gradient(60%_40%_at_20%_80%,rgba(77,134,239,0.35),transparent_70%)]" />

        {HERO_VIDEO ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO}
            autoPlay={!reduce}
            muted
            loop
            playsInline
            onCanPlay={() => setBgReady(true)}
          />
        ) : (
          loadBg && (
            <div
              className={`absolute inset-0 transition-opacity duration-[2000ms] ${bgReady ? "opacity-60" : "opacity-0"}`}
            >
              {/* Oversized iframe so the 16:9 video covers any viewport */}
              <iframe
                title="Worship at Fellowship Chicago (background video, muted)"
                src={ytSrc}
                tabIndex={-1}
                allow="autoplay; encrypted-media; picture-in-picture"
                onLoad={() => setTimeout(() => setBgReady(true), 1200)}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
              />
            </div>
          )
        )}
        {/* Scrims: keep text AA over any frame */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto w-full max-w-[1600px] px-5 pb-6 pt-24 sm:px-8 sm:pb-10 sm:pt-32 md:pb-14 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-tide sm:mb-5 sm:text-sm sm:tracking-[0.28em]"
        >
          <span>Since {church.founded}</span>
          <span aria-hidden="true" className="h-px w-8 bg-brass" />
          <span>45th &amp; Princeton<span className="hidden sm:inline"> · Chicago</span></span>
        </motion.p>

        <h1 className="font-display text-[clamp(3.4rem,14vw,12.5rem)] font-black uppercase leading-[0.84] tracking-[-0.01em] text-foam">
          {["Welcome", "aboard"].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.04em]">
              <motion.span className="block" custom={i} variants={line} initial="hidden" animate="show">
                {w}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block font-serif text-[0.62em] font-normal normal-case italic leading-[1] tracking-normal text-brass"
              custom={2}
              variants={line}
              initial="hidden"
              animate="show"
            >
              The Ship.
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 grid gap-5 sm:mt-8 sm:gap-8 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div className="max-w-xl">
            <p className="text-base leading-relaxed text-foam/90 sm:text-xl">
              Five generations of faith on Chicago&rsquo;s South Side. One family, sharing the Gospel through
              acts of love and generosity.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:flex">
              <Link
                href="/im-new"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-foam px-4 sm:px-7 text-base font-semibold text-ink transition hover:bg-white hover:shadow-[0_0_40px_rgba(244,247,252,0.35)]"
              >
                Plan Your Visit
              </Link>
              <Link
                href="/watch"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-foam/30 px-4 sm:px-7 text-base font-semibold text-foam backdrop-blur-sm transition hover:border-foam hover:bg-foam/10"
              >
                Watch Online
              </Link>
            </div>
          </div>

          {/* Service times — above the fold on every viewport */}
          <div className="rounded-2xl border border-line bg-hull/60 p-4 backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Sunday Worship</h2>
              <NextServiceChip />
            </div>
            <ul className="mt-3 grid grid-cols-3 sm:mt-4 divide-x divide-line">
              {sunday.map((s) => (
                <li key={s.id} className="px-3 first:pl-0 last:pr-0 sm:px-5">
                  <span className="block font-display text-3xl font-extrabold leading-none text-foam sm:text-4xl">
                    {s.display.replace(/ (AM|PM)/, "")}
                    <span className="ml-1 text-sm font-semibold text-tide">{s.display.slice(-2)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.8rem] text-tide sm:mt-4 sm:text-sm">
              Kidz Zone &amp; youth at 10:45 · Refuel Tuesdays 7 PM <span className="text-tide/70">(seasonal)</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
