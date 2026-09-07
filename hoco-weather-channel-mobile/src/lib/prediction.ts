import type { WeatherSummary } from "@/types/api";

export function estimateIceRisk(weather: WeatherSummary) {
  const text = [
    weather.shortForecast,
    weather.detailedForecast,
    weather.overnightForecast,
    weather.morningForecast
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("freezing rain") || text.includes("ice")) {
    return "Elevated";
  }

  if (text.includes("sleet") || text.includes("wintry mix")) {
    return "Possible";
  }

  return "Low";
}

export function snowRiskLabel(inches: number | null) {
  if (inches === null || inches <= 0) {
    return "Low";
  }

  if (inches >= 4) {
    return "High";
  }

  if (inches >= 2) {
    return "Medium";
  }

  return "Light";
}
