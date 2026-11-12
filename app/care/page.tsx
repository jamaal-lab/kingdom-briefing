import type { Metadata } from "next";
import { HeartHandshake, Phone } from "lucide-react";
import { Form } from "@/components/Form";
import { Container, Display, Eyebrow, PageHero, Placeholder } from "@/components/ui";
import { crisisResources } from "@/content/care";
import { church } from "@/content/site";

export const metadata: Metadata = {
  title: "Care · Prayer & Support",
  description: "Request prayer, find grief support, and reach crisis resources. Fellowship Chicago cares for you.",
};

export default function Care() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Care"
        title={
          <>
            You don&rsquo;t have
            <br />
            to carry it alone
          </>
        }
        intro="Prayer, pastoral care and support for life's hardest seasons."
      />

      {/* Crisis first: most urgent need gets top placement */}
      <section aria-labelledby="crisis" className="border-b border-line bg-live/[0.07] py-12 sm:py-16">
        <Container>
          <h2 id="crisis" className="flex items-center gap-3 text-2xl font-semibold">
            <Phone aria-hidden="true" className="h-6 w-6 text-[#ff8a8a]" /> In crisis right now?
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {crisisResources.map((r) => (
              <li key={r.name} className="rounded-2xl border border-line bg-hull p-5">
                <p className="font-semibold">{r.name}</p>
                <p className="mt-1 text-sm text-tide">{r.detail}</p>
                <a href={r.href} className="mt-3 inline-block font-semibold text-foam underline underline-offset-4">
                  {r.action}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="prayer" aria-labelledby="prayer-h" className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Prayer</Eyebrow>
            <Display id="prayer-h" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
              Request prayer
            </Display>
            <p className="mt-5 text-lg text-foam/85">
              Share what&rsquo;s on your heart. Requests go to our pastoral care team and are kept confidential.
            </p>
          </div>
          <Form
            kind="prayer"
            submitLabel="Send prayer request"
            success={<p>We received your request and we&rsquo;re praying with you.</p>}
            fields={[
              { name: "firstName", label: "First name", required: true, autoComplete: "given-name", half: true },
              { name: "email", label: "Email (optional, for follow-up)", type: "email", autoComplete: "email", half: true },
              { name: "request", label: "Your prayer request", type: "textarea", required: true },
              { name: "contactMe", label: "I'd like a pastor to contact me", type: "checkbox" },
              { name: "private", label: "Keep this request private to the pastoral staff", type: "checkbox" },
            ]}
          />
        </Container>
      </section>

      <section id="grief" aria-labelledby="grief-h" className="border-t border-line bg-hull/50 py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <HeartHandshake aria-hidden="true" className="h-8 w-8 text-brass" />
            <Eyebrow className="mt-6">Grief &amp; bereavement</Eyebrow>
            <Display id="grief-h" className="mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
              Grief support
            </Display>
            <p className="mt-5 text-lg text-foam/85">
              If you&rsquo;ve lost someone, let us walk with you. For funeral arrangements and pastoral care, call the
              church office at{" "}
              <a href={church.phoneHref} className="font-semibold underline">
                {church.phone}
              </a>{" "}
              ({church.officeHours}).
            </p>
            <Placeholder label="Grief ministry" className="mt-6">
              Details on grief support groups or bereavement ministry to be supplied by the church.
            </Placeholder>
          </div>
          <Form
            kind="grief"
            submitLabel="Request a call"
            success={<p>Thank you. Someone from our care team will call you.</p>}
            fields={[
              { name: "name", label: "Your name", required: true, autoComplete: "name", half: true },
              { name: "phone", label: "Best phone number", type: "tel", required: true, autoComplete: "tel", half: true },
              { name: "note", label: "How can we help?", type: "textarea" },
            ]}
          />
        </Container>
      </section>
    </main>
  );
}
