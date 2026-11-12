import type { Metadata } from "next";
import { CalendarPlus, MapPin } from "lucide-react";
import { Container, PageHero, Placeholder } from "@/components/ui";
import { events } from "@/content/events";
import { church } from "@/content/site";
import { fmtDate, fmtDay, fmtMonth, fmtTime, upcoming } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming services and events at Fellowship Chicago.",
};
export const revalidate = 3600;

/** Google Calendar "add" link: no API key needed. */
function gcal(title: string, start: Date) {
  const end = new Date(start.getTime() + 90 * 60_000);
  const f = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${title} · ${church.shortName}`,
    dates: `${f(start)}/${f(end)}`,
    location: `${church.address.street}, ${church.address.city}, ${church.address.state}`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export default function Events() {
  const items = upcoming(12);
  return (
    <main id="main">
      <PageHero eyebrow="Events" title="What's happening" intro="Services and gatherings at 45th & Princeton." />
      <section className="py-14 sm:py-20">
        <Container>
          {events.length === 0 && (
            <Placeholder label="Special events" className="mb-10">
              No special events entered yet. Staff add them as text in <code>content/events.ts</code> (title, date,
              summary, link), replacing the image-only flyers. Upcoming services below come from the real weekly schedule.
            </Placeholder>
          )}
          <ol className="divide-y divide-line border-y border-line">
            {items.map((e) => (
              <li key={e.key} id={e.key} className="grid gap-4 py-7 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:gap-8">
                <time dateTime={e.date.toISOString()} className="flex items-baseline gap-3 sm:block">
                  <span className="font-display text-6xl font-black leading-none">{fmtDate(e.date)}</span>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-tide sm:mt-1 sm:block">
                    {fmtMonth(e.date)} · {fmtDay(e.date)}
                  </span>
                </time>
                <div>
                  <h2 className="text-2xl font-semibold">{e.title}</h2>
                  <p className="mt-1 font-medium text-brand-bright">{fmtTime(e.date)}</p>
                  <p className="mt-2 text-tide">{e.summary}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-tide">
                    <MapPin size={14} aria-hidden="true" /> {e.location ?? church.address.street}
                  </p>
                </div>
                <a
                  href={gcal(e.title, e.date)}
                  className="inline-flex min-h-11 items-center gap-2 justify-self-start rounded-full border border-line px-4 text-sm font-semibold hover:border-foam"
                >
                  <CalendarPlus size={16} aria-hidden="true" /> Add to calendar
                  <span className="sr-only">: {e.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </main>
  );
}
