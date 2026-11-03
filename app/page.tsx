import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  BookOpen,
  CalendarClock,
  CloudSun,
  Gauge,
  GraduationCap,
  Mic2,
  School,
  Snowflake,
  Thermometer,
  Wind
} from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { getHcpssStatus } from "@/lib/hcpss-status";
import { createPrediction } from "@/lib/prediction";
import { getWeatherSummary } from "@/lib/weather";
import type { HcpssStatus, PredictionResult, WeatherSummary } from "@/lib/types";

const homepageTitle = "Maryland Weather & School Closings";
const homepageDescription = "Get Maryland weather forecasts, Maryland school closing updates, snow day predictions, and local weather alerts.";
const homepageUrl = "https://hocoweatherchannel.org/";

export const metadata: Metadata = {
  title: { absolute: homepageTitle },
  description: homepageDescription,
  alternates: { canonical: homepageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: homepageUrl,
    siteName: "Maryland Weather & School Closings",
    type: "website",
    locale: "en_US",
    images: [{
      url: "https://hocoweatherchannel.org/hoco-weather-channel-logo.png",
      width: 500,
      height: 500,
      alt: "Maryland weather and school closings logo"
    }]
  },
  twitter: {
    card: "summary",
    title: homepageTitle,
    description: homepageDescription,
    images: ["https://hocoweatherchannel.org/hoco-weather-channel-logo.png"]
  }
};

export const dynamic = "force-dynamic";

type LoadState<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function safeLoad<T>(loader: () => Promise<T>): Promise<LoadState<T>> {
  try {
    return { ok: true, data: await loader() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong."
    };
  }
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

function Stat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-l-2 border-blue-200 pl-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold text-ink">{value}</div>
    </div>
  );
}

