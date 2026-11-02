import { Handshake } from "lucide-react";
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

      <header className="flex flex-col gap-4 border-b border-blue-100 px-4 py-5 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img src="/hoco-weather-channel-logo.png" alt="HoCo Weather Channel" className="h-20 w-20 border border-blue-100 bg-white object-contain p-2" />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><Handshake className="h-4 w-4" /> Working Together</p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Partnerships</h1>
            <p className="mt-2 text-lg text-slate-600">Building stronger weather communication and literacy for students.</p>
          </div>
        </div>
      </header>

      <PartnershipSelector />
    </main>
  );
}
