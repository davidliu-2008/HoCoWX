import {
  AlertTriangle,
  CalendarClock,
  CloudSun,
  ExternalLink,
  Gauge,
  Info,
  Instagram,
  MapPinned,
  School,
  Snowflake,
  Thermometer,
  Wind
} from "lucide-react";
import { getHcpssStatus } from "@/lib/hcpss-status";
import { getMarylandOperationsComparison, type MarylandOperationStatus } from "@/lib/maryland-operations";
import { createPrediction } from "@/lib/prediction";
import { getWeatherSummary } from "@/lib/weather";
import type { HcpssStatus, PredictionResult, WeatherSummary } from "@/lib/types";

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
    <div className="rounded-lg border border-blue-100 bg-white p-4">
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
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
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

function HowPredictionsSection() {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
        <Info className="h-5 w-5 text-bay" />
        How Predictions Are Made
      </h2>
      <div className="grid gap-4 text-sm leading-6 text-slate-600 md:grid-cols-3">
        <p>The model starts with a small base score, then adds points when official NWS data shows school-impact weather.</p>
        <p>Winter storm warnings, freezing rain, meaningful snow before the morning commute, strong gusts, and extreme cold raise the score.</p>
        <p>Timing matters. Weather that arrives after the morning commute is treated differently than snow or ice during bus travel hours.</p>
      </div>
    </section>
  );
}

function HourlyTimeline({ weather }: { weather: WeatherSummary }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
        <CloudSun className="h-5 w-5 text-bay" />
        Hourly Forecast Timeline
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {weather.hourlyForecast.slice(0, 8).map((hour) => (
          <div key={hour.time} className="rounded-lg border border-blue-100 bg-ice p-4">
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

function statusBadgeClass(statusKind: MarylandOperationStatus["statusKind"]) {
  switch (statusKind) {
    case "normal":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    case "delay":
      return "bg-yellow-100 text-yellow-900 ring-yellow-200";
    case "closed":
      return "bg-red-100 text-red-800 ring-red-200";
    case "virtual":
      return "bg-blue-100 text-blue-800 ring-blue-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
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
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
            <School className="h-4 w-4" />
            Official HCPSS Status
          </div>
          <h2 className="text-2xl font-bold text-ink md:text-3xl">
            {status.ok ? status.data.operationStatus : "Status unavailable"}
          </h2>
        </div>
        <a
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-ice text-slate-600 hover:border-bay hover:text-bay"
          href="https://status.hcpss.org/"
          aria-label="Open official HCPSS status page"
          title="Open official HCPSS status page"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {status.ok ? (
        <>
          <p className="mb-4 text-lg font-medium text-slate-700">{status.data.heading}</p>
          <p className="leading-7 text-slate-600">{status.data.message}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>Update date: {status.data.updateDate ?? "Not listed"}</span>
            <span>Fetched: {formatTime(status.data.fetchedAt)}</span>
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
      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
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
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <CloudSun className="h-5 w-5 text-bay" />
            Howard County Weather
          </h2>
          <p className="mt-1 text-sm text-slate-500">{data.location}</p>
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
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-ink">
        <Gauge className="h-5 w-5 text-bay" />
        Unofficial Prediction
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

          <div className="mb-5 rounded-lg border border-blue-100 bg-ice p-4">
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
          <p className="mt-4 rounded-lg bg-frost p-3 text-sm font-medium text-bay">
            {prediction.data.disclaimer} This app is not affiliated with, endorsed by, or operated by HCPSS.
          </p>
        </>
      ) : (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Prediction could not be created. {prediction.error}
        </p>
      )}
    </section>
  );
}

function MarylandComparisonSection({
  comparison
}: {
  comparison: LoadState<MarylandOperationStatus[]>;
}) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <MapPinned className="h-5 w-5 text-bay" />
            Maryland School Operations Comparison
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Comparison counties use county-specific parsers and default to Normal Operations when no current delay, closure, or modified-operation notice is found.
          </p>
        </div>
        <div className="rounded-lg bg-ice px-3 py-2 text-sm font-medium text-bay">
          Cached for 30 minutes
        </div>
      </div>

      {comparison.ok ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">County</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">School District</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">Status</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">Last Updated</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {comparison.data.map((item) => (
                <tr key={item.county} className="align-top odd:bg-ice/60">
                  <td className="border-b border-blue-50 px-3 py-3 font-semibold text-ink">
                    {item.county}
                    {item.county === "Howard County" ? (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-bay">
                        HCPSS
                      </span>
                    ) : null}
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3 text-slate-700">
                    {item.district}
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.parserType === "authoritative"
                        ? "Authoritative status page"
                        : item.parserType === "county-specific"
                          ? "County-specific parser"
                          : "Experimental parser"}
                    </span>
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusBadgeClass(item.statusKind)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3 text-slate-600">
                    {compactTime(item.lastUpdated ?? item.checkedAt)}
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3">
                    <a
                      href={item.statusUrl}
                      className="inline-flex items-center gap-1 font-semibold text-bay hover:underline"
                    >
                      Source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Maryland comparison data could not be loaded. {comparison.error}
        </p>
      )}
    </section>
  );
}

export default async function Home() {
  const [status, weather, comparison] = await Promise.all([
    safeLoad(getHcpssStatus),
    safeLoad(getWeatherSummary),
    safeLoad(getMarylandOperationsComparison)
  ]);
  const prediction: LoadState<PredictionResult> = weather.ok
    ? { ok: true, data: createPrediction({ weather: weather.data }) }
    : { ok: false, error: weather.error };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src="/hoco-weather-channel-logo.png"
            alt="HoCo Weather Channel"
            className="h-20 w-20 rounded-lg border border-blue-100 bg-white object-contain p-2 shadow-sm"
          />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
              <CalendarClock className="h-4 w-4" />
              Howard County, Maryland
            </p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">HCPSS Operations + Weather</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              A simple local dashboard that pairs the official HCPSS operations notice with National Weather Service data.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <a
            href="https://www.instagram.com/hocoweatherchannel/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </a>
          <div className="rounded-lg border border-blue-100 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
            Last updated: {formatTime(weather.ok ? weather.data.fetchedAt : status.ok ? status.data.fetchedAt : new Date().toISOString())}
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <HcpssCard status={status} />
        <PredictionCard prediction={prediction} />
        {prediction.ok ? <MorningCommuteCard prediction={prediction.data} /> : null}
        {prediction.ok ? <RiskBreakdownCard prediction={prediction.data} /> : null}
        <div className="lg:col-span-2">
          <WeatherCard weather={weather} />
        </div>
        {weather.ok ? (
          <div className="lg:col-span-2">
            <HourlyTimeline weather={weather.data} />
          </div>
        ) : null}
        <div className="lg:col-span-2">
          <HowPredictionsSection />
        </div>
        <div className="lg:col-span-2">
          <MarylandComparisonSection comparison={comparison} />
        </div>
      </div>
    </main>
  );
}
