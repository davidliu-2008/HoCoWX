import type { Metadata } from "next";
import Link from "next/link";
import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Announcements | HoCo Weather Channel",
  description: "Severe weather broadcasting with HCPSS and a December 9 discussion with NOAA on translating forecasts into local decisions.",
  alternates: { canonical: "/announcements" }
};

export default function AnnouncementsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full">
      <PageTabs active="announcements" />
      <PageHero title="Announcements" />
      <div className="page-content">
        <article className="grid max-w-5xl gap-3 py-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:py-10">
          <div className="text-sm font-semibold text-bay">HCPSS partnership <span className="mt-1 block text-slate-600">In development</span></div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">Building a countywide severe weather broadcast for schools</h2>
            <p className="mt-4 leading-7 text-slate-700">HoCo Weather Channel is working with the Howard County Public School System to develop a countywide broadcast that pairs local weather information with the reasoning behind school operations decisions. The goal is for families to hear what was decided, why it was decided, and what conditions to expect on the way to school.</p>
            <p className="mt-4 leading-7 text-slate-700">A forecast can tell you when freezing rain may start. A school weather broadcast should also explain whether that timing overlaps with bus routes, what is still uncertain, and where families can find the official decision.</p>
            <Link href="/partnerships" className="mt-4 inline-flex min-h-11 items-center font-semibold text-bay underline underline-offset-4">Explore the HCPSS partnership</Link>
          </div>
        </article>
        <article className="grid max-w-5xl gap-3 pb-10 pt-2 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:pb-12">
          <div className="text-sm font-semibold text-bay">Discussion with NOAA leadership <time dateTime="2026-12-09" className="mt-1 block text-slate-600">December 9, 2026</time></div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">A decision layer for public weather data</h2>
            <p className="mt-4 leading-7 text-slate-700">On December 9, HoCo Weather Channel will meet with <a href="https://www.noaa.gov/our-people/leadership/dr-neil-jacobs-2025" className="font-semibold text-bay underline underline-offset-4">NOAA Administrator Dr. Neil Jacobs</a> to demonstrate the platform and seek his feedback on our roadmap: building a layer that translates weather forecasts into the local insights school districts and governments need to make decisions.</p>
            <p className="mt-4 leading-7 text-slate-700">School travel is our first use case. A regional forecast may call for freezing rain; a district needs to know whether it could arrive before the first buses leave. We connect forecasts, observations, and alerts to local travel windows, explain the evidence and uncertainty, and archive our predictions so we can compare them with recorded school outcomes.</p>
            <p className="mt-4 leading-7 text-slate-700">A potential long-term collaboration could start with a school-travel pilot. We want to explore what data and evaluation methods would make that pilot credible, then test whether the briefings help local teams identify the hours of greatest concern and explain the evidence behind their decisions.</p>
          </div>
        </article>
      </div>
    </main>
  );
}
