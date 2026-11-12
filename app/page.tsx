import { Hero } from "@/components/Hero";
import { LiveBanner } from "@/components/LiveBanner";
import { CommunityImpact, FiveDoors, GiveBand, LegacyTeaser, ShipMission, ThisWeek, Upcoming } from "@/components/home";

export const revalidate = 1800;

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <LiveBanner />
      <ThisWeek />
      <Upcoming />
      <FiveDoors />
      <ShipMission />
      <CommunityImpact />
      <LegacyTeaser />
      <GiveBand />
    </main>
  );
}
