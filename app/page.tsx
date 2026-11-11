import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CloudSun,
  Gauge,
  GraduationCap,
  ExternalLink,
  Mic2,
  Radar,
  School,
  Snowflake,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind
} from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { CountyPreference } from "@/components/CountyPreference";
import { getHcpssStatus } from "@/lib/hcpss-status";
import { getMarylandDistrictStatus } from "@/lib/maryland-operations";
import { getMarylandDistrict, marylandDistricts } from "@/lib/maryland-districts";
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

function TemperatureComparison({ weather }: { weather: WeatherSummary }) {
  const current = weather.currentTemperatureF;
  const yesterday = weather.yesterdayTemperatureF;

  if (current === null || yesterday === null || yesterday === undefined) {
    return <span>Yesterday comparison unavailable</span>;
  }

  const difference = current - yesterday;

  if (difference === 0) {
    return <span>Same temperature as this time yesterday</span>;
  }

  const warmer = difference > 0;

  return (
    <span className="inline-flex items-center gap-1.5">
      {warmer ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      {Math.abs(difference)}° {warmer ? "warmer" : "colder"} than this time yesterday
    </span>
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

function HourlyTimeline({ weather }: { weather: WeatherSummary }) {
  return (
    <section id="hourly-forecast" className="scroll-mt-24 bg-blue-50/45 px-5 py-9 md:px-7 md:py-11">
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

function outlookBadgeClass(level: "Low" | "Medium" | "High") {
  switch (level) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}

function FiveDaySchoolOutlook({ weather }: { weather: WeatherSummary }) {
  const days = weather.schoolDayOutlook ?? [];

  return (
    <section className="bg-white px-5 py-9 md:px-7 md:py-11">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-bay">School-week planning</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-black text-ink md:text-3xl">
            <CalendarDays className="h-6 w-6 text-bay" /> Five-Day School Outlook
          </h2>
        </div>
        <p className="text-sm text-slate-500">Weather impact only · NWS forecast</p>
      </div>

      {days.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {days.map((day) => (
            <article key={day.date} className="flex min-h-64 flex-col rounded-lg bg-ice p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-ink">{day.dayName}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{compactTime(day.date).split(",")[0]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${outlookBadgeClass(day.impactLevel)}`}>
                  {day.impactLevel}
                </span>
              </div>
              <p className="mt-5 text-3xl font-black text-bay">{day.temperatureF}°</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">{day.shortForecast}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">Precipitation {day.precipitationChance ?? 0}%</p>
              <p className="mt-auto pt-5 text-xs leading-5 text-slate-600">{day.impactReason}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-ice p-4 text-sm text-slate-600">The school-day outlook is temporarily unavailable.</p>
      )}
    </section>
  );
}

function LiveRadar() {
  const radarPage = "https://radar.weather.gov/station/KLWX/standard";

  return (
    <section className="overflow-hidden bg-navy text-white">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Updated by the National Weather Service</p>
          <h2 className="mt-2 flex items-center gap-2 text-3xl font-black">
            <Radar className="h-7 w-7" /> Live Regional Radar
          </h2>
          <p className="mt-4 leading-7 text-blue-100">
            Animated KLWX radar covers Howard County and the Baltimore-Washington region. The loop updates approximately every five minutes.
          </p>
          <a
            href={radarPage}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-white px-4 py-3 font-bold text-navy transition hover:bg-blue-50"
          >
            Open interactive radar <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <a href={radarPage} target="_blank" rel="noreferrer" className="relative block min-h-80 bg-black lg:min-h-[520px]">
          <img
            src="https://radar.weather.gov/ridge/standard/KLWX_loop.gif"
            alt="Animated National Weather Service KLWX regional radar loop"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </a>
      </div>
    </section>
  );
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

function DistrictStatusCard({ status, isHoward }: { status: LoadState<HcpssStatus>; isHoward: boolean }) {
  return (
    <section className="bg-white px-5 py-9 md:px-7 md:py-11">
      <div className="mb-5 flex items-start gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
            <School className="h-4 w-4" />
            Official {isHoward ? "HCPSS" : "District"} Status
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

function WeatherCard({ weather, county }: { weather: LoadState<WeatherSummary>; county: string }) {
  if (!weather.ok) {
    return (
      <section className="bg-white px-5 py-9 md:px-7 md:py-11">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
          <CloudSun className="h-5 w-5 text-bay" />
          {county} Weather
        </h2>
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Weather data could not be loaded. {weather.error}
        </p>
      </section>
    );
  }

  const data = weather.data;

  return (
    <section className="bg-white px-5 py-9 md:px-7 md:py-11">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <CloudSun className="h-5 w-5 text-bay" />
            {county} Weather
          </h2>
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

      <div className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-bay">
        <TemperatureComparison weather={data} />
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

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Forecasts and alerts from the National Weather Service
        {data.yesterdayTemperatureSource === "Visual Crossing" ? (
          <>
            {" · "}Historical comparison powered by{" "}
            <a href="https://www.visualcrossing.com/" target="_blank" rel="noreferrer" className="font-semibold text-bay hover:underline">
              Visual Crossing Weather
            </a>
          </>
        ) : null}
      </p>
    </section>
  );
}

function PredictionCard({ prediction }: { prediction: LoadState<PredictionResult> }) {
  return (
    <section className="bg-blue-50/45 px-5 py-9 md:px-7 md:py-11">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-ink">
        <Gauge className="h-5 w-5 text-bay" />
        Prediction
      </h2>

      {prediction.ok ? (
        <>
          <div className="mb-6 flex flex-col gap-4 border-y border-blue-200 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Weather-based estimate</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-2xl font-bold text-ink">{prediction.data.label}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${predictionBadgeClass(prediction.data.riskLevel)}`}>
                  {prediction.data.riskLevel} risk
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-slate-500">Confidence</p>
              <p className="text-3xl font-bold text-ink">{prediction.data.confidence}%</p>
              <p className="text-sm text-slate-500">{prediction.data.riskLevel} risk</p>
            </div>
          </div>

          <div className="mb-5">
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

export default async function Home({ searchParams }: { searchParams: Promise<{ county?: string }> }) {
  const requestedCounty = (await searchParams).county ?? "howard";
  const district = getMarylandDistrict(requestedCounty) ?? getMarylandDistrict("howard")!;
  const isHoward = district.slug === "howard";
  const [status, weather] = await Promise.all([
    safeLoad(async () => {
      if (isHoward) return getHcpssStatus();
      const operation = await getMarylandDistrictStatus(district.slug);
      if (!operation) throw new Error("District status is unavailable.");
      return {
        heading: `${district.county} school operations`,
        updateDate: operation.lastUpdated,
        operationStatus: operation.status,
        message: operation.matchedText ?? `Check the official ${district.district} source for additional details.`,
        sourceUrl: operation.statusUrl,
        fetchedAt: operation.checkedAt
      } satisfies HcpssStatus;
    }),
    safeLoad(() => getWeatherSummary({ latitude: district.latitude, longitude: district.longitude, location: district.county }))
  ]);
  const prediction: LoadState<PredictionResult> = weather.ok
    ? { ok: true, data: createPrediction({ weather: weather.data }) }
    : { ok: false, error: weather.error };

  return (
    <main className="min-h-screen w-full pb-6">
      <PageTabs active="dashboard" />

      <header className="home-hero relative mt-4 overflow-hidden rounded-lg bg-navy px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <Image
          src="/photography/howard-county-winter-sunset.jpg"
          alt="Snow-covered Howard County landscape beneath a winter sunset"
          fill
          priority
          sizes="(max-width: 1480px) 100vw, 1440px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#091b36]/95 via-[#102f5c]/82 to-[#12305f]/45" />
        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-200">HoCo Weather Channel</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">By students. For students.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100 md:text-xl">
              Local weather, school operations, and environmental news for the Maryland community.
            </p>
            <Link href="#hourly-forecast" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-navy transition hover:bg-blue-50">
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
              {weather.ok ? (
                <p className="mt-2 text-xs font-semibold leading-5 text-blue-100">
                  <TemperatureComparison weather={weather.data} />
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-200">{isHoward ? "HCPSS" : district.county}</p>
              <p className="mt-1 text-xl font-black leading-tight">{status.ok ? status.data.operationStatus : "Unavailable"}</p>
              <p className="mt-2 text-sm text-blue-100">Updated {formatTime(status.ok ? status.data.fetchedAt : undefined)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white px-4 py-4 sm:px-6">
        <CountyPreference counties={marylandDistricts.map(({ slug, county }) => ({ slug, county }))} selected={district.slug} />
      </div>

      <div id="today">
        <DistrictStatusCard status={status} isHoward={isHoward} />
        <PredictionCard prediction={prediction} />
        <WeatherCard weather={weather} county={district.county} />
        {weather.ok ? <HourlyTimeline weather={weather.data} /> : null}
        {weather.ok ? <FiveDaySchoolOutlook weather={weather.data} /> : null}
        <LiveRadar />
      </div>

      <section className="home-editorial-band bg-white px-4 py-10 sm:px-6 md:py-14">
        <div className="space-y-8">
          <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative min-h-72 overflow-hidden rounded-lg sm:min-h-96">
              <Image
                src="/photography/winter-weather-literacy.jpg"
                alt="A winter scene with snow-covered holly and local wildlife"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="lg:px-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Beyond the forecast</p>
            <h2 className="mt-2 text-3xl font-black text-ink md:text-5xl">Weather knowledge built for students.</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
              Learn how to read forecasts, understand winter hazards, and make evidence-based predictions with official weather sources.
            </p>
            <Link href="/weather-literacy" className="mt-6 inline-flex items-center gap-2 font-bold text-bay hover:underline">
              Visit the Weather Literacy Center <ArrowRight className="h-4 w-4" />
            </Link>
            </div>
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
