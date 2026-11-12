import Link from "next/link";
import { church, fullAddress, giving, mapsUrl, serviceTimes, social } from "@/content/site";
import { Container } from "./ui";

const cols = [
  {
    title: "Visit",
    links: [
      { href: "/im-new", label: "Plan a Visit" },
      { href: "/events", label: "Events" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Grow",
    links: [
      { href: "/watch", label: "Watch & Sermons" },
      { href: "/connect", label: "Ministries" },
      { href: "/care", label: "Care & Prayer" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/our-story", label: "Our Story" },
      { href: "/our-story#leadership", label: "Leadership" },
      { href: "/give", label: "Give" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-hull">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            {/* TODO(asset): replace with white anchor logo */}
            <p className="font-display text-5xl font-black uppercase leading-none sm:text-6xl">Fellowship</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.42em] text-tide">Chicago · Since 1950</p>
            <address className="mt-8 space-y-1 not-italic text-foam/85">
              <a href={mapsUrl} className="block hover:text-foam hover:underline">
                {fullAddress}
              </a>
              <a href={church.phoneHref} className="block hover:text-foam hover:underline">
                {church.phone}
              </a>
              <p className="text-tide">Office: {church.officeHours}</p>
            </address>
            <ul className="mt-6 flex gap-3" aria-label="Social media">
              {[
                ["Facebook", social.facebook],
                ["Instagram", social.instagram],
                ["YouTube", social.youtube],
              ].map(([n, u]) => (
                <li key={n}>
                  <a
                    href={u}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium text-foam/85 hover:border-foam hover:text-foam"
                  >
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">{c.title}</h2>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-foam/85 hover:text-foam hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Worship</h2>
              <ul className="mt-4 space-y-3 text-foam/85">
                {serviceTimes.map((s) => (
                  <li key={s.id}>
                    {s.day.slice(0, 3)} {s.display}
                    {s.seasonal && <span className="text-tide"> · seasonal</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-sm text-tide sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {church.name}. Senior Pastor {church.seniorPastor}
          </p>
          <a href={giving.primary.url} className="font-semibold text-foam hover:underline">
            Give securely with ShelbyGiving →
          </a>
        </div>
      </Container>
    </footer>
  );
}