function RiskBreakdownCard({ prediction }: { prediction: PredictionResult }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-panel md:p-7">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
        <Gauge className="h-5 w-5 text-bay" />
        Risk Score Breakdown
      </h2>
      <div className="space-y-3">
        {prediction.scoreBreakdown.map((item) => (
          <div key={`${item.label}-${item.points}`} className="flex items-center justify-between gap-4 rounded-lg bg-ice px-4 py-3">
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.points < 0 ? "bg-blue-100 text-blue-800" : "bg-white text-ink"}`}>
              {item.points > 0 ? "+" : ""}
              {item.points}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MorningCommuteCard({ prediction }: { prediction: PredictionResult }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
          <CalendarClock className="h-5 w-5 text-bay" />
          Morning Commute Risk
        </h2>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${predictionBadgeClass(prediction.morningCommuteRisk.label)}`}>
          {prediction.morningCommuteRisk.label}
        </span>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600">
        Focused on the 5 AM-9 AM school travel window. Score: {prediction.morningCommuteRisk.score}/100.
      </p>
      <ul className="space-y-2">
        {prediction.morningCommuteRisk.factors.map((factor) => (
          <li key={factor} className="flex gap-2 text-sm leading-6 text-slate-700">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-bay" />
            <span>{factor}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HourlyTimeline({ weather }: { weather: WeatherSummary }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-panel md:p-7">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
        <CloudSun className="h-5 w-5 text-bay" />
        Hourly Forecast Timeline
      </h2>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {weather.hourlyForecast.slice(0, 8).map((hour) => (
          <div key={hour.time} className="w-52 shrink-0 snap-start rounded-lg bg-ice p-4 md:w-56">
            <div className="mb-2 text-sm font-bold text-ink">{compactTime(hour.time)}</div>
            <div className="text-2xl font-bold text-bay">{hour.temperatureF} F</div>
            <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">{hour.shortForecast}</p>
            <p className="mt-3 text-xs font-medium text-slate-500">
              Precip {hour.precipitationChance ?? 0}% - {hour.windSpeed}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function predictionBadgeClass(riskLevel: PredictionResult["riskLevel"]) {
  switch (riskLevel) {
    case "High":
      return "bg-red-100 text-red-800 ring-red-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-900 ring-yellow-200";
    default:
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }
}

function compactTime(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

function HcpssCard({ status }: { status: LoadState<HcpssStatus> }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <div className="mb-5 flex items-start gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
            <School className="h-4 w-4" />
            Official HCPSS Status
          </div>
          <h2 className="text-2xl font-bold text-ink md:text-3xl">
            {status.ok ? status.data.operationStatus : "Status unavailable"}
          </h2>
        </div>
      </div>

      {status.ok ? (
        <>
          <p className="mb-4 text-lg font-medium text-slate-700">{status.data.heading}</p>
          <p className="leading-7 text-slate-600">{status.data.message}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>Update date: {status.data.updateDate ?? "Not listed"}</span>
          </div>
        </>
      ) : (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          The official HCPSS status page could not be reached. {status.error}
        </p>
      )}
    </section>
  );
}

function WeatherCard({ weather }: { weather: LoadState<WeatherSummary> }) {
  if (!weather.ok) {
    return (
      <section className="rounded-lg bg-white p-5 shadow-panel md:p-7">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
          <CloudSun className="h-5 w-5 text-bay" />
          Howard County Weather
        </h2>
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Weather data could not be loaded. {weather.error}
        </p>
      </section>
    );
  }

  const data = weather.data;

  return (
    <section className="rounded-lg bg-white p-5 shadow-panel md:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <CloudSun className="h-5 w-5 text-bay" />
            Howard County Weather
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {data.location} · Data from the National Weather Service
          </p>
        </div>
        <span className="rounded-full bg-frost px-3 py-1 text-sm font-semibold text-bay">
          {data.shortForecast ?? "Forecast"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          icon={<Thermometer className="h-4 w-4" />}
          label="Temperature"
          value={data.currentTemperatureF === null ? "Unavailable" : `${data.currentTemperatureF} F`}
        />
        <Stat
          icon={<CloudSun className="h-4 w-4" />}
          label="Precipitation"
          value={data.precipitationChance === null ? "Unavailable" : `${data.precipitationChance}%`}
        />
        <Stat
          icon={<Snowflake className="h-4 w-4" />}
          label="Expected Snow"
          value={data.expectedSnowfallInches === null ? "Unavailable" : `${data.expectedSnowfallInches} in`}
        />
        <Stat
          icon={<Wind className="h-4 w-4" />}
          label="Wind"
          value={[data.windSpeed, data.windGust ? `gusts ${data.windGust}` : null].filter(Boolean).join(", ") || "Unavailable"}
        />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Overnight / Morning
          </h3>
          <p className="leading-7 text-slate-600">
            {data.overnightForecast ?? data.morningForecast ?? data.detailedForecast ?? "No forecast text available."}
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Winter Weather Alerts
          </h3>
          {data.alerts.length ? (
            <div className="space-y-2">
              {data.alerts.map((alert) => (
                <p key={`${alert.event}-${alert.headline}`} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  <span className="font-semibold">{alert.event}</span>
                  {alert.headline ? `: ${alert.headline}` : ""}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No active NWS weather alerts for this point.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function PredictionCard({ prediction }: { prediction: LoadState<PredictionResult> }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-panel md:p-7">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-ink">
        <Gauge className="h-5 w-5 text-bay" />
        Prediction
      </h2>

      {prediction.ok ? (
        <>
          <div className="mb-5 flex flex-col gap-4 rounded-lg bg-navy p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Weather-based estimate</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-2xl font-bold">{prediction.data.label}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${predictionBadgeClass(prediction.data.riskLevel)}`}>
                  {prediction.data.riskLevel} risk
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-blue-100">Confidence</p>
              <p className="text-3xl font-bold">{prediction.data.confidence}%</p>
              <p className="text-sm text-blue-100">{prediction.data.riskLevel} risk</p>
            </div>
          </div>

          <div className="mb-5 rounded-lg bg-ice p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Top factors</h3>
            <ul className="space-y-2">
              {prediction.data.topFactors.map((factor) => (
                <li key={factor} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-warning" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="leading-7 text-slate-600">{prediction.data.explanation}</p>
          <Link href="/predictions" className="mt-5 inline-flex items-center font-bold text-bay hover:underline">
            See how this prediction is made
          </Link>
        </>
      ) : (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Prediction could not be created. {prediction.error}
        </p>
      )}
    </section>
  );
}

export default async function Home() {
  const [status, weather] = await Promise.all([
    safeLoad(getHcpssStatus),
    safeLoad(getWeatherSummary)
  ]);
  const prediction: LoadState<PredictionResult> = weather.ok
    ? { ok: true, data: createPrediction({ weather: weather.data }) }
    : { ok: false, error: weather.error };

  return (
    <main className="min-h-screen w-full pb-6">
      <PageTabs active="dashboard" />

      <header className="home-hero mt-4 overflow-hidden rounded-lg bg-navy px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-200">HoCo Weather Channel</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">By students. For students.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100 md:text-xl">
              Local weather, school operations, and environmental news for the Maryland community.
            </p>
            <Link href="#today" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-navy transition hover:bg-blue-50">
              View today&apos;s forecast <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 border-t border-white/20 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-sm font-semibold text-blue-200">Now</p>
              <p className="mt-1 text-4xl font-black">
                {weather.ok && weather.data.currentTemperatureF !== null ? `${weather.data.currentTemperatureF}°` : "--"}
              </p>
              <p className="mt-1 text-sm leading-5 text-blue-100">{weather.ok ? weather.data.shortForecast ?? "Forecast unavailable" : "Weather unavailable"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-200">HCPSS</p>
              <p className="mt-1 text-xl font-black leading-tight">{status.ok ? status.data.operationStatus : "Unavailable"}</p>
              <p className="mt-2 text-sm text-blue-100">Updated {formatTime(status.ok ? status.data.fetchedAt : undefined)}</p>
            </div>
          </div>
        </div>
      </header>

      <div id="today" className="space-y-6 px-4 py-7 sm:px-6 sm:py-9">
        <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Today at a glance</p>
            <h2 className="mt-1 text-3xl font-black text-ink md:text-4xl">The morning dashboard</h2>
          </div>
          <p className="text-sm text-slate-500">Updated {formatTime(weather.ok ? weather.data.fetchedAt : status.ok ? status.data.fetchedAt : new Date().toISOString())}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <HcpssCard status={status} />
          <PredictionCard prediction={prediction} />
        </div>

        <WeatherCard weather={weather} />
        {weather.ok ? <HourlyTimeline weather={weather.data} /> : null}

        {prediction.ok ? (
          <section className="grid gap-5 rounded-lg bg-blue-50 p-5 md:grid-cols-2 md:p-7">
            <MorningCommuteCard prediction={prediction.data} />
            <div className="flex flex-col justify-center px-1 py-3 md:px-5">
              <p className="text-sm font-bold uppercase tracking-wide text-bay">Prediction details</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Every point has a reason.</h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                Review the full score, weather factors, commute timing, and rules behind today&apos;s school operations prediction.
              </p>
              <Link href="/predictions" className="mt-5 inline-flex items-center gap-2 font-bold text-bay hover:underline">
                Open the prediction breakdown <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : null}
      </div>

      <section className="home-editorial-band bg-white px-4 py-10 sm:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Beyond the forecast</p>
            <h2 className="mt-2 text-3xl font-black text-ink md:text-5xl">Weather knowledge built for students.</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
              Learn how to read forecasts, understand winter hazards, and make evidence-based predictions with official weather sources.
            </p>
            <Link href="/weather-literacy" className="mt-6 inline-flex items-center gap-2 font-bold text-bay hover:underline">
              Visit the Weather Literacy Center <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/weather-literacy" className="editorial-link group bg-ice">
              <BookOpen className="h-7 w-7 text-bay" />
              <h3>Weather Literacy</h3>
              <p>Guides, official sources, and forecasting fundamentals.</p>
            </Link>
            <Link href="/student-polls" className="editorial-link group bg-sky-50">
              <GraduationCap className="h-7 w-7 text-bay" />
              <h3>Student Prediction Lab</h3>
              <p>See how students evaluated real weather events.</p>
            </Link>
            <Link href="/interview" className="editorial-link group bg-blue-50">
              <Mic2 className="h-7 w-7 text-bay" />
              <h3>Superintendent Interview</h3>
              <p>Hear how school operations decisions are made.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
