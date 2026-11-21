import { PageTabs } from "@/components/PageTabs";
import { Info, Minus, Plus } from "lucide-react";
import { createStoredImpactPrediction } from "@/lib/impact-service";
import { getMarylandDistrict } from "@/lib/maryland-districts";
import { getWeatherSummary } from "@/lib/weather";
import type { PredictionResult } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Predictions | HoCo Weather Channel",
  description: "Current school-operation prediction and a transparent explanation of the weather-based model.",
  alternates: { canonical: "/predictions" },
  openGraph: {
    title: "Predictions | HoCo Weather Channel",
    description: "Current school-operation prediction and a transparent explanation of the weather-based model.",
    url: "/predictions",
    images: ["/photography/howard-county-winter-sunset.webp"]
  },
  twitter: { card: "summary_large_image" }
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
  let schoolDate: string | null = null;
  let error: string | null = null;
  const requestedCounty = (await searchParams).county ?? "howard";
  const district = getMarylandDistrict(requestedCounty) ?? getMarylandDistrict("howard")!;

  try {
    const weather = await getWeatherSummary({ latitude: district.latitude, longitude: district.longitude, location: district.county });
    const run = await createStoredImpactPrediction({
      weather,
      districtSlug: district.slug,
      county: district.county
    });
    prediction = run.prediction;
    schoolDate = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "UTC" })
      .format(new Date(`${run.targetDate}T00:00:00Z`));
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Prediction data could not be loaded.";
  }

  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-8">
      <PageTabs active="predictions" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <h1 className="mx-auto max-w-5xl text-4xl font-medium leading-tight sm:text-5xl">Predictions</h1>
      </header>
      <section aria-labelledby="current-school-prediction" className="mx-auto max-w-3xl px-5 pt-8 text-center sm:px-8 sm:pt-10">
        <p className="text-sm font-semibold text-slate-600">{district.county}{schoolDate ? ` · ${schoolDate}` : ""}</p>
        <h2 id="current-school-prediction" className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">{prediction?.label ?? "School operation prediction unavailable"}</h2>
      </section>
      <aside aria-label="About this prediction" className="mx-5 mt-5 flex items-start gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-ink sm:mx-8 lg:mx-auto lg:max-w-3xl">
        <Info aria-hidden="true" className="h-5 w-5 shrink-0 text-bay" />
        <span>Based on forecast weather. This is not an official school decision.</span>
      </aside>

      {prediction ? (
        <>
          <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
            <div className="mx-auto grid w-full max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border border-slate-200 bg-white sm:max-w-[calc(100vw-4rem)] lg:max-w-[min(1500px,calc(100vw-6rem))] xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] 2xl:min-h-[360px] 2xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)_minmax(0,1fr)]">
              <div className="min-w-0 flex flex-col justify-between bg-navy p-7 text-white sm:p-9">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Why we made this call</h2>
                  <p className="mt-5 text-lg leading-8 text-blue-100">{prediction.explanation}</p>
                </div>
              </div>

              <div className="min-w-0 border-slate-200 p-7 sm:p-9 lg:border-r">
                <p className="text-sm font-bold uppercase tracking-wide text-bay">Evidence</p>
                <h3 className="mt-4 text-2xl font-medium text-ink sm:text-3xl">Weather signals shaping this result</h3>
                <div className="mt-8 divide-y divide-slate-200">
                  {prediction.topFactors.map((factor) => (
                    <div key={factor} className="py-5 first:pt-0">
                      <p className="text-base font-semibold leading-7 text-slate-700">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 border-t border-slate-200 p-7 sm:p-9 xl:col-span-2 2xl:col-span-1 2xl:border-t-0">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Model outputs</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:grid-cols-1">
                  <ScoreBar label="Impact score" score={prediction.confidence} note={prediction.riskLevel} />
                  <ScoreBar label="Morning commute" score={prediction.morningCommuteRisk.score} note={prediction.morningCommuteRisk.label} />
                </div>
                <p className="mt-6 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">These scores summarize forecast hazards on a scale of 0 to 100. They are not probabilities of a delay or closure.</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-50/45 px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-bay">Methodology</p>
                <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">How the model works</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">The model starts with a low baseline, measures observable weather signals, and converts the total into an operations-risk range.</p>
              </div>
              <div className="mt-10 grid gap-px overflow-hidden bg-blue-100 md:grid-cols-2 xl:grid-cols-4">
                <MethodStep label="Inputs" title="Forecast evidence">Official alerts, temperature, precipitation type and chance, snow, ice, wind, and hourly timing.</MethodStep>
                <MethodStep label="Scoring" title="Weighted impacts">Ice and warning-level hazards carry the most weight. Snow, cold, wind, and precipitation add risk in smaller increments.</MethodStep>
                <MethodStep label="Timing" title="School travel window">Conditions from 5–9 AM receive extra attention. Later arrival or improving conditions can reduce the score.</MethodStep>
                <MethodStep label="Output" title="Operations range">The final 0–100 score maps to normal operations, monitoring, delay, early dismissal, or closure ranges.</MethodStep>
              </div>
            </div>
          </section>

          <section className="mx-auto grid w-full max-w-[1500px] gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:px-12">
            <details className="group self-start bg-blue-50/55 p-6 sm:p-8">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-xl font-bold text-ink">
                Risk score breakdown <span aria-hidden="true" className="text-bay group-open:rotate-45 motion-safe:transition-transform">+</span>
              </summary>
              <div className="score-breakdown-content mt-4 space-y-3">
                {prediction.scoreBreakdown.map((item) => (
                  <div key={`${item.label}-${item.points}`} className="flex items-center justify-between gap-5 bg-white/80 px-5 py-4">
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                    <span className={`text-sm font-black ${item.points < 0 ? "text-blue-700" : "text-ink"}`}>{item.points > 0 ? "+" : ""}{item.points}</span>
                  </div>
                ))}
              </div>
            </details>
            <div className="bg-blue-50/55 p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-bay">Morning commute</p>
              <h2 className="mt-2 text-3xl font-black text-ink">5 AM–9 AM risk</h2>
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><span className={`px-3 py-1.5 text-sm font-bold ${badgeClass(prediction.morningCommuteRisk.label)}`}>{prediction.morningCommuteRisk.label}</span><strong className="text-3xl text-ink">{prediction.morningCommuteRisk.score}/100</strong></div>
                <ul className="mt-6 divide-y divide-blue-100">{prediction.morningCommuteRisk.factors.map((factor) => <li key={factor} className="py-3 text-sm leading-6 text-slate-700">{factor}</li>)}</ul>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-[1400px] text-center">
              <h2 className="text-3xl font-black text-ink sm:text-4xl">2026 Predictions</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">Each prediction is based on forecast weather conditions and their expected effect on school travel and operations. Final decisions are made by the school district.</p>

              <div className="mt-10 overflow-hidden bg-blue-50/60 text-center">
                <div className="hidden grid-cols-[1.05fr_1fr_0.8fr_1fr] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
                  <span>Date</span><span>Prediction</span><span>Confidence</span><span>Final outcome</span>
                </div>
                <div className="space-y-2 p-2">
                  {predictionHistory.map((entry) => (
                    <article key={entry.date} className="grid gap-3 bg-white/90 px-6 py-5 md:grid-cols-[1.05fr_1fr_0.8fr_1fr] md:items-center md:gap-4">
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-600 md:hidden">Date</span><p className="font-bold text-ink">{entry.date}</p></div>
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-600 md:hidden">Prediction</span><p className="font-semibold text-slate-700">{entry.prediction}</p></div>
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-600 md:hidden">Confidence</span><p className="text-sm font-semibold text-slate-600">{entry.confidence}%</p></div>
                      <div><span className="text-xs font-bold uppercase tracking-wide text-slate-600 md:hidden">Final outcome</span><p className="font-bold text-emerald-700">{entry.outcome}</p></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-red-50 px-5 py-8 text-red-800 sm:px-8"><h2 className="font-bold">Prediction unavailable</h2><p className="mt-2 text-sm">{error}</p></section>
      )}
    <section aria-labelledby="prediction-faq" className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <h2 id="prediction-faq" className="mb-7 text-center text-3xl font-semibold text-ink">Prediction FAQs</h2>
      <div className="grid gap-2">
        {[
          ["Does the prediction tell me whether school is officially closed?", "No. Your school district makes the final decision. Check its official announcements before changing your plans."],
          ["Is the impact score the chance of a closure?", "No. The score is a 0 to 100 summary of weather hazards, including precipitation, temperature, and travel timing."],
          ["Why might the prediction change?", "New forecasts and alerts can change what the model expects during the school travel window."]
        ].map(([question, answer]) => (
          <details key={question} name="prediction-faq" className="group bg-ice px-5">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-ink">
              {question}
              <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-bay group-open:hidden" />
              <Minus aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-bay group-open:block" />
            </summary>
            <p className="pb-5 text-sm leading-6 text-slate-700">{answer}</p>
          </details>
        ))}
      </div>
    </section>
    </main>
  );
}

function ScoreBar({ label, score, note }: { label: string; score: number; note: string }) {
  return <div><div className="flex items-end justify-between gap-4"><div><p className="text-lg font-black text-ink">{label}</p><p className="mt-1 text-sm font-semibold text-slate-500">{note}</p></div><strong className="shrink-0 text-3xl text-ink">{score}<span className="text-sm font-medium"> / 100</span></strong></div><div aria-hidden="true" className="mt-4 h-2 bg-slate-100"><div className="prediction-score-fill h-full bg-bay" style={{ width: `${Math.min(100, Math.max(score, 0))}%` }} /></div></div>;
}

function MethodStep({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <article className="bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wide text-bay">{label}</p><h3 className="mt-3 text-xl font-bold text-ink">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{children}</p></article>;
}
