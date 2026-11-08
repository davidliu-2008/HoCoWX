import type { Metadata } from "next";
import { BusFront } from "lucide-react";
import { CommutePlanner } from "@/components/CommutePlanner";
import { PageTabs } from "@/components/PageTabs";
import { marylandDistricts } from "@/lib/maryland-districts";

export const metadata: Metadata = {
  title: "School Commute Planner | HoCo Weather Channel",
  description: "A personalized morning and afternoon school commute weather outlook for every Maryland public school district."
};

export default async function CommutePage({ searchParams }: { searchParams: Promise<{ county?: string }> }) {
  const requestedCounty = (await searchParams).county ?? "howard";
  const initialCounty = marylandDistricts.some((district) => district.slug === requestedCounty) ? requestedCounty : "howard";
  return (
    <main className="min-h-screen w-full pb-8">
      <PageTabs active="commute" />
      <header className="page-hero grid gap-6 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-bay"><BusFront className="h-4 w-4" />Maryland school travel</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-6xl">Your school commute, at a glance.</h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">Choose a county and travel window for a focused NWS weather outlook. Your preference stays on this device for the next visit.</p>
      </header>
      <section className="px-5 pb-12 sm:px-8">
        <CommutePlanner districts={marylandDistricts.map(({ slug, county }) => ({ slug, county }))} initialCounty={initialCounty} />
      </section>
    </main>
  );
}
