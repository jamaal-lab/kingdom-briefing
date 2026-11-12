import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Users } from "lucide-react";
import { Form } from "@/components/Form";
import { Container, Display, Eyebrow, PageHero, Placeholder } from "@/components/ui";
import { TODO_COPY, getMinistry, ministries } from "@/content/ministries";

export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = getMinistry((await params).slug);
  return m ? { title: `${m.name} · Ministries`, description: m.summary } : {};
}

export default async function MinistryPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = getMinistry((await params).slug);
  if (!m) notFound();

  return (
    <main id="main">
      <PageHero eyebrow="Ministry" title={m.name} intro={m.summary}>
        <p className="mt-6">
          <Link href="/connect" className="text-sm font-semibold text-tide hover:text-foam">
            ← All ministries
          </Link>
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {m.description === TODO_COPY ? (
              <Placeholder label="Ministry description">{TODO_COPY}</Placeholder>
            ) : (
              <p className="text-lg leading-relaxed text-foam/85">{m.description}</p>
            )}
            <dl className="divide-y divide-line rounded-3xl border border-line bg-hull">
              {[
                { icon: User, k: "Leader", v: m.leader },
                { icon: Calendar, k: "Schedule", v: m.schedule },
                { icon: Users, k: "For", v: m.ageGroups.join(", ") },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex gap-4 p-5">
                  <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-bright" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-tide">{k}</dt>
                    <dd className="mt-1 font-medium">
                      {v ?? <span className="text-brass">To be confirmed by the church</span>}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div id="join" className="rounded-3xl border border-line bg-deep p-6 sm:p-8">
            <Eyebrow>Join this ministry</Eyebrow>
            <Display as="h2" className="mt-4 text-5xl">
              Count me in
            </Display>
            <p className="mt-3 text-foam/80">Leave your info and the ministry team will reach out with next steps.</p>
            <div className="mt-8">
              <Form
                kind="ministry"
                hidden={{ ministry: m.name }}
                submitLabel={`Join ${m.name}`}
                success={<p>You&rsquo;re on the list for {m.name}. Someone will be in touch soon.</p>}
                fields={[
                  { name: "name", label: "Full name", required: true, autoComplete: "name" },
                  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", half: true },
                  { name: "member", label: "I'm a member of Fellowship", type: "checkbox" },
                  { name: "note", label: "Anything you'd like the team to know?", type: "textarea" },
                ]}
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
