import * as assert from "node:assert/strict";
import { test } from "node:test";
import { createImpactPredictionRun, IMPACT_MODEL_VERSION } from "./impact-intelligence";
import type { WeatherSummary } from "./types";

const weather: WeatherSummary = {
  location: "Howard County",
  currentTemperatureF: 30,
  yesterdayTemperatureF: 34,
  yesterdayTemperatureSource: "Visual Crossing",
  precipitationChance: 60,
  expectedSnowfallInches: 1,
  windSpeed: "8 mph",
  windGust: "18 mph",
  alerts: [],
  overnightForecast: "A chance of snow overnight.",
  morningForecast: "Cloudy during the morning commute.",
  shortForecast: "Chance Snow",
  detailedForecast: "A chance of snow before sunrise.",
  forecastDiscussion: null,
  hourlyForecast: [],
  fetchedAt: "2026-11-13T18:25:00.000Z"
};

test("creates a versioned and reproducible impact run", () => {
  const run = createImpactPredictionRun({
    weather,
    districtSlug: "howard",
    county: "Howard County",
    now: new Date("2026-11-13T18:30:00-05:00")
  });

  assert.equal(run.modelVersion, IMPACT_MODEL_VERSION);
  assert.equal(run.targetDate, "2026-11-16");
  assert.equal(run.runKey, `${IMPACT_MODEL_VERSION}:howard:2026-11-16:2026-11-13T18`);
  assert.deepEqual(run.sources, ["National Weather Service", "Visual Crossing"]);
  assert.equal(run.weatherSnapshot.expectedSnowfallInches, 1);
  assert.ok(run.prediction.scoreBreakdown.length > 0);
});

test("uses the Maryland calendar date when UTC has advanced", () => {
  const run = createImpactPredictionRun({
    weather,
    districtSlug: "howard",
    county: "Howard County",
    now: new Date("2026-11-14T04:30:00.000Z")
  });

  assert.equal(run.targetDate, "2026-11-16");
});

