"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ageGroups, interests, ministries } from "@/content/ministries";

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...options].map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition ${
                on ? "border-foam bg-foam text-ink" : "border-line text-foam/85 hover:border-foam/60"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function MinistryFinder() {
  const [age, setAge] = useState("All");
  const [interest, setInterest] = useState("All");
  const reduce = useReducedMotion();

  const list = ministries.filter(
    (m) =>
      (age === "All" || m.ageGroups.includes(age as never) || m.ageGroups.includes("All Ages")) &&
      (interest === "All" || m.interests.includes(interest as never)),
  );

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Chips label="Who's it for" options={ageGroups.filter((a) => a !== "All Ages")} value={age} onChange={setAge} />
        <Chips label="Interest" options={interests} value={interest} onChange={setInterest} />
      </div>
      <p className="mt-8 text-sm text-tide" aria-live="polite">
        Showing {list.length} {list.length === 1 ? "ministry" : "ministries"}
      </p>
      <motion.ul layout={!reduce} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((m) => (
            <motion.li
              key={m.slug}
              layout={!reduce}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/connect/${m.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-hull p-6 transition hover:border-brand-bright/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl font-black uppercase leading-none">{m.name}</h3>
                  <ArrowUpRight aria-hidden="true" className="h-6 w-6 shrink-0 text-tide transition group-hover:text-foam" />
                </div>
                <p className="mt-3 text-foam/80">{m.summary}</p>
                <p className="mt-auto pt-5 text-xs font-medium uppercase tracking-[0.16em] text-tide">
                  {m.ageGroups.join(" · ")}
                </p>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && (
        <p className="mt-6 text-tide">
          Nothing matches yet.{" "}
          <button className="font-semibold text-foam underline" onClick={() => (setAge("All"), setInterest("All"))}>
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}
