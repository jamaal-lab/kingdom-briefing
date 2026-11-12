import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { Form } from "@/components/Form";
import { Container, PageHero } from "@/components/ui";
import { church, fullAddress, mapsUrl, social } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Fellowship Chicago at ${fullAddress}. Call ${church.phone}.`,
};

export default function Contact() {
  return (
    <main id="main">
      <PageHero eyebrow="Contact" title="Get in touch" intro="We'd love to hear from you." />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            {[
              { icon: MapPin, k: "Visit", v: <a href={mapsUrl} className="hover:underline">{fullAddress}</a> },
              { icon: Phone, k: "Call", v: <a href={church.phoneHref} className="hover:underline">{church.phone}</a> },
              { icon: Clock, k: "Office hours", v: church.officeHours },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex gap-4 rounded-3xl border border-line bg-hull p-6">
                <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-brand-bright" />
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">{k}</h2>
                  <p className="mt-1 text-lg">{v}</p>
                </div>
              </div>
            ))}
            <p className="pt-2 text-tide">
              Follow along on{" "}
              <a href={social.facebook} className="font-semibold text-foam underline">Facebook</a>,{" "}
              <a href={social.instagram} className="font-semibold text-foam underline">Instagram</a> and{" "}
              <a href={social.youtube} className="font-semibold text-foam underline">YouTube</a>.
            </p>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-line">
              <iframe
                title={`Map to ${church.shortName}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                loading="lazy"
                className="h-full w-full border-0 grayscale invert-[0.9] hue-rotate-180"
              />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-deep p-6 sm:p-8">
            <h2 className="font-display text-5xl font-black uppercase">Send a message</h2>
            <div className="mt-8">
              <Form
                kind="contact"
                submitLabel="Send message"
                success={<p>Thanks for reaching out. The church office will reply during office hours.</p>}
                fields={[
                  { name: "name", label: "Name", required: true, autoComplete: "name", half: true },
                  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", half: true },
                  {
                    name: "topic",
                    label: "Topic",
                    type: "select",
                    half: true,
                    options: ["General question", "Membership", "Weddings & funerals", "Media & livestream", "Other"],
                  },
                  { name: "message", label: "Message", type: "textarea", required: true },
                ]}
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
