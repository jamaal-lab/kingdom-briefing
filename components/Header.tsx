"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { giving } from "@/content/site";

export const doors = [
  { href: "/im-new", label: "I'm New" },
  { href: "/watch", label: "Watch" },
  { href: "/connect", label: "Get Connected" },
  { href: "/our-story", label: "Our Story" },
  { href: "/give", label: "Give" },
];

/** TODO(asset): swap the text wordmark for /public/brand/white-anchor-logo.png once downloaded. */
function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-xl font-black uppercase tracking-wide text-foam sm:text-2xl">
        Fellowship
      </span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-tide">Chicago</span>
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Fellowship Chicago home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {doors.slice(0, 4).map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foam/85 transition hover:bg-foam/10 hover:text-foam"
                >
                  {d.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/events" className="rounded-full px-4 py-2 text-sm font-medium text-foam/85 hover:bg-foam/10 hover:text-foam">
                Events
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={giving.primary.url}
            className="hidden min-h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-foam transition hover:bg-brand-bright sm:inline-flex"
          >
            Give
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-foam lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="h-[calc(100svh-4rem)] overflow-y-auto px-5 pb-10 pt-6 sm:px-8 lg:hidden"
          >
            <ul className="space-y-1">
              {[...doors, { href: "/events", label: "Events" }, { href: "/care", label: "Care" }, { href: "/contact", label: "Contact" }].map(
                (d) => (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 font-display text-4xl font-extrabold uppercase text-foam"
                    >
                      {d.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
