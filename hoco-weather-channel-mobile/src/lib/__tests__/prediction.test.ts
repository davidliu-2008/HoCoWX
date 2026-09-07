import { estimateIceRisk, snowRiskLabel } from "../prediction";
import type { WeatherSummary } from "@/types/api";

const baseWeather: WeatherSummary = {
  location: "Howard County, MD",
  currentTemperatureF: 30,
  precipitationChance: 40,
  expectedSnowfallInches: 0,
  windSpeed: "5 mph",
  windGust: null,
  alerts: [],
  overnightForecast: "Cloudy.",
  morningForecast: "Rain possible.",
  shortForecast: "Cloudy",
  detailedForecast: "Cloudy.",
  forecastDiscussion: null,
  hourlyForecast: [],
  fetchedAt: "2026-05-23T12:00:00.000Z"
};

describe("mobile prediction helpers", () => {
  it("detects freezing rain as elevated ice risk", () => {
    expect(estimateIceRisk({ ...baseWeather, morningForecast: "Freezing rain before 8am." })).toBe("Elevated");
  });

  it("labels snow risk by expected accumulation", () => {
    expect(snowRiskLabel(null)).toBe("Low");
    expect(snowRiskLabel(2.5)).toBe("Medium");
    expect(snowRiskLabel(5)).toBe("High");
  });
});
