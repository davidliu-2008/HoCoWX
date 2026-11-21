import { createPrediction } from "./prediction";
import type { PredictionResult, WeatherSummary } from "./types";

export const IMPACT_MODEL_VERSION = "school-impact-v2";

export type ImpactPredictionRun = {
  runKey: string;
  modelVersion: string;
  districtSlug: string;
  county: string;
  targetDate: string;
  generatedAt: string;
  sources: string[];
  weatherSnapshot: {
    fetchedAt: string;
    currentTemperatureF: number | null;
    precipitationChance: number | null;
    expectedSnowfallInches: number | null;
    windSpeed: string | null;
    windGust: string | null;
    alerts: WeatherSummary["alerts"];
    overnightForecast: string | null;
    morningForecast: string | null;
    hourlyForecast: WeatherSummary["hourlyForecast"];
  };
  prediction: PredictionResult;
};

function nextSchoolDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const date = new Date(Date.UTC(value("year"), value("month") - 1, value("day") + 1));

  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}

function sourceNames(weather: WeatherSummary) {
  const sources = ["National Weather Service"];

  if (weather.yesterdayTemperatureSource === "Visual Crossing") {
    sources.push("Visual Crossing");
  }

  return sources;
}

export function createImpactPredictionRun({
  weather,
  districtSlug,
  county,
  now = new Date()
}: {
  weather: WeatherSummary;
  districtSlug: string;
  county: string;
  now?: Date;
}): ImpactPredictionRun {
  const prediction = createPrediction({ weather, now });
  const targetDate = nextSchoolDate(now);
  const forecastHour = weather.fetchedAt.slice(0, 13);

  return {
    runKey: `${IMPACT_MODEL_VERSION}:${districtSlug}:${targetDate}:${forecastHour}`,
    modelVersion: IMPACT_MODEL_VERSION,
    districtSlug,
    county,
    targetDate,
    generatedAt: prediction.generatedAt,
    sources: sourceNames(weather),
    weatherSnapshot: {
      fetchedAt: weather.fetchedAt,
      currentTemperatureF: weather.currentTemperatureF,
      precipitationChance: weather.precipitationChance,
      expectedSnowfallInches: weather.expectedSnowfallInches,
      windSpeed: weather.windSpeed,
      windGust: weather.windGust,
      alerts: weather.alerts,
      overnightForecast: weather.overnightForecast,
      morningForecast: weather.morningForecast,
      hourlyForecast: weather.hourlyForecast
    },
    prediction
  };
}

