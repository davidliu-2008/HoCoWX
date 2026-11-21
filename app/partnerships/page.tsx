import { PageTabs } from "@/components/PageTabs";
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

      <header className="page-hero px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] min-[900px]:grid-cols-[0.8fr_2.2fr]">
          <div className="min-[900px]:col-start-2">
            <div className="max-w-3xl text-left">
              <h1 className="text-3xl font-normal leading-tight text-white sm:text-4xl">Built with trusted institutions.</h1>
              <p className="mt-5 text-lg leading-7 text-blue-100">HoCo Weather Channel works with school systems, weather companies, and data providers to strengthen forecasts, school-impact analysis, and weather literacy.</p>
            </div>
          </div>
        </div>
      </header>

      <PartnershipSelector />
    </main>
  );
}
