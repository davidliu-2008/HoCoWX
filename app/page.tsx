import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CloudSun,
  Eye,
  Gauge,
  Info,
  Instagram,
  Mail,
  School,
  Snowflake,
  Thermometer,
  Users,
  Wind
} from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { getHcpssStatus } from "@/lib/hcpss-status";
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
      </div>
    </section>
  );
}

function PartnershipPreview() {
  return (
    <section id="partnership-preview" className="scroll-mt-5 border-y border-blue-200 bg-blue-50/55 px-1 py-6 sm:px-5 lg:px-7 lg:py-8">
      <div className="grid items-start gap-6 xl:grid-cols-[0.82fr_1.18fr] xl:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">What&apos;s Coming</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Weather information inside the HCPSS experience</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
            HoCo Weather Channel will be integrated into the official HCPSS structure, bringing timely environmental
            news and weather literacy resources to 66,000 students and staff.
          </p>

          <div className="mt-6 divide-y divide-blue-100 border-y border-blue-100">
            <div className="flex gap-3 py-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
              <div>
                <h3 className="font-bold text-ink">Working with the HCPSS weather team</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">Developing useful weather information and literacy resources for the school community.</p>
              </div>
            </div>
            <div className="flex gap-3 py-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
              <div>
                <h3 className="font-bold text-ink">Contributing to weather-related discussions</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">Sitting in on operational decision discussions and contributing weather analysis to help determine those decisions.</p>
              </div>
            </div>
            <div className="flex gap-3 py-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
              <div>
                <h3 className="font-bold text-ink">Reaching the full HCPSS community</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">Serving environmental news to approximately 66,000 students and staff through familiar district platforms.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-bay">Proof of concept</p>
              <h3 className="mt-1 font-bold text-ink">Sample Canvas homepage announcement</h3>
            </div>
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-bay">Concept preview</span>
          </div>

          <div className="overflow-hidden border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-red-700" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-500">HCPSS Canvas</p>
                  <p className="text-sm font-bold text-slate-800">Student Homepage</p>
                </div>
              </div>
              <BellRing className="h-5 w-5 text-slate-500" />
            </div>

            <div className="grid md:grid-cols-[0.28fr_0.72fr]">
              <div className="hidden border-r border-slate-200 bg-slate-50/70 p-4 md:block">
                <div className="space-y-3 text-sm text-slate-500">
                  <p className="font-semibold text-slate-800">Home</p>
                  <p>Courses</p>
                  <p>Calendar</p>
                  <p>Resources</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Special Weather Announcement</p>
                <div className="mt-3 overflow-hidden border-l-4 border-bay bg-blue-50">
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-bay text-white">
                      <Snowflake className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-bold text-ink">Winter weather update</h4>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-bay">HoCoWX</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        A period of winter weather may affect Howard County. Review the latest timing, impacts, and safety information before travel.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
                        <span>Timing: Overnight into morning</span>
                        <span>Primary concern: Icy roads</span>
                      </div>
                      <button type="button" className="mt-4 bg-bay px-4 py-2 text-sm font-bold text-white">
                        View weather briefing
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Sample layout for discussion purposes. Final placement and language will be developed with HCPSS.
                </p>
              </div>
            </div>
          </div>
        </div>
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
            {prediction.data.disclaimer}
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

export default async function Home() {
  const [status, weather] = await Promise.all([
    safeLoad(getHcpssStatus),
    safeLoad(getWeatherSummary)
  ]);
  const prediction: LoadState<PredictionResult> = weather.ok
    ? { ok: true, data: createPrediction({ weather: weather.data }) }
    : { ok: false, error: weather.error };

  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-5 lg:px-6">
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
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href="mailto:howardcountyweather@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href="https://www.instagram.com/hocoweatherchannel/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
          <div className="rounded-lg border border-blue-100 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
            Last updated: {formatTime(weather.ok ? weather.data.fetchedAt : status.ok ? status.data.fetchedAt : new Date().toISOString())}
          </div>
        </div>
      </header>

      <PageTabs active="dashboard" />

      <section
        className="mb-3 overflow-hidden border-y border-blue-200 bg-white/80"
        aria-label="HoCo Weather Channel partnership and audience"
      >
        <div className="grid md:grid-cols-[1.6fr_0.7fr_0.7fr]">
          <a
            href="#partnership-preview"
            className="group flex items-start gap-4 px-5 py-5 transition hover:bg-blue-50 md:items-center md:border-r md:border-blue-100 lg:px-7"
            aria-label="View what is coming through the HCPSS partnership"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-bay text-white">
              <School className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-bay">HCPSS Partnership</p>
              <h2 className="mt-1 text-xl font-bold text-ink">Partnering with Howard County Public School System</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                We&apos;re working together on weather literacy resources, with updates coming this winter.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-bay">
                See what&apos;s coming
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </a>
          <div className="flex items-center gap-3 border-t border-blue-100 px-5 py-5 md:border-t-0 md:border-r">
            <Eye className="h-6 w-6 shrink-0 text-bay" />
            <div>
              <p className="text-2xl font-bold text-ink">2.1M+</p>
              <p className="text-sm text-slate-600">Views across all platforms</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-blue-100 px-5 py-5 md:border-t-0">
            <Users className="h-6 w-6 shrink-0 text-bay" />
            <div>
              <p className="text-2xl font-bold text-ink">700K+</p>
              <p className="text-sm text-slate-600">People reached</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <HcpssCard status={status} />
        <PredictionCard prediction={prediction} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
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
      </div>

      <div className="mt-3">
        <PartnershipPreview />
      </div>

    </main>
  );
}
