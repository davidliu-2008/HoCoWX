import type { Metadata } from "next";
import Link from "next/link";
import { PageTabs } from "@/components/PageTabs";

export const metadata: Metadata = {
  title: "Announcements | HoCo Weather Channel",
  description: "Project updates on severe weather broadcasting with HCPSS and a planned NOAA discussion.",
  alternates: { canonical: "/announcements" }
};

export default function AnnouncementsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full">
      <PageTabs active="announcements" />
      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <h1 className="mx-auto max-w-5xl text-4xl font-medium leading-tight sm:text-5xl">Announcements</h1>
      </header>
      <div className="mx-auto max-w-5xl divide-y divide-slate-200 px-5 sm:px-8">
        <article className="grid gap-4 py-10 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:py-14">
          <div className="text-sm font-semibold text-bay">HCPSS partnership <span className="mt-1 block text-slate-600">In development</span></div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">Building a countywide severe weather broadcast for schools</h2>
            <p className="mt-4 leading-7 text-slate-700">HoCo Weather Channel is working with the Howard County Public School System to develop a countywide broadcast that pairs local weather information with the reasoning behind school operations decisions. The goal is for families to hear what was decided, why it was decided, and what conditions to expect on the way to school.</p>
            <p className="mt-4 leading-7 text-slate-700">A forecast can tell you when freezing rain may start. A school weather broadcast should also explain whether that timing overlaps with bus routes, what is still uncertain, and where families can find the official decision.</p>
            <Link href="/partnerships" className="mt-4 inline-flex min-h-11 items-center font-semibold text-bay underline underline-offset-4">Explore the HCPSS partnership</Link>
          </div>
        </article>
        <article className="grid gap-4 py-10 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:py-14">
          <div className="text-sm font-semibold text-bay">Planned discussion <time dateTime="2026-12-09" className="mt-1 block text-slate-600">December 9, 2026</time></div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">Building the weather AI layer between forecasts and decisions</h2>
            <p className="mt-4 leading-7 text-slate-700">HoCo Weather Channel plans to meet with <a href="https://www.noaa.gov/our-people/leadership/dr-neil-jacobs-2025" className="font-semibold text-bay underline underline-offset-4">NOAA Administrator Dr. Neil Jacobs</a> to present our current platform and seek feedback on our weather AI startup plans. We see a gap in the weather industry: forecasts are widely available, but schools and other local organizations still have to work out what those forecasts mean for their operations.</p>
            <p className="mt-4 leading-7 text-slate-700">School travel is our starting point. Our product roadmap is to turn public forecasts, observations, and alerts into local impact estimates and briefings that show the evidence, timing, and uncertainty behind each assessment. We plan to ask Dr. Jacobs to review how HoCo Weather Channel works today and where that approach could serve other communities.</p>
            <p className="mt-4 leading-7 text-slate-700">Our long-term goal is to explore a sustained collaboration with NOAA that could begin with a focused pilot. We want to test whether clearer, faster briefings help local teams make better-informed decisions, and use what we learn to show where public weather data could be easier to put to work.</p>
          </div>
        </article>
      </div>
    </main>
  );
}
