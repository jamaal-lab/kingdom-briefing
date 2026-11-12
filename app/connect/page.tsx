import type { Metadata } from "next";
import { MinistryFinder } from "@/components/MinistryFinder";
import { Container, PageHero, Placeholder } from "@/components/ui";

export const metadata: Metadata = {
  title: "Get Connected · Ministries",
  description: "Find a ministry at Fellowship Chicago by age group and interest, and join in.",
};

export default function Connect() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Get Connected"
        title={
          <>
            Find your
            <br />
            place on deck
          </>
        }
        intro="Every hand on The Ship matters. Filter by who it's for and what you love, then join a team."
      />
      <section aria-label="Ministry finder" className="py-14 sm:py-20">
        <Container>
          <Placeholder label="Ministry list" className="mb-10">
            Showing the ministries named in the project brief. The full list of about 27, with descriptions, will be
            imported from the church&rsquo;s current ministries page.
          </Placeholder>
          <MinistryFinder />
        </Container>
      </section>
    </main>
  );
}
