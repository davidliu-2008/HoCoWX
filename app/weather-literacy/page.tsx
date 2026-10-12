import { AlertTriangle, BookOpen, Clock3, CloudSnow, Gauge, Instagram, Mail, Snowflake, ThermometerSnowflake, Wind } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";

export const metadata = {
  title: "Weather Literacy Center | HoCo Weather Channel",
  description: "Student-friendly guides to forecasts, winter weather, alerts, and school-impact timing."
};

const lessons = [
  {
    icon: AlertTriangle,
    title: "Watch vs. Warning",
    text: "A watch means hazardous weather is possible. A warning means it is expected or already occurring. Warnings call for action, while watches are the time to prepare."
  },
  {
    icon: Snowflake,
    title: "Reading a Snow Forecast",
    text: "Snow totals are ranges, not guarantees. Temperature, storm track, snow ratios, and small changes in timing can move the final amount up or down."
  },
  {
    icon: ThermometerSnowflake,
    title: "Why Ice Matters",
    text: "A thin layer of freezing rain can be more disruptive than several inches of snow. Bridges, untreated roads, sidewalks, and parking lots may become hazardous quickly."
  },
  {
    icon: Clock3,
    title: "Timing and the School Day",
    text: "The same storm can have very different effects depending on when it arrives. Conditions during the 5–9 AM commute carry more school-operation risk than precipitation after dismissal."
  },
  {
    icon: Wind,
    title: "Wind and Visibility",
    text: "Strong gusts can reduce visibility, create blowing snow, bring down branches, and make bus travel more difficult even when snowfall totals are modest."
  },
  {
    icon: Gauge,
    title: "Forecast Confidence",
    text: "Confidence describes how strongly the available evidence agrees. A high-impact forecast can still have low confidence, especially when the rain-snow line is close to Howard County."
  }
];

export default function WeatherLiteracyPage() {
  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-5 lg:px-6">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img src="/hoco-weather-channel-logo.png" alt="HoCo Weather Channel" className="h-20 w-20 border border-blue-100 bg-white object-contain p-2" />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><BookOpen className="h-4 w-4" /> Learn the forecast</p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Weather Literacy Center</h1>
            <p className="mt-2 text-lg text-slate-600">By students. For students.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="mailto:howardcountyweather@gmail.com" className="inline-flex items-center gap-2 border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay"><Mail className="h-4 w-4" /> Email</a>
          <a href="https://www.instagram.com/hocoweatherchannel/?hl=en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay"><Instagram className="h-4 w-4" /> Instagram</a>
        </div>
      </header>

      <PageTabs active="literacy" />

      <section className="border-y border-blue-200 bg-blue-50/60 px-5 py-7 sm:px-7">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">Start Here</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Understand the weather before making the call</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Weather literacy means knowing what a forecast says, what it does not say, and how changing conditions affect real decisions. Use these guides when reviewing a HoCoWX briefing or making your own prediction.
          </p>
        </div>
      </section>

      <section className="grid border-b border-blue-100 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map(({ icon: Icon, title, text }) => (
          <article key={title} className="border-b border-blue-100 p-5 md:border-r sm:p-7">
            <Icon className="h-6 w-6 text-bay" />
            <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 border-b border-blue-100 py-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">A simple process</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">How to evaluate a forecast</h2>
        </div>
        <ol className="divide-y divide-blue-100 border-y border-blue-100">
          <li className="py-4 text-slate-700"><strong className="mr-2 text-bay">1.</strong>Check official National Weather Service alerts and forecast text.</li>
          <li className="py-4 text-slate-700"><strong className="mr-2 text-bay">2.</strong>Compare timing with arrival, dismissal, and the morning commute.</li>
          <li className="py-4 text-slate-700"><strong className="mr-2 text-bay">3.</strong>Look for ice, rapid temperature drops, heavy rates, and strong wind.</li>
          <li className="py-4 text-slate-700"><strong className="mr-2 text-bay">4.</strong>Recheck later forecasts and explain what changed.</li>
        </ol>
      </section>

      <aside className="mt-3 flex gap-4 border-l-4 border-bay bg-white px-5 py-4 text-sm leading-6 text-slate-600">
        <CloudSnow className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
        <p>HoCo Weather Channel educational material is not a substitute for official alerts or emergency instructions. Always follow the National Weather Service and local authorities during hazardous weather.</p>
      </aside>
    </main>
  );
}
