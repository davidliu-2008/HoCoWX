import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";
import { PartnershipSelector } from "@/components/PartnershipSelector";

export const metadata = {
  title: "Partnerships | HoCo Weather Channel",
  description: "HoCo Weather Channel partnerships supporting student weather literacy and communication.",
  alternates: { canonical: "/partnerships" },
  openGraph: {
    title: "Partnerships | HoCo Weather Channel",
    description: "HoCo Weather Channel partnerships supporting student weather literacy and communication.",
    url: "/partnerships",
    images: ["/photography/howard-county-winter-sunset.webp"]
  },
  twitter: { card: "summary_large_image" }
};

export default function PartnershipsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-6">
      <PageTabs active="partnerships" />

      <PageHero title="Built with trusted institutions." description="Our partners help us improve forecasts and bring weather insights to more students." />

      <PartnershipSelector />
    </main>
  );
}
