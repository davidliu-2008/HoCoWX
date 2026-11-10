import { AlertTriangle, CalendarClock, CheckCircle2, Gauge, Info, Snowflake, ThermometerSnowflake, Wind } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { createPrediction } from "@/lib/prediction";
import { getMarylandDistrict } from "@/lib/maryland-districts";
import { getWeatherSummary } from "@/lib/weather";
import type { PredictionResult } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Predictions | HoCo Weather Channel",
  description: "Current school-operation prediction and a transparent explanation of the weather-based model."
};

const predictionHistory = [
  { date: "March 16, 2026", prediction: "Early Dismissal", confidence: 90, outcome: "Early Dismissal" },
  { date: "March 2, 2026", prediction: "Delay", confidence: 55, outcome: "Delay" },
  { date: "February 24, 2026", prediction: "Normal Operations", confidence: 85, outcome: "Normal Operations" },
  { date: "February 23, 2026", prediction: "Closure", confidence: 90, outcome: "Closure" },
  { date: "February 3, 2026", prediction: "Delay", confidence: 70, outcome: "Delay" },
  { date: "February 2, 2026", prediction: "Delay", confidence: 75, outcome: "Delay" },
  { date: "January 30, 2026", prediction: "Closure", confidence: 90, outcome: "Closure" },
  { date: "January 29, 2026", prediction: "Closure", confidence: 95, outcome: "Closure" },
  { date: "January 28, 2026", prediction: "Closure", confidence: 85, outcome: "Closure" }
];

function badgeClass(riskLevel: PredictionResult["riskLevel"]) {
  if (riskLevel === "High") return "bg-red-100 text-red-800";
  if (riskLevel === "Medium") return "bg-yellow-100 text-yellow-900";
  return "bg-emerald-100 text-emerald-800";
}

export default async function PredictionsPage({ searchParams }: { searchParams: Promise<{ county?: string }> }) {
  let prediction: PredictionResult | null = null;
  let error: string | null = null;
  const requestedCounty = (await searchParams).county ?? "howard";
  const district = getMarylandDistrict(requestedCounty) ?? getMarylandDistrict("howard")!;

  try {
    prediction = createPrediction({ weather: await getWeatherSummary({ latitude: district.latitude, longitude: district.longitude, location: district.county }) });
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Prediction data could not be loaded.";
  }

  return (
    <main className="min-h-screen w-full pb-8">
      <PageTabs active="predictions" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-bay"><Gauge className="h-4 w-4" /> Predictions</p>
        <h1 className="mx-auto mt-3 max-w-5xl text-4xl font-black leading-tight text-ink sm:text-6xl">School Operation Predictions</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">National Weather Service data is converted into a transparent weather-impact score. Each factor and point adjustment appears below.</p>
      </header>

      {prediction ? (
        <>
          <section className="px-5 py-12 sm:px-8 sm:py-16">
            <p className="text-center text-sm font-bold uppercase tracking-wide text-bay">How predictions are made</p>
            <p className="mx-auto mt-4 max-w-4xl text-center text-lg leading-8 text-slate-600">The model begins with a low baseline score. It then adds or subtracts points using observable weather factors. More points indicate a greater chance that weather could disrupt school operations.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Factor icon={<AlertTriangle className="h-6 w-6" />} title="Official alerts">Winter Storm and Ice Storm Warnings add substantial risk because they signal hazardous travel or significant impacts.</Factor>
              <Factor icon={<ThermometerSnowflake className="h-6 w-6" />} title="Ice and freezing rain">Ice receives heavy weight because even a thin glaze can make untreated roads, sidewalks, and parking lots dangerous.</Factor>
              <Factor icon={<Snowflake className="h-6 w-6" />} title="Snow amount">Snow before the morning commute increases risk, with additional weight as expected accumulation rises.</Factor>
              <Factor icon={<CalendarClock className="h-6 w-6" />} title="Timing">Weather during the 5–9 AM commute matters more than precipitation arriving after students and staff reach school.</Factor>
              <Factor icon={<Wind className="h-6 w-6" />} title="Wind and cold">Strong gusts during snow or ice, poor visibility, and extreme cold can raise transportation and safety concerns.</Factor>
              <Factor icon={<CheckCircle2 className="h-6 w-6" />} title="Improving conditions">Later timing, rising temperatures, or precipitation ending before travel can reduce the overall score.</Factor>
            </div>
          </section>

          <section className="grid gap-8 bg-blue-50/45 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2">
            <div className="bg-white/80 p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-bay">Risk score breakdown</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Today&apos;s score</h2>
              <div className="mt-6 space-y-3">
                {prediction.scoreBreakdown.map((item) => (
                  <div key={`${item.label}-${item.points}`} className="flex items-center justify-between gap-5 bg-white/80 px-5 py-4">
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                    <span className={`text-sm font-black ${item.points < 0 ? "text-blue-700" : "text-ink"}`}>{item.points > 0 ? "+" : ""}{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/80 p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-bay">Morning commute</p>
              <h2 className="mt-2 text-3xl font-black text-ink">5 AM–9 AM risk</h2>
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><span className={`px-3 py-1.5 text-sm font-bold ${badgeClass(prediction.morningCommuteRisk.label)}`}>{prediction.morningCommuteRisk.label}</span><strong className="text-3xl text-ink">{prediction.morningCommuteRisk.score}/100</strong></div>
                <ul className="mt-6 space-y-3">{prediction.morningCommuteRisk.factors.map((factor) => <li key={factor} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-bay" />{factor}</li>)}</ul>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="text-center lg:flex lg:flex-col lg:justify-center">
                <p className="text-sm font-bold uppercase tracking-wide text-bay">2026 prediction record</p>
                <div className="mt-7 flex justify-center gap-8">
                  <div><p className="text-4xl font-black text-bay">9/9</p><p className="mt-1 text-sm font-semibold text-slate-500">Matched calls</p></div>
                  <div><p className="text-4xl font-black text-ink">100%</p><p className="mt-1 text-sm font-semibold text-slate-500">Documented match rate</p></div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-blue-50/60">
                <div className="hidden grid-cols-[1.05fr_1fr_0.8fr_1fr] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
                  <span>Date</span><span>Prediction</span><span>Confidence</span><span>Final outcome</span>
                </div>
                <div className="space-y-2 p-2">
                  {predictionHistory.map((entry) => (
                    <article key={entry.date} className="grid gap-3 rounded-md bg-white/90 px-5 py-4 md:grid-cols-[1.05fr_1fr_0.8fr_1fr] md:items-center md:gap-4">
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">Date</span><p className="font-bold text-ink">{entry.date}</p></div>
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">Prediction</span><p className="font-semibold text-slate-700">{entry.prediction}</p></div>
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">Confidence</span><p className="text-sm font-semibold text-slate-600">{entry.confidence}%</p></div>
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">Final outcome</span><p className="inline-flex items-center gap-2 font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />{entry.outcome}</p></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="flex gap-4 bg-white px-5 py-6 text-sm leading-6 text-slate-600 sm:px-8"><Info className="mt-0.5 h-5 w-5 shrink-0 text-bay" /><p>This prediction is based on weather conditions. Always use the official school district status for the final operational decision.</p></aside>
        </>
      ) : (
        <section className="bg-red-50 px-5 py-8 text-red-800 sm:px-8"><h2 className="font-bold">Prediction unavailable</h2><p className="mt-2 text-sm">{error}</p></section>
      )}
    </main>
  );
}

function Factor({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <article className="bg-blue-50/55 p-6"><span className="text-bay">{icon}</span><h3 className="mt-4 text-xl font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{children}</p></article>;
}
