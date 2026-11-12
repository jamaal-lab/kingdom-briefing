import type { Metadata } from "next";
import { Music, Zap } from "lucide-react";
import { WatchClient } from "@/components/WatchClient";
import { Container, Display, Eyebrow, PageHero, Placeholder } from "@/components/ui";
import { musicPlaylists } from "@/content/sermons";
import { youtube } from "@/content/site";
import { getLatestSermons } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Watch · Live & Sermons",
  description: "Worship live with Fellowship Chicago (#TheVirtualShip) and browse the sermon library.",
};
export const revalidate = 1800;

export default async function Watch() {
  const sermons = await getLatestSermons();
  return (
    <main id="main">
      <PageHero
        eyebrow="#TheVirtualShip"
        title="Watch"
        intro="Worship live every Sunday at 8:00, 10:45 and 1:15, or catch any message on demand."
      />
      <div className="pt-10 sm:pt-14">
        <WatchClient sermons={sermons} />
      </div>

      <section aria-labelledby="more" className="border-t border-line bg-hull/50 py-16 sm:py-24">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-hull p-8">
            <Zap aria-hidden="true" className="h-7 w-7 text-brass" />
            <Eyebrow className="mt-6">Midweek</Eyebrow>
            <Display id="more" as="h2" className="mt-3 text-6xl">
              Refuel
            </Display>
            <p className="mt-4 text-lg text-foam/85">
              Tuesdays at 7:00 PM (seasonal). A midweek service to recharge, in person and online.
            </p>
            <Placeholder label="Refuel season" className="mt-6">
              Current season dates and Refuel playlist to be confirmed by the church.
            </Placeholder>
          </div>
          <div className="rounded-3xl border border-line bg-hull p-8">
            <Music aria-hidden="true" className="h-7 w-7 text-brass" />
            <Eyebrow className="mt-6">Worship &amp; Arts</Eyebrow>
            <h2 className="mt-3 font-display text-6xl font-black uppercase leading-none">Music</h2>
            <p className="mt-4 text-lg text-foam/85">
              From the first LP in 1965 to five Stellar Awards in 2013, music has always carried the message at Fellowship.
            </p>
            {musicPlaylists.length ? (
              <ul className="mt-6 space-y-2">
                {musicPlaylists.map((p) => (
                  <li key={p.id}>
                    <a className="font-semibold underline" href={`https://www.youtube.com/playlist?list=${p.id}`}>
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder label="Music playlists" className="mt-6">
                Add YouTube playlist IDs in <code>content/sermons.ts</code>. Until then:{" "}
                <a className="font-semibold text-foam underline" href={youtube.channelUrl}>
                  browse the channel
                </a>
                .
              </Placeholder>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
