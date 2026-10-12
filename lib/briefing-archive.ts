import type { PredictionResult, WeatherSummary } from "./types";

export type ArchivedBriefing = {
  briefing_date: string;
  issued_at: string;
  title: string;
  summary: string;
  temperature_f: number | null;
  precipitation_chance: number | null;
  snowfall_inches: number | null;
  wind_speed: string | null;
  wind_gust: string | null;
  alerts: WeatherSummary["alerts"];
  prediction_label: PredictionResult["label"];
  prediction_risk: PredictionResult["riskLevel"];
  prediction_confidence: number;
  prediction_explanation: string;
  top_factors: string[];
};

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export function easternDate(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function createArchivedBriefing(weather: WeatherSummary, prediction: PredictionResult): ArchivedBriefing {
  return {
    briefing_date: easternDate(new Date(weather.fetchedAt)),
    issued_at: weather.fetchedAt,
    title: weather.shortForecast ?? "Howard County weather update",
    summary: weather.detailedForecast ?? weather.overnightForecast ?? "No detailed forecast was available.",
    temperature_f: weather.currentTemperatureF,
    precipitation_chance: weather.precipitationChance,
    snowfall_inches: weather.expectedSnowfallInches,
    wind_speed: weather.windSpeed,
    wind_gust: weather.windGust,
    alerts: weather.alerts,
    prediction_label: prediction.label,
    prediction_risk: prediction.riskLevel,
    prediction_confidence: prediction.confidence,
    prediction_explanation: prediction.explanation,
    top_factors: prediction.topFactors
  };
}

export async function archiveDailyBriefing(briefing: ArchivedBriefing) {
  const config = supabaseConfig();

  if (!config) {
    return { saved: false, reason: "Archive storage is not configured." };
  }

  const response = await fetch(`${config.url}/rest/v1/weather_briefings?on_conflict=briefing_date`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal"
    },
    body: JSON.stringify(briefing),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Briefing archive request failed with ${response.status}.`);
  }

  return { saved: true, reason: null };
}

export async function getArchivedBriefings(limit = 120): Promise<ArchivedBriefing[]> {
  const config = supabaseConfig();

  if (!config) {
    return [];
  }

  const fields = [
    "briefing_date", "issued_at", "title", "summary", "temperature_f", "precipitation_chance",
    "snowfall_inches", "wind_speed", "wind_gust", "alerts", "prediction_label", "prediction_risk",
    "prediction_confidence", "prediction_explanation", "top_factors"
  ].join(",");
  const response = await fetch(
    `${config.url}/rest/v1/weather_briefings?select=${fields}&order=briefing_date.desc&limit=${limit}`,
    {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      next: { revalidate: 300 }
    }
  );

  if (!response.ok) {
    throw new Error(`Briefing archive request failed with ${response.status}.`);
  }

  return response.json() as Promise<ArchivedBriefing[]>;
}

export function archiveIsConfigured() {
  return Boolean(supabaseConfig());
}
