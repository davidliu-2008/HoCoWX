import { PageTabs } from "@/components/PageTabs";
import { PartnershipSelector } from "@/components/PartnershipSelector";

export const metadata = {
  title: "Partnerships | HoCo Weather Channel",
  description: "HoCo Weather Channel partnerships supporting student weather literacy and communication."
};

export default function PartnershipsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-6">
      <PageTabs active="partnerships" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-black text-ink md:text-6xl">Partnerships</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Organizations contributing distribution, forecasting expertise, and professional weather data to a student-led weather service.</p>
        </div>
      </header>

      <PartnershipSelector />
    </main>
  );
}
