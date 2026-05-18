import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createPrediction } from "./prediction";
import type { WeatherSummary } from "./types";

const baseWeather: WeatherSummary = {
  location: "Ellicott City, Howard County, MD",
  currentTemperatureF: 42,
  precipitationChance: 10,
  expectedSnowfallInches: 0,
  windSpeed: "5 mph",
  windGust: null,
  alerts: [],
  overnightForecast: "Mostly clear.",
  morningForecast: "Sunny.",
  shortForecast: "Mostly Clear",
  detailedForecast: "Mostly clear with light winds.",
  forecastDiscussion: null,
  hourlyForecast: [
    {
      time: "2026-05-17T05:00:00-04:00",
      temperatureF: 42,
      precipitationChance: 5,
      windSpeed: "5 mph",
      windGust: null,
      shortForecast: "Clear"
    },
    {
      time: "2026-05-17T08:00:00-04:00",
      temperatureF: 44,
      precipitationChance: 10,
      windSpeed: "5 mph",
      windGust: null,
      shortForecast: "Sunny"
    }
  ],
  fetchedAt: "2026-05-17T12:00:00.000Z"
};

describe("createPrediction", () => {
  it("keeps normal operations likely when weather signals are quiet", () => {
    const result = createPrediction({
      weather: baseWeather,
      now: new Date("2026-05-17T08:00:00-04:00")
    });

    assert.equal(result.label, "Normal Operations Likely");
    assert.equal(result.riskLevel, "Low");
    assert.equal(result.morningCommuteRisk.label, "Low");
    assert.match(result.topFactors[0], /No major winter weather signal/);
  });

  it("raises closure risk for winter storm warnings and significant snow", () => {
    const result = createPrediction({
      weather: {
        ...baseWeather,
        currentTemperatureF: 25,
        precipitationChance: 90,
        expectedSnowfallInches: 5.2,
        windSpeed: "18 mph",
        windGust: "40 mph",
        alerts: [
          {
            event: "Winter Storm Warning",
            severity: "Severe",
            headline: "Heavy snow expected",
            description: "Travel could be very difficult."
          }
        ],
        morningForecast: "Snow before 10am with gusty winds.",
        hourlyForecast: [
          {
            time: "2026-01-08T06:00:00-05:00",
            temperatureF: 25,
            precipitationChance: 90,
            windSpeed: "18 mph",
            windGust: "40 mph",
            shortForecast: "Snow"
          }
        ]
      },
      now: new Date("2026-01-08T05:00:00-05:00")
    });

    assert.equal(result.label, "Closure Possible");
    assert.equal(result.riskLevel, "High");
    assert.ok(result.confidence >= 90);
  });

  it("treats freezing rain as a strong disruption factor", () => {
    const result = createPrediction({
      weather: {
        ...baseWeather,
        currentTemperatureF: 29,
        precipitationChance: 80,
        expectedSnowfallInches: 0,
        shortForecast: "Freezing Rain",
        morningForecast: "Freezing rain likely before 9am."
      },
      now: new Date("2026-02-12T04:00:00-05:00")
    });

    assert.equal(result.riskLevel, "Medium");
    assert.match(result.topFactors[0], /freezing rain/);
  });
});
