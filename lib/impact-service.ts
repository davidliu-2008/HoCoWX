import { createImpactPredictionRun } from "./impact-intelligence";
import { saveImpactPredictionRun } from "./impact-store";
import type { WeatherSummary } from "./types";

export async function createStoredImpactPrediction({
  weather,
  districtSlug,
  county,
  now = new Date()
}: {
  weather: WeatherSummary;
  districtSlug: string;
  county: string;
  now?: Date;
}) {
  const run = createImpactPredictionRun({ weather, districtSlug, county, now });

  try {
    await saveImpactPredictionRun(run);
  } catch (error) {
    console.error("Impact prediction could not be archived.", error);
  }

  return run;
}

