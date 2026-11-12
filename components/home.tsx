import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { church, giving, youtube } from "@/content/site";
import { mission } from "@/content/story";
import { getLatestSermons } from "@/lib/youtube";
import { fmtDate, fmtDay, fmtMonth, fmtTime, upcoming } from "@/lib/events";
import { Reveal } from "./Reveal";
import { Button, Container, Display, Eyebrow } from "./ui";

/* ---------- This week's sermon ---------- */
export async function ThisWeek() {
  const [latest] = await getLatestSermons();
  const src = latest
    ? `https://www.youtube-nocookie.com/embed/${latest.id}?rel=0`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${youtube.uploadsPlaylist}&rel=0`;
  return (
    <section aria-labelledby="this-week" className="py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center lg:gap-16">
        <Reveal>
          <Eyebrow>This week&rsquo;s message</Eyebrow>
          <Display id="this-week" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
            {latest ? latest.title : "Catch the latest sermon"}
          </Display>
          {latest && (
            <p className="mt-4 text-tide">
              {new Date(latest.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })}
              {latest.scripture && <> · {latest.scripture}</>}
            </p>
          )}
          <p className="mt-5 max-w-md text-lg text-foam/85">
            Missed Sunday, or want to hear it again? Every message is in the sermon library.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/watch#library">Sermon library</Button>
            <Button href={youtube.channelUrl} variant="outline">
              YouTube <ArrowUpRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-line bg-hull shadow-[0_40px_120px_-40px_rgba(31,86,184,0.6)]">
            <div className="absolute inset-0 flex items-center justify-center text-tide" aria-hidden="true">
              <Play size={48} />
            </div>
            <iframe
              title={latest ? `Sermon: ${latest.title}` : "Latest sermons from Fellowship Chicago"}
              src={src}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="relative h-full w-full border-0"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------- Upcoming events ---------- */
export function Upcoming() {
  const items = upcoming(4);
  return (
    <section aria-labelledby="upcoming" className="border-t border-line bg-hull/40 py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>On deck</Eyebrow>
            <Display id="upcoming" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
              Upcoming
            </Display>
          </div>
          <Link href="/events" className="font-semibold text-foam underline-offset-4 hover:underline">
            All events →
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((e, i) => (
            <Reveal as="li" key={e.key} delay={i * 0.06}>
              <article className="group flex h-full flex-col rounded-3xl border border-line bg-hull p-6 transition hover:-translate-y-1 hover:border-brand-bright/50">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-6xl font-black leading-none">{fmtDate(e.date)}</span>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-tide">
                    {fmtMonth(e.date)}
                    <br />
                    {fmtDay(e.date)}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{e.title}</h3>
                <p className="mt-1 text-sm font-medium text-brand-bright">{fmtTime(e.date)}</p>
                <p className="mt-3 text-tide">{e.summary}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- Five doors ---------- */
const DOORS = [
  { n: "01", href: "/im-new", title: "I'm New", line: "Plan your first visit: times, parking, kids, and what to expect." },
  { n: "02", href: "/watch", title: "Watch", line: "Livestream, sermon library, Refuel, and music." },
  { n: "03", href: "/connect", title: "Get Connected", line: "Find a ministry that fits your age and calling." },
  { n: "04", href: "/our-story", title: "Our Story", line: "From Clay Evans in 1950 to The Ship today." },
  { n: "05", href: "/give", title: "Give", line: "Fuel the mission through ShelbyGiving and more." },
];

export function FiveDoors() {
  return (
    <section aria-labelledby="doors" className="py-20 sm:py-28">
      <Container>
        <Eyebrow>Find your way aboard</Eyebrow>
        <Display id="doors" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
          Five doors in
        </Display>
        <ul className="mt-12 border-t border-line">
          {DOORS.map((d, i) => (
            <Reveal as="li" key={d.href} delay={i * 0.05} className="border-b border-line">
              <Link
                href={d.href}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:gap-10 sm:py-8"
              >
                <span className="font-display text-lg font-bold text-tide">{d.n}</span>
                <span>
                  <span className="block font-display text-[clamp(2.4rem,7vw,6rem)] font-black uppercase leading-[0.9] transition-colors group-hover:text-brand-bright">
                    {d.title}
                  </span>
                  <span className="mt-2 block max-w-xl text-tide">{d.line}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-8 w-8 text-tide transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foam sm:h-12 sm:w-12"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- T.H.E. S.H.I.P. ---------- */
export function ShipMission() {
  return (
    <section aria-labelledby="mission" className="relative overflow-hidden border-y border-line bg-deep py-20 sm:py-28">
      <div aria-hidden="true" className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-brand/30 blur-[140px]" />
      <Container className="relative">
        <Eyebrow>Our mission</Eyebrow>
        <h2 id="mission" className="mt-5">
          <span className="sr-only">T.H.E. S.H.I.P. mission</span>
          <span aria-hidden="true" className="block font-display text-[clamp(3.6rem,13vw,12rem)] font-black leading-[0.85] tracking-tight">
            T.H.E.{" "}
            <span className="text-brand-bright">S.H.I.P.</span>
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-xl text-foam/85">
          Our vision: <em className="font-serif text-2xl text-brass">{church.vision}</em>
        </p>
        <ol className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-7">
          {mission.map((m, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="bg-deep p-5 last:col-span-2 sm:p-6 lg:last:col-span-1">
              <span aria-hidden="true" className="font-display text-7xl font-black leading-none text-brand-bright">
                {m.letter}
              </span>
              <span className="mt-3 block font-medium">{m.word}</span>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------- Community impact ---------- */
const IMPACT = [
  {
    href: "/connect/food-giveaway",
    title: "Food Giveaway",
    line: "Groceries for families across our community.",
  },
  {
    href: "/connect/community-table",
    title: "Community Table",
    line: "Shared meals and a seat at the table for our neighbors.",
  },
  {
    href: "/connect/social-justice",
    title: "Social Justice",
    line: "Carrying forward Fellowship's civil rights legacy in our city today.",
  },
];

export function CommunityImpact() {
  return (
    <section aria-labelledby="impact" className="py-20 sm:py-28">
      <Container>
        <Eyebrow>Love in action</Eyebrow>
        <Display id="impact" className="mt-5 max-w-4xl text-[clamp(2.8rem,7vw,5.5rem)]">
          Gospel you can see
        </Display>
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {IMPACT.map((c, i) => (
            <Reveal as="li" key={c.href} delay={i * 0.08}>
              <Link
                href={c.href}
                className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-deep to-hull p-7 transition hover:border-brand-bright/50"
              >
                {/* TODO(asset): ministry photo as background when supplied */}
                <span aria-hidden="true" className="absolute right-6 top-4 font-display text-[9rem] font-black leading-none text-foam/[0.04]">
                  0{i + 1}
                </span>
                <h3 className="font-display text-5xl font-black uppercase leading-none">{c.title}</h3>
                <p className="mt-3 max-w-sm text-foam/80">{c.line}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-bright">
                  Serve with us <ArrowUpRight size={18} aria-hidden="true" className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- Legacy teaser ---------- */
export function LegacyTeaser() {
  return (
    <section aria-labelledby="legacy" className="relative overflow-hidden border-t border-line py-24 sm:py-36">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <Reveal>
          <p
            aria-hidden="true"
            className="font-display text-[clamp(8rem,30vw,24rem)] font-black leading-[0.8] text-transparent [-webkit-text-stroke:2px_rgba(214,178,106,0.7)]"
          >
            1950
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>Our legacy</Eyebrow>
          <h2 id="legacy" className="mt-5 font-serif text-[clamp(2.4rem,5vw,4rem)] italic leading-[1.05]">
            Five generations of faith on the South Side.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foam/85">
            Founded by Rev. Dr. Clay Evans in 1950. Home to radio and TV broadcasts, gospel recordings, five Stellar
            Awards, and the 1965 ordination of Jesse Jackson Sr. Today the voyage continues under its third pastor,
            Reginald W. Sharpe Jr.
          </p>
          <Button href="/our-story" className="mt-8">
            Read our story
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------- Give ---------- */
export function GiveBand() {
  return (
    <section aria-labelledby="give" className="relative overflow-hidden bg-brand py-20 sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_120%_at_100%_0%,rgba(255,255,255,0.18),transparent_60%)]" />
      <Container className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foam/80">Generosity</p>
          <Display id="give" className="mt-5 text-[clamp(3rem,9vw,7.5rem)]">
            Fuel the mission
          </Display>
          <p className="mt-5 max-w-xl text-lg text-foam/90">
            Your giving keeps the doors open, the tables full, and the Gospel going out from 45th &amp; Princeton.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={giving.primary.url} className="min-h-14 px-9 text-lg">
            Give now
          </Button>
          <Button href="/give" variant="outline" className="min-h-14 border-foam/50">
            Other ways to give
          </Button>
        </div>
      </Container>
    </section>
  );
}
