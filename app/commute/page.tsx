import type { Metadata } from "next";
import { CommutePlanner } from "@/components/CommutePlanner";
import { RouteWeather } from "@/components/RouteWeather";
import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";
import { marylandDistricts } from "@/lib/maryland-districts";

export const metadata: Metadata = {
  title: "School Commute Planner | HoCo Weather Channel",
  description: "A personalized morning and afternoon school commute weather outlook for every Maryland public school district."
};

export default async function CommutePage({ searchParams }: { searchParams: Promise<{ county?: string }> }) {
  const requestedCounty = (await searchParams).county ?? "howard";
  const initialCounty = marylandDistricts.some((district) => district.slug === requestedCounty) ? requestedCounty : "howard";
  const routeWeatherEnabled = Boolean(process.env.OSRM_BASE_URL) || process.env.NODE_ENV === "development";
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-8">
      <PageTabs active="commute" />
      <PageHero title="Your school commute, at a glance." description={routeWeatherEnabled ? "Check weather along your drive or see the morning and afternoon outlook for your county." : "See the morning and afternoon school travel outlook for your county."} />
      <section className="page-content page-section">
        {routeWeatherEnabled && <RouteWeather />}
        <CommutePlanner districts={marylandDistricts.map(({ slug, county }) => ({ slug, county }))} initialCounty={initialCounty} />
      </section>
    </main>
  );
}
