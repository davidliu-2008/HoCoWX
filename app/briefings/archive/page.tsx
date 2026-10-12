import Link from "next/link";
import { Archive, ArrowLeft, CalendarDays, CloudSun } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { archiveIsConfigured, getArchivedBriefings, type ArchivedBriefing } from "@/lib/briefing-archive";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Briefing Archive | HoCo Weather Channel",
  description: "Daily Howard County weather briefing archive."
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/New_York" }).format(new Date(`${value}T12:00:00-04:00`));
}

export default async function BriefingArchivePage() {
  let briefings: ArchivedBriefing[] = [];
  let error = "";

  try {
    briefings = await getArchivedBriefings();
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "The archive could not be loaded.";
  }

  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-5 lg:px-6">
      <header className="mb-6 border-b border-blue-100 pb-6">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><Archive className="h-4 w-4" /> Daily record</p>
        <h1 className="text-3xl font-bold text-ink md:text-5xl">Weather Briefing Archive</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">One snapshot of Howard County conditions and the HoCoWX school-operations outlook for each day.</p>
      </header>

      <PageTabs active="briefings" />

      <Link href="/briefings" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-bay"><ArrowLeft className="h-4 w-4" /> Current briefing</Link>

      {error ? <p className="border-y border-red-100 bg-red-50 p-5 text-red-800">{error}</p> : null}
      {!archiveIsConfigured() ? (
        <section className="border-y border-amber-200 bg-amber-50 p-5 text-amber-900">
          Daily archive storage is ready but has not been connected yet. Add the Supabase environment variables in Vercel to begin saving briefings.
        </section>
      ) : briefings.length === 0 ? (
        <section className="border-y border-blue-100 bg-white p-5 text-slate-600">No daily briefings have been archived yet.</section>
      ) : (
        <section className="divide-y divide-blue-100 border-y border-blue-100">
          {briefings.map((briefing) => (
            <article key={briefing.briefing_date} className="grid gap-4 py-6 lg:grid-cols-[0.28fr_0.72fr]">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-bay"><CalendarDays className="h-4 w-4" /> {formatDate(briefing.briefing_date)}</p>
                <p className="mt-2 text-sm text-slate-500">{briefing.temperature_f ?? "--"}°F · {briefing.precipitation_chance ?? "--"}% precip</p>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-ink">{briefing.title}</h2><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-bay">{briefing.prediction_label}</span></div>
                <p className="mt-2 leading-7 text-slate-600">{briefing.summary}</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600"><CloudSun className="h-4 w-4 text-bay" /> {briefing.prediction_risk} risk · {briefing.prediction_confidence}% confidence</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
