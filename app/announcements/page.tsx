import type { Metadata } from "next";
import Link from "next/link";
import { PageTabs } from "@/components/PageTabs";

export const metadata: Metadata = {
  title: "Announcements | HoCo Weather Channel",
  description: "Severe weather broadcasting with HCPSS and a December 9 discussion with NOAA on weather AI.",
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
          <div className="text-sm font-semibold text-bay">Discussion with NOAA leadership <time dateTime="2026-12-09" className="mt-1 block text-slate-600">December 9, 2026</time></div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">Presenting HoCo Weather Channel and its weather AI roadmap to NOAA</h2>
            <p className="mt-4 leading-7 text-slate-700">On December 9, HoCo Weather Channel will meet with <a href="https://www.noaa.gov/our-people/leadership/dr-neil-jacobs-2025" className="font-semibold text-bay underline underline-offset-4">NOAA Administrator Dr. Neil Jacobs</a> to demonstrate the platform, invite his critique, and discuss how AI could make public weather data more useful to the institutions that rely on it.</p>
            <p className="mt-4 leading-7 text-slate-700">Our work starts with a question a regional forecast cannot answer by itself: Will freezing rain arrive before or after the first school buses leave? We want to build a system that connects forecasts, observations, and alerts to local travel windows, shows the evidence behind each assessment, and keeps uncertainty visible. We archive our predictions so we can compare them with recorded school outcomes and see where the model needs work.</p>
            <p className="mt-4 leading-7 text-slate-700">A potential long-term collaboration could start with a school-travel pilot. We want to explore what data and evaluation methods would make that pilot credible, then test whether the briefings help local teams identify the hours of greatest concern and explain the evidence behind their decisions.</p>
          </div>
        </article>
      </div>
    </main>
  );
}
