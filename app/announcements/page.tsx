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
            <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">Taking the question of usable weather data to NOAA</h2>
            <p className="mt-4 leading-7 text-slate-700">HoCo Weather Channel plans to meet with <a href="https://www.noaa.gov/our-people/leadership/dr-neil-jacobs-2025" className="font-semibold text-bay underline underline-offset-4">NOAA Administrator Dr. Neil Jacobs</a> to explore a potential partnership and discuss the future of the weather industry.</p>
            <p className="mt-4 leading-7 text-slate-700">The question we want to bring to the table: What would it take for a student team or school district to turn public weather data into a reliable local briefing? We plan to discuss easier access to forecast data, ways to communicate uncertainty, and how NOAA and local teams might work together to make that information more useful.</p>
          </div>
        </article>
      </div>
    </main>
  );
}
