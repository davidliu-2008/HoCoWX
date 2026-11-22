import type { Metadata } from "next";
import { CommutePlanner } from "@/components/CommutePlanner";
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
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-8">
      <PageTabs active="commute" />
      <PageHero title="Your school commute, at a glance." description="Choose a county and travel window for a focused National Weather Service outlook." />
      <section className="px-5 py-8 sm:px-8 sm:py-10">
        <CommutePlanner districts={marylandDistricts.map(({ slug, county }) => ({ slug, county }))} initialCounty={initialCounty} />
      </section>
    </main>
  );
}
