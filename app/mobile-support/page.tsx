import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PageTabs } from "@/components/PageTabs";

export const metadata: Metadata = {
  title: "Mobile App Support and Privacy | HoCo Weather Channel"
};

export default function MobileSupportPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white">
      <PageTabs active="about" />
      <PageHero title="Mobile app support" description="Help and privacy information for the HoCo Weather Channel app." />
      <div className="page-band mx-auto max-w-4xl space-y-8 text-slate-700">
        <section aria-labelledby="contact">
          <h2 id="contact" className="text-2xl font-semibold text-ink">Contact</h2>
          <p className="mt-3">For help with the app or a privacy question, email <a className="text-bay underline" href="mailto:howardcountyweather@gmail.com">howardcountyweather@gmail.com</a>. Please don&apos;t include student records or other sensitive information.</p>
        </section>
        <section aria-labelledby="privacy">
          <h2 id="privacy" className="text-2xl font-semibold text-ink">Mobile app privacy policy</h2>
          <div className="mt-3 space-y-3 leading-7">
            <p>The HoCo Weather Channel mobile app does not require an account or request your device location. It loads public weather forecasts, HoCo predictions, and school status from the HoCo Weather Channel website.</p>
            <p>When the app requests this data, our hosting provider receives standard network information, such as your IP address and the page or endpoint requested, to deliver the response and operate the service. External links open sites that have their own privacy policies.</p>
            <p>You can contact us at the email above with privacy questions or requests.</p>
          </div>
        </section>
        <section aria-labelledby="school-status">
          <h2 id="school-status" className="text-2xl font-semibold text-ink">Official school decisions</h2>
          <p className="mt-3">HoCo Weather Channel&apos;s forecasts and predictions are not official district decisions. For final announcements, check your school district&apos;s official status page.</p>
        </section>
      </div>
    </main>
  );
}
