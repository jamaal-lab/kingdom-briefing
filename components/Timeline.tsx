"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/content/types";

function Entry({ e, onActive }: { e: TimelineEntry; onActive: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <li ref={ref} className="relative pb-20 pl-10 sm:pl-14 lg:min-h-[52vh] lg:pb-0">
      <span
        aria-hidden="true"
        className={`absolute left-[-7px] top-3 h-4 w-4 rounded-full border-2 transition-colors duration-500 ${
          inView ? "border-brass bg-brass" : "border-tide/50 bg-ink"
        }`}
      />
      <motion.div
        initial={{ opacity: 0.45, y: reduce ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-35% 0px -35% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Year is visible inline on mobile; desktop shows the big sticky year */}
        <p className="font-display text-6xl font-black leading-none text-brass lg:hidden">{e.year}</p>
        <p className="sr-only lg:not-sr-only lg:text-sm lg:font-semibold lg:uppercase lg:tracking-[0.24em] lg:text-tide">
          {e.year}
        </p>
        <h3 className="mt-3 max-w-xl font-display text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-[0.95]">
          {e.title}
        </h3>
        {e.body && <p className="mt-4 max-w-lg text-lg text-foam/80">{e.body}</p>}
        {e.image && (
          <div className="relative mt-6 aspect-[4/3] max-w-lg overflow-hidden rounded-2xl border border-line">
            <Image src={e.image} alt={e.imageAlt ?? ""} fill className="object-cover grayscale" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
        )}
      </motion.div>
    </li>
  );
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const [active, setActive] = useState(entries[0].year);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="hidden lg:block">
        <div className="sticky top-28" aria-hidden="true">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-tide">The voyage</p>
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display text-[clamp(8rem,17vw,16rem)] font-black leading-[0.85] tabular-nums text-foam"
          >
            {active}
          </motion.p>
          <p className="mt-4 text-tide">
            {active - 1950 === 0 ? "Year one" : `${active - 1950} years after the first service`}
          </p>
        </div>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-line" />
        <motion.div
          aria-hidden="true"
          style={{ scaleY }}
          className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-brass to-brand-bright"
        />
        <ol>
          {entries.map((e) => (
            <Entry key={e.year} e={e} onActive={() => setActive(e.year)} />
          ))}
        </ol>
      </div>
    </div>
  );
}
