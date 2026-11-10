import { PageTabs } from "@/components/PageTabs";
import { PartnershipSelector } from "@/components/PartnershipSelector";

export const metadata = {
  title: "Partnerships | HoCo Weather Channel",
  description: "HoCo Weather Channel partnerships supporting student weather literacy and communication."
};

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen w-full pb-6">
      <PageTabs active="partnerships" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-bay">Working Together</p>
          <h1 className="text-4xl font-black text-ink md:text-6xl">Partnerships</h1>
          <p className="mt-2 text-lg text-slate-600">Building stronger weather communication and literacy for students.</p>
          <div className="mx-auto mt-7 flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex h-20 w-full max-w-xs items-center justify-center rounded-lg bg-white px-5 shadow-lg sm:h-24">
              <img src="/partners/hcpss-logo.png" alt="Howard County Public School System" className="h-16 w-full object-cover object-center sm:h-20" />
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-lg sm:h-24 sm:w-24">
              <img src="/partners/capital-weather-logo.png" alt="Capital Weather" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </header>

      <PartnershipSelector />
    </main>
  );
}
