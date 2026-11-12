import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { Container, Display, Eyebrow, PageHero, Placeholder } from "@/components/ui";
import { ShipMission } from "@/components/home";
import { leadership, logoMeaning, timeline } from "@/content/story";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "From Rev. Dr. Clay Evans in 1950 to Pastor Reginald W. Sharpe Jr. today: the history, legacy and leadership of Fellowship Chicago.",
};

const initials = (n: string) =>
  n
    .replace(/(Jr\.|III)/g, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !w.endsWith("."))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function OurStory() {
  const sharpe = leadership[0];
  return (
    <main id="main">
      <PageHero
        eyebrow="Our Story"
        title={
          <>
            {new Date().getFullYear() - 1950} years
            <br />
            <span className="font-serif text-[0.7em] font-normal normal-case italic text-brass">and still sailing.</span>
          </>
        }
        intro="Fellowship began in 1950 with Rev. Dr. Clay Evans. Five generations later, it is still a family sharing the Gospel through acts of love and generosity."
      />

      {/* Clay Evans */}
      <section id="clay-evans" aria-labelledby="clay-h" className="py-16 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-deep to-ink">
              <p
                aria-hidden="true"
                className="absolute inset-x-0 bottom-6 text-center font-display text-[8rem] font-black leading-none text-foam/[0.05]"
              >
                1950
              </p>
              <Placeholder label="Archive portrait" className="absolute left-4 right-4 top-4">
                Portrait of Rev. Dr. Clay Evans from the church archive.
              </Placeholder>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>The founder</Eyebrow>
            <Display id="clay-h" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
              Rev. Dr. Clay Evans
            </Display>
            <p className="mt-6 text-lg leading-relaxed text-foam/85">
              Rev. Evans founded the church in 1950 as Mount Carmel Missionary Baptist Church. Over the next fifty years
              he built it into Fellowship: a radio and television ministry, gospel recordings, a credit union, and the
              building at 45th &amp; Princeton. He retired in 2000.
            </p>
            <Placeholder label="Biography" className="mt-6">
              Full biography to be imported from the church&rsquo;s &ldquo;Meet Reverend Clay&rdquo; page.
            </Placeholder>
          </Reveal>
        </Container>
      </section>

      {/* Civil rights */}
      <section id="civil-rights" aria-labelledby="cr-h" className="relative overflow-hidden border-y border-line bg-deep py-16 sm:py-28">
        <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-brand/25 blur-[140px]" />
        <Container className="relative">
          <Eyebrow>A pulpit for freedom</Eyebrow>
          <Display id="cr-h" className="mt-5 max-w-5xl text-[clamp(2.8rem,8vw,7rem)]">
            Faith and freedom
          </Display>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <p className="font-serif text-3xl italic leading-snug text-foam sm:text-4xl">
                In 1965, Jesse Jackson Sr. was ordained at Fellowship.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Placeholder label="Civil rights history">
                The church&rsquo;s civil rights history will be written from its own history pages and approved by the
                church before publishing. Nothing beyond the verified timeline has been added.
              </Placeholder>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section id="timeline" aria-labelledby="tl-h" className="py-16 sm:py-28">
        <Container>
          <Eyebrow>1950 to today</Eyebrow>
          <Display id="tl-h" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
            The voyage
          </Display>
          <div className="mt-14 lg:mt-20">
            <Timeline entries={timeline} />
          </div>
        </Container>
      </section>

      {/* Logo */}
      <section id="logo" aria-labelledby="logo-h" className="border-t border-line bg-hull/50 py-16 sm:py-28">
        <Container>
          <Eyebrow>Our mark</Eyebrow>
          <Display id="logo-h" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
            What the logo means
          </Display>
          <Placeholder label="Logo artwork" className="mt-8 max-w-xl">
            The Fellowship logo mark goes here; the download was blocked in the build environment.
          </Placeholder>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {logoMeaning.map((l, i) => (
              <Reveal as="li" key={l.symbol} delay={i * 0.07} className="rounded-3xl border border-line bg-hull p-7">
                <span className="font-display text-5xl font-black text-brass">0{i + 1}</span>
                <h3 className="mt-5 font-display text-3xl font-black uppercase leading-none">{l.symbol}</h3>
                <p className="mt-3 text-lg text-foam/80">{l.meaning}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <div id="mission">
        <ShipMission />
      </div>

      {/* Beliefs & values */}
      <section aria-label="Beliefs and core values" className="py-16 sm:py-24">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div id="beliefs" className="rounded-3xl border border-line bg-hull p-8">
            <h2 className="font-display text-5xl font-black uppercase">Our beliefs</h2>
            <Placeholder label="Statement of faith" className="mt-6">
              To be imported verbatim from the church&rsquo;s &ldquo;Our Beliefs&rdquo; page.
            </Placeholder>
          </div>
          <div id="values" className="rounded-3xl border border-line bg-hull p-8">
            <h2 className="font-display text-5xl font-black uppercase">Core values</h2>
            <Placeholder label="Core values" className="mt-6">
              To be imported verbatim from the church&rsquo;s &ldquo;Our Core Values&rdquo; page.
            </Placeholder>
          </div>
        </Container>
      </section>

      {/* Leadership */}
      <section id="leadership" aria-labelledby="lead-h" className="border-t border-line py-16 sm:py-28">
        <Container>
          <Eyebrow>Leadership</Eyebrow>
          <Display id="lead-h" className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">
            The crew
          </Display>

          <div className="mt-12 grid gap-10 rounded-3xl border border-line bg-gradient-to-br from-deep to-hull p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink">
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-display text-9xl font-black text-foam/10"
              >
                RS
              </span>
              <Placeholder label="Photo" className="absolute bottom-4 left-4 right-4">
                Pastor Sharpe&rsquo;s full-size photo, once downloaded and verified.
              </Placeholder>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brass">Third Pastor · Since 2019</p>
              <h3 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.9]">
                {sharpe.name}
              </h3>
              <p className="mt-2 text-xl text-tide">{sharpe.role}</p>
              <p className="mt-6 text-lg text-foam/85">
                Named Pastor in 2019, Rev. Sharpe is the third pastor of Fellowship, after Rev. Dr. Clay Evans and Pastor
                Charles Jenkins. He serves alongside First Lady Brianna Sharpe.
              </p>
              <Placeholder label="Bio" className="mt-6">
                Pastor Sharpe&rsquo;s biography to be supplied by the church.
              </Placeholder>
            </div>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {leadership.slice(1).map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 4) * 0.05}>
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-line bg-hull">
                  <span aria-hidden="true" className="font-display text-6xl font-black text-foam/15">
                    {initials(p.name)}
                  </span>
                  <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brass">
                    Photo pending
                  </span>
                </div>
                <p className="mt-3 font-semibold leading-snug">{p.name}</p>
                <p className="text-sm text-tide">{p.role}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
