import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, MonitorSmartphone, MousePointer2, Volume2 } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Accessibility | HoCo Weather Channel",
  description: "How HoCo Weather Channel is applying accessibility guidance shared through its work with HCPSS."
};

const features = [
  {
    title: "Keyboard access",
    description: "Navigation, menus, links, buttons, and form controls can be reached without a mouse.",
    icon: MousePointer2
  },
  {
    title: "Clear structure",
    description: "Pages use descriptive headings, landmarks, link text, and labels to support screen readers and easier scanning.",
    icon: CheckCircle2
  },
  {
    title: "Readable presentation",
    description: "Visible keyboard focus, responsive layouts, color contrast, and reduced-motion preferences are supported.",
    icon: MonitorSmartphone
  },
  {
    title: "Media alternatives",
    description: "Informative images include text alternatives. Captions and transcripts for recorded media remain an active priority.",
    icon: Volume2
  }
];

export default function AccessibilityPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full">
      <PageTabs active="accessibility" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">Accessibility</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8">
            Accessibility work informed by guidance shared through our collaboration with HCPSS.
          </p>
        </div>
      </header>

      <section className="bg-white px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black text-ink sm:text-4xl">Our accessibility approach</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-700">
            HCPSS Communications and Engagement shared Web Content Accessibility Guidelines and evaluation resources to support the development of an experience that can serve all users. In response, HoCo Weather Channel completed a sitewide accessibility review focused on WCAG 2.1 Level AA and relevant WCAG 2.2 guidance. Accessibility will continue to be evaluated as the website and HCPSS collaboration grow.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            This page documents the work completed and the improvements still underway; it is not a statement of third-party certification.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-x-10 gap-y-8 sm:grid-cols-2">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="flex gap-4">
              <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-bay" />
              <div>
                <h3 className="text-xl font-black text-ink">{title}</h3>
                <p className="mt-2 leading-7 text-slate-700">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-ink">Tell us about a barrier</h2>
            <p className="mt-4 leading-7 text-slate-700">
              If any content or feature is difficult to use, email us. Include the page address, what you were trying to do, and your device, browser, or assistive technology when possible.
            </p>
            <a href="mailto:howardcountyweather@gmail.com?subject=Website%20accessibility%20feedback" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-bay px-5 py-3 font-bold text-white hover:bg-blue-700">
              <Mail aria-hidden="true" className="h-5 w-5" />
              Send accessibility feedback
            </a>
          </div>
          <div>
            <h2 className="text-3xl font-black text-ink">Work in progress</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Our next priorities include publishing captions or a transcript for the superintendent interview and continuing keyboard, screen-reader, contrast, zoom, and mobile testing.
            </p>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Learn more from the{" "}
              <Link href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer" className="font-bold text-bay">
                W3C Web Content Accessibility Guidelines (opens in a new tab)
              </Link>
              .
            </p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-5xl text-sm text-slate-600">Last reviewed: November 16, 2026</p>
      </section>

      <SiteFooter />
    </main>
  );
}
