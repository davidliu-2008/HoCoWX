import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  CloudSun,
  Gauge,
  School,
  Snowflake,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind
} from "lucide-react";
import { DashboardAnnouncement } from "@/components/DashboardAnnouncement";
import { PageTabs } from "@/components/PageTabs";
import { CountyPreference } from "@/components/CountyPreference";
import { LiveRadar } from "@/components/LiveRadar";
import { PartnershipSelector } from "@/components/PartnershipSelector";
import { getHcpssStatus } from "@/lib/hcpss-status";
import { getMarylandDistrictStatus } from "@/lib/maryland-operations";
import { getMarylandDistrict, marylandDistricts } from "@/lib/maryland-districts";
import { createStoredImpactPrediction } from "@/lib/impact-service";
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
    <div>
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
  const hours = weather.hourlyForecast.slice(0, 12);
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", weekday: "short", hour: "numeric", hourCycle: "h23"
  });
  const nextFreezing = hours.find((hour) => hour.temperatureF <= 32);
  const nextPrecipitation = hours.find((hour) => (hour.precipitationChance ?? -1) >= 50);

  return (
    <section id="hourly-forecast" className="scroll-mt-24 bg-white py-7">
      <div className="mb-5">
        <h2 id="hourly-heading" className="text-2xl font-bold text-ink">Weather through the day</h2>
        {(nextFreezing || nextPrecipitation) && (
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
            {nextFreezing && <div><dt className="text-sm text-slate-600">First hour at or below freezing</dt><dd className="font-semibold text-ink">{compactTime(nextFreezing.time)}</dd></div>}
            {nextPrecipitation && <div><dt className="text-sm text-slate-600">First hour with 50%+ chance of precipitation</dt><dd className="font-semibold text-ink">{compactTime(nextPrecipitation.time)} · {nextPrecipitation.precipitationChance}%</dd></div>}
          </dl>
        )}
      </div>
      {hours.length === 0 ? <p className="text-sm text-slate-600">Hourly forecast unavailable.</p> : (
      <div role="region" aria-labelledby="hourly-heading" tabIndex={0} className="-mx-1 snap-x overflow-x-auto px-1 pb-3">
        <ol className="flex w-max min-w-full">
        {hours.map((hour) => {
          const parts = localTime.formatToParts(new Date(hour.time));
          const weekday = parts.find((part) => part.type === "weekday")?.value;
          const clockHour = Number(parts.find((part) => part.type === "hour")?.value);
          const weekdayTravel = weekday !== "Sat" && weekday !== "Sun";
          const window = weekdayTravel && clockHour >= 5 && clockHour < 9 ? "Morning travel" :
            weekdayTravel && clockHour >= 14 && clockHour < 17 ? "Afternoon travel" : null;
          return (
          <li key={hour.time} className={`w-44 shrink-0 snap-start px-3 py-4 md:w-48 ${window ? "bg-ice" : ""}`}>
            <time dateTime={hour.time} className="block text-sm font-bold text-ink">{compactTime(hour.time)}</time>
            <div className="mt-1 min-h-5 text-xs font-semibold text-bay">{window}</div>
            <div className="mt-2 text-2xl font-bold text-ink">{hour.temperatureF}°F</div>
            <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">{hour.shortForecast}</p>
            <p className="mt-3 text-xs font-medium text-slate-500">
              Precip {hour.precipitationChance == null ? "unavailable" : `${hour.precipitationChance}%`} · {hour.windSpeed}
            </p>
          </li>
        );})}
        </ol>
      </div>
      )}
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
    <section className="bg-white py-7">
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

function airQualityMeaning(index: number): { label: string; meaning: string } {
  if (index <= 50) return { label: "Good", meaning: "Air pollution poses little or no risk." };
  if (index <= 100) return { label: "Moderate", meaning: "Air quality is acceptable for most people. Those unusually sensitive to air pollution may still be affected." };
  if (index <= 150) return { label: "Unhealthy for sensitive groups", meaning: "People sensitive to air pollution may be affected, especially during outdoor activity." };
  if (index <= 200) return { label: "Unhealthy", meaning: "Anyone may be affected, with greater risk for sensitive groups." };
  if (index <= 300) return { label: "Very unhealthy", meaning: "Air pollution poses an increased health risk for everyone." };
  return { label: "Hazardous", meaning: "Everyone is more likely to experience health effects from air pollution." };
}

function DistrictStatusCard({ status, isHoward }: { status: LoadState<HcpssStatus>; isHoward: boolean }) {
  return (
    <section className="bg-white py-7 lg:pr-8">
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
      <section className="bg-white py-7">
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
  const snowMentioned = [
    data.shortForecast, data.detailedForecast, data.overnightForecast, data.morningForecast,
    ...data.hourlyForecast.map(({ shortForecast }) => shortForecast),
    ...data.alerts.map(({ event }) => event)
  ].some((text) => /\b(?:snow\w*|blizzard|winter storm|winter weather advisory)\b/i.test(text ?? ""));
  const airQuality = data.visualCrossingAirQuality;
  const airQualitySummary = airQuality && airQualityMeaning(airQuality.index);
  const overnightForecast = (data.overnightForecast ?? data.morningForecast ?? data.detailedForecast)
    ?.replace(/\s+(?:Calm wind|(?:North|South|East|West|Northeast|Northwest|Southeast|Southwest|Light and variable) wind (?:(?:around|up to) )?(?:\d+ to )?[1-9]?\d mph(?:, with gusts as high as [12]?\d mph)?)\./gi, (sentence) =>
      /\b(?:[3-9]\d|\d{3,}) mph\b/.test(sentence) ? sentence : ""
    )
    .trim();

  return (
    <section className="bg-white py-7">
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

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
        <Stat
          icon={<Thermometer className="h-4 w-4" />}
          label="Temperature"
          value={data.currentTemperatureF === null ? "Unavailable" : `${data.currentTemperatureF}°F`}
        />
        <Stat
          icon={<CloudSun className="h-4 w-4" />}
          label="Precipitation chance"
          value={data.precipitationChance === null ? "Unavailable" : `${data.precipitationChance}%`}
        />
        <Stat
          icon={<Snowflake className="h-4 w-4" />}
          label="Expected Snow"
          value={data.expectedSnowfallInches === null
            ? snowMentioned ? "Amount not reported" : "None expected"
            : `${data.expectedSnowfallInches} in`}
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
        {(overnightForecast || (airQuality && airQualitySummary)) && (
          <div className={`grid gap-5 ${overnightForecast && airQuality && airQualitySummary ? "md:grid-cols-2 md:gap-8" : ""}`}>
            {overnightForecast && (
              <div>
                <h3 className="mb-2 text-base font-bold text-ink">Overnight and morning forecast</h3>
                <p className="leading-7 text-slate-600">{overnightForecast}</p>
              </div>
            )}
            {airQuality && airQualitySummary && (
              <div>
                <h3 className="mb-2 text-base font-bold text-ink">Air quality: {airQualitySummary.label}</h3>
                <p className="text-sm leading-6 text-slate-700">{airQualitySummary.meaning}</p>
                <a href="https://www.airnow.gov/aqi/aqi-basics/" className="mt-1 inline-block text-xs font-semibold text-bay underline">AQI {airQuality.index}</a>
              </div>
            )}
          </div>
        )}
        {data.alerts.length > 0 && <div>
          <h3 className="mb-2 text-base font-bold text-ink">
            Weather alerts
          </h3>
            <div className="space-y-2">
              {data.alerts.map((alert) => (
                <p key={`${alert.event}-${alert.headline}`} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  <span className="font-semibold">{alert.event}</span>
                  {alert.headline ? `: ${alert.headline}` : ""}
                </p>
              ))}
            </div>
        </div>}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Forecasts and alerts: National Weather Service
        {(data.yesterdayTemperatureSource === "Visual Crossing" || airQuality) ? (
          <>
            {" · "}Historical weather and air quality:{" "}
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
    <section className="bg-white py-7 lg:pl-8">
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
              <p className="text-sm text-blue-100">Weather impact score</p>
              <p className="text-3xl font-bold">{prediction.data.confidence}<span className="text-base font-medium"> / 100</span></p>
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
    ? {
        ok: true,
        data: (await createStoredImpactPrediction({
          weather: weather.data,
          districtSlug: district.slug,
          county: district.county
        })).prediction
      }
    : { ok: false, error: weather.error };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen w-full bg-white pb-0">
      <PageTabs active="dashboard" />
      <DashboardAnnouncement />

      <header className="home-hero relative overflow-hidden bg-navy px-5 py-6 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <Image
          src="/photography/howard-county-winter-sunset.jpg"
          alt="Snow-covered Howard County landscape beneath a winter sunset"
          fill
          priority
          sizes="(max-width: 1480px) 100vw, 1440px"
          className="dashboard-skyline object-cover object-[64%_58%] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#091b36]/95 via-[#102f5c]/82 to-[#12305f]/45" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-end gap-5 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-200">HoCo Weather Channel</p>
            <h1 className="dashboard-headline max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">By students. For students.</h1>
            <p className="mt-3 max-w-2xl text-base leading-6 text-blue-100 sm:mt-4 sm:text-lg sm:leading-8 md:text-xl">
              Local weather and school operations for the Maryland community.
            </p>
            <Link href={weather.ok && weather.data.hourlyForecast.length > 0 ? "#hourly-forecast" : "#today"} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-navy transition hover:bg-blue-50 sm:mt-7">
              {weather.ok && weather.data.hourlyForecast.length > 0 ? "View hourly forecast" : "View dashboard details"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div key={district.slug} className="county-data-in grid grid-cols-2 gap-6 pt-3 lg:ml-6 lg:pl-10 lg:pr-8 lg:pt-0 xl:ml-10 xl:pl-12 xl:pr-12">
            <div>
              <p className="text-sm font-semibold text-blue-200">{district.county} now</p>
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

      <div className="bg-white py-4">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <CountyPreference counties={marylandDistricts.map(({ slug, county }) => ({ slug, county }))} selected={district.slug} />
        </div>
      </div>

      <div id="today" className="mx-auto w-full max-w-[1440px] scroll-mt-28 px-5 sm:px-8 lg:px-12">
        <div key={district.slug} className="county-data-in">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <DistrictStatusCard status={status} isHoward={isHoward} />
          <PredictionCard prediction={prediction} />
        </div>
        <WeatherCard weather={weather} county={district.county} />
        {weather.ok ? <HourlyTimeline weather={weather.data} /> : null}
        {weather.ok ? <FiveDaySchoolOutlook weather={weather.data} /> : null}
        </div>
        <LiveRadar />
      </div>

      <section className="page-content page-section bg-white">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">Built with trusted institutions.</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">HoCo Weather Channel works with school systems, weather companies, and data providers to strengthen forecasts, school-impact analysis, and weather literacy.</p>
        </div>
        <div className="mt-6">
          <PartnershipSelector homepage />
        </div>
      </section>

      <section className="bg-blue-50 px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mx-auto max-w-5xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            <span className="block">Weather models forecast the atmosphere.</span>
            <span className="mt-2 block text-bay">We forecast its impact on people.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
            HoCo Weather Channel is building the local intelligence layer that turns forecast data into clear guidance for school, travel, and daily life.
          </p>

          <div className="mt-12 grid gap-8 text-left md:grid-cols-3 md:gap-10">
            <div className="px-2 py-3 md:px-5">
              <h3 className="text-2xl font-black text-bay sm:text-3xl">Weather Data</h3>
              <p className="mt-4 text-lg leading-8 text-slate-700">Bring forecasts, alerts, and local observations together to show what is changing and when.</p>
            </div>
            <div className="px-2 py-3 md:px-5">
              <h3 className="text-2xl font-black text-bay sm:text-3xl">Impact Intelligence</h3>
              <p className="mt-4 text-lg leading-8 text-slate-700">Evaluate snowfall, freezing rain, temperature, wind, active alerts, and conditions during the 5–9 AM school commute.</p>
            </div>
            <div className="px-2 py-3 md:px-5">
              <h3 className="text-2xl font-black text-bay sm:text-3xl">Community Guidance</h3>
              <p className="mt-4 text-lg leading-8 text-slate-700">Produce school-operation predictions, morning commute risk scores, and a factor-by-factor explanation.</p>
            </div>
          </div>

          <Link href="/predictions" className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-md bg-navy px-6 py-3 font-bold text-white transition hover:bg-blue-900">
            Explore the impact model <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
