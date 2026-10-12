import Link from "next/link";
import { AlertTriangle, Archive, CalendarClock, CloudSun, Instagram, Mail, Snowflake, Thermometer, Wind } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { archiveDailyBriefing, createArchivedBriefing } from "@/lib/briefing-archive";
import { createPrediction } from "@/lib/prediction";
import { getWeatherSummary } from "@/lib/weather";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Weather Briefings | HoCo Weather Channel",
  description: "Current Howard County weather briefings using National Weather Service data."
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "America/New_York" }).format(new Date(value));
}

export default async function BriefingsPage() {
  let content;

  try {
    const weather = await getWeatherSummary();
    const prediction = createPrediction({ weather });
    await archiveDailyBriefing(createArchivedBriefing(weather, prediction)).catch(() => null);
    const concerns = [
      weather.expectedSnowfallInches ? `${weather.expectedSnowfallInches} inches of snow possible before tomorrow morning` : null,
      weather.precipitationChance !== null ? `${weather.precipitationChance}% precipitation chance` : null,
      weather.windGust ? `Wind gusts ${weather.windGust}` : weather.windSpeed ? `Winds ${weather.windSpeed}` : null
    ].filter(Boolean) as string[];

    content = (
      <>
        <section className="border-y border-blue-200 bg-blue-50/60 px-5 py-7 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-bay">Current Briefing</p>
              <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{weather.shortForecast ?? "Howard County weather update"}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-700">{weather.detailedForecast ?? weather.overnightForecast ?? "No detailed forecast is currently available."}</p>
            </div>
            <div className="shrink-0 text-sm text-slate-500">Issued {formatTime(weather.fetchedAt)}</div>
          </div>
        </section>

        <section className="grid border-b border-blue-100 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-blue-100 p-5 sm:border-r"><Thermometer className="h-5 w-5 text-bay" /><p className="mt-3 text-sm text-slate-500">Temperature</p><p className="mt-1 text-2xl font-bold text-ink">{weather.currentTemperatureF ?? "--"}°F</p></div>
          <div className="border-b border-blue-100 p-5 lg:border-r"><CloudSun className="h-5 w-5 text-bay" /><p className="mt-3 text-sm text-slate-500">Precipitation</p><p className="mt-1 text-2xl font-bold text-ink">{weather.precipitationChance ?? "--"}%</p></div>
          <div className="border-b border-blue-100 p-5 sm:border-r lg:border-b-0"><Snowflake className="h-5 w-5 text-bay" /><p className="mt-3 text-sm text-slate-500">Expected snow</p><p className="mt-1 text-2xl font-bold text-ink">{weather.expectedSnowfallInches ?? 0} in</p></div>
          <div className="p-5"><Wind className="h-5 w-5 text-bay" /><p className="mt-3 text-sm text-slate-500">Wind</p><p className="mt-1 text-lg font-bold text-ink">{weather.windSpeed ?? "Unavailable"}</p></div>
        </section>

        <section className="grid gap-5 border-b border-blue-100 py-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-bay">What We&apos;re Watching</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Primary forecast factors</h2>
            <ul className="mt-5 divide-y divide-blue-100 border-y border-blue-100">
              {(concerns.length ? concerns : ["No significant winter-weather factors identified"]).map((concern) => <li key={concern} className="flex gap-3 py-4 text-slate-700"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-bay" />{concern}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-bay">School Operations Outlook</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{prediction.label}</h2>
            <p className="mt-3 leading-7 text-slate-700">{prediction.explanation}</p>
            <p className="mt-4 border-l-4 border-bay bg-blue-50 px-4 py-3 text-sm font-medium text-slate-700">This outlook is unofficial and does not represent the actual decision of a school district.</p>
          </div>
        </section>

        <section className="py-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">Official Sources</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="https://www.weather.gov/lwx/" target="_blank" rel="noreferrer" className="border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-bay">National Weather Service Baltimore/Washington</a>
            <a href="https://status.hcpss.org/" target="_blank" rel="noreferrer" className="border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-bay">Official HCPSS Status</a>
          </div>
        </section>
      </>
    );
  } catch (error) {
    content = <section className="border-y border-red-100 bg-red-50 p-6 text-red-800">The current briefing could not be loaded. Please check the National Weather Service for official information.</section>;
  }

  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-5 lg:px-6">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img src="/hoco-weather-channel-logo.png" alt="HoCo Weather Channel" className="h-20 w-20 border border-blue-100 bg-white object-contain p-2" />
          <div><p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><CalendarClock className="h-4 w-4" /> Howard County, Maryland</p><h1 className="text-3xl font-bold text-ink md:text-5xl">Weather Briefings</h1></div>
        </div>
        <div className="flex gap-2"><a href="mailto:howardcountyweather@gmail.com" className="inline-flex items-center gap-2 border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay"><Mail className="h-4 w-4" /> Email</a><a href="https://www.instagram.com/hocoweatherchannel/?hl=en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay"><Instagram className="h-4 w-4" /> Instagram</a></div>
      </header>
      <PageTabs active="briefings" />
      <div className="mb-3 flex justify-end">
        <Link href="/briefings/archive" className="inline-flex items-center gap-2 border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-bay"><Archive className="h-4 w-4" /> View daily archive</Link>
      </div>
      {content}
    </main>
  );
}
