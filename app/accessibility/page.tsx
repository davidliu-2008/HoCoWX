import type { Metadata } from "next";
import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Accessibility | HoCo Weather Channel",
  description: "How HoCo Weather Channel is applying accessibility guidance shared through its work with HCPSS."
};

const features = [
  {
    title: "Keyboard access",
    description: "Navigation, menus, links, buttons, and form controls can be reached without a mouse."
  },
  {
    title: "Clear structure",
    description: "Pages use descriptive headings, landmarks, link text, and labels to support screen readers and easier scanning."
  },
  {
    title: "Readable presentation",
    description: "Visible keyboard focus, responsive layouts, color contrast, and reduced-motion preferences are supported."
  },
  {
    title: "Media alternatives",
    description: "Informative images include text alternatives. Captions and transcripts for recorded media remain an active priority."
  }
];

export default function AccessibilityPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full">
      <PageTabs active="accessibility" />

      <PageHero title="Accessibility" description="Accessibility work informed by guidance shared through our collaboration with HCPSS." />

      <section className="bg-white px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black text-ink sm:text-4xl">Our accessibility approach</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-700">
            This site was reviewed in accordance with WCAG guidance shared by HCPSS Communications and Engagement, with a focus on WCAG 2.1 Level AA and relevant WCAG 2.2 guidance.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-x-10 gap-y-8 sm:grid-cols-2">
          {features.map(({ title, description }) => (
            <article key={title}>
              <h3 className="text-xl font-black text-ink">{title}</h3>
              <p className="mt-2 leading-7 text-slate-700">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-ink">Tell us about a barrier</h2>
            <p className="mt-4 leading-7 text-slate-700">
              If any content or feature is difficult to use, email us. Include the page address, what you were trying to do, and your device, browser, or assistive technology when possible.
            </p>
            <a href="mailto:howardcountyweather@gmail.com?subject=Website%20accessibility%20feedback" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-bay px-5 py-3 font-bold text-white hover:bg-blue-700">
              Send accessibility feedback
            </a>
        </div>
        <p className="mx-auto mt-10 max-w-5xl text-sm text-slate-600">Last reviewed: November 16, 2026</p>
      </section>
    </main>
  );
}
