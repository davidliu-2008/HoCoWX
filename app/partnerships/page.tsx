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

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><Handshake className="h-4 w-4" /> Working Together</p>
          <h1 className="text-4xl font-black text-ink md:text-6xl">Partnerships</h1>
          <p className="mt-2 text-lg text-slate-600">Building stronger weather communication and literacy for students.</p>
        </div>
      </header>

      <PartnershipSelector />
    </main>
  );
}
