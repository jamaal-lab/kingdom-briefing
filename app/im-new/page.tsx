import type { Metadata } from "next";
import { Baby, Car, Clock, MapPin, Video } from "lucide-react";
import { Form } from "@/components/Form";
import { Reveal } from "@/components/Reveal";
import { Container, Display, Eyebrow, PageHero, Placeholder } from "@/components/ui";
import { church, fullAddress, mapsUrl, serviceTimes } from "@/content/site";

export const metadata: Metadata = {
  title: "I'm New · Plan Your Visit",
  description: "Plan your first visit to Fellowship Chicago: Sunday service times, parking, Kidz Zone, and what to expect.",
};

const sundayOptions = serviceTimes.filter((s) => s.day === "Sunday").map((s) => s.display);

export default function ImNew() {
  return (
    <main id="main">
      <PageHero
        eyebrow="I'm New"
        title={
          <>
            Your first
            <br />
            Sunday aboard
          </>
        }
        intro="Whether you've been in church your whole life or never set foot in one, there's a seat for you at The Ship. Here's everything you need before you arrive."
      />

      {/* Welcome video */}
      <section aria-labelledby="welcome" className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <Reveal>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-deep to-hull">
              <Video aria-hidden="true" className="h-14 w-14 text-tide/60" />
              <Placeholder label="Pastor welcome video" className="absolute bottom-4 left-4 right-4">
                A short welcome from Pastor Sharpe goes here. Supply a YouTube link or an MP4.
              </Placeholder>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>A word from our pastor</Eyebrow>
            <h2 id="welcome" className="mt-5 font-display text-5xl font-black uppercase leading-none">
              Welcome home
            </h2>
            <Placeholder label="Pastor quote" className="mt-6">
              Welcome message from Pastor Reginald W. Sharpe Jr. to be supplied by the church. No quote has
              been written on his behalf.
            </Placeholder>
            <p className="mt-6 font-medium">Reginald W. Sharpe Jr.</p>
            <p className="text-tide">Senior Pastor</p>
          </Reveal>
        </Container>
      </section>

      {/* Times + location */}
      <section aria-labelledby="when" className="border-y border-line bg-hull/50 py-16 sm:py-24">
        <Container>
          <Eyebrow>When &amp; where</Eyebrow>
          <Display id="when" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
            Service times
          </Display>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceTimes.map((s) => (
              <li key={s.id} className="rounded-3xl border border-line bg-hull p-6">
                <Clock aria-hidden="true" className="h-6 w-6 text-brand-bright" />
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-tide">{s.day}</p>
                <p className="font-display text-5xl font-black">{s.display}</p>
                <p className="mt-2 font-medium">{s.label}</p>
                {s.note && <p className="mt-1 text-sm text-tide">{s.note}</p>}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-hull p-7">
              <MapPin aria-hidden="true" className="h-6 w-6 text-brand-bright" />
              <h3 className="mt-4 text-2xl font-semibold">Find us</h3>
              <p className="mt-2 text-lg">{fullAddress}</p>
              <a href={mapsUrl} className="mt-5 inline-block font-semibold text-brand-bright hover:underline">
                Get directions →
              </a>
            </div>
            <div className="rounded-3xl border border-line bg-hull p-7">
              <Car aria-hidden="true" className="h-6 w-6 text-brand-bright" />
              <h3 className="mt-4 text-2xl font-semibold">Parking</h3>
              <Placeholder label="Parking details" className="mt-4">
                Lot location, overflow and accessible parking, and greeters to be confirmed by the church.
              </Placeholder>
            </div>
          </div>
        </Container>
      </section>

      {/* Kids + what to expect */}
      <section aria-labelledby="expect" className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>For your family</Eyebrow>
            <Display id="kids" as="h2" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
              Kidz Zone
            </Display>
            <div className="mt-6 rounded-3xl border border-line bg-hull p-7">
              <Baby aria-hidden="true" className="h-6 w-6 text-brand-bright" />
              <p className="mt-4 text-lg">
                Kidz Zone and our youth ministry meet <strong>Sundays at 10:45 AM</strong>, during the main service.
              </p>
              <Placeholder label="Nursery & check-in" className="mt-5">
                Nursery ages, check-in process and safety policy to be confirmed by the church.
              </Placeholder>
            </div>
          </div>
          <div>
            <Eyebrow>What to expect</Eyebrow>
            <Display id="expect" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
              First-time FAQ
            </Display>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {[
                ["Which service should I attend?", "All three Sunday services are open to everyone. If you're bringing kids, 10:45 AM is when Kidz Zone and youth meet."],
                ["Can I watch first?", `Yes. Every service streams live on YouTube and Facebook (${church.hashtag}). Visit the Watch page.`],
                ["How long is service?", null],
                ["What should I wear?", null],
                ["Is the building accessible?", null],
              ].map(([q, a]) => (
                <div key={q as string} className="py-5">
                  <dt className="text-lg font-semibold">{q}</dt>
                  <dd className="mt-2 text-tide">
                    {a ?? <span className="text-brass">Placeholder: answer to be supplied by the church.</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Plan a visit form */}
      <section id="plan" aria-labelledby="plan-h" className="border-t border-line bg-deep py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Let us know you&rsquo;re coming</Eyebrow>
            <Display id="plan-h" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
              Plan your visit
            </Display>
            <p className="mt-5 text-lg text-foam/85">
              Tell us when you&rsquo;re coming and we&rsquo;ll have someone ready to welcome you, help with parking,
              and get your kids checked in.
            </p>
          </div>
          <Form
            kind="visit"
            submitLabel="Plan my visit"
            success={<p>Thank you! We can&rsquo;t wait to welcome you aboard. Someone from our team will be in touch.</p>}
            fields={[
              { name: "firstName", label: "First name", required: true, autoComplete: "given-name", half: true },
              { name: "lastName", label: "Last name", autoComplete: "family-name", half: true },
              { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
              { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", half: true },
              { name: "date", label: "Sunday you plan to visit", type: "date", required: true, half: true },
              { name: "service", label: "Service", type: "select", options: sundayOptions, half: true },
              { name: "adults", label: "Adults", type: "number", half: true },
              { name: "kids", label: "Children", type: "number", half: true },
              { name: "kidAges", label: "Children's ages", hint: "Helps us prepare Kidz Zone." },
              { name: "questions", label: "Anything we should know?", type: "textarea" },
            ]}
          />
        </Container>
      </section>
    </main>
  );
}
