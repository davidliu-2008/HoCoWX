import type { WeatherAlert, WeatherSummary } from "./types";

const LAT = 39.2673;
const LON = -76.7983;
const LOCATION = "Ellicott City, Howard County, MD";
const CACHE_TTL_MS = 10 * 60 * 1000;

let cachedWeather: { value: WeatherSummary; expiresAt: number } | null = null;

type NwsPeriod = {
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  windSpeed: string;
  windGust?: string | null;
  shortForecast: string;
  detailedForecast: string;
  probabilityOfPrecipitation?: { value: number | null };
};

type GridValue = {
  validTime: string;
  value: number | null;
};

type ObservationFeature = {
  properties: {
    timestamp?: string;
    temperature?: { value: number | null };
  };
};

async function fetchNwsJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/geo+json, application/json",
      "User-Agent":
        process.env.NWS_USER_AGENT ??
        "HCPSS school operations weather app (local development; contact@example.com)"
    },
    next: { revalidate: 600 }
  });

  if (!response.ok) {
    throw new Error(`National Weather Service request failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function chooseMorningPeriod(periods: NwsPeriod[]) {
  return (
    periods.find((period) => /morning/i.test(period.name)) ??
    periods.find((period) => period.isDaytime) ??
    null
  );
}

function formatHourlyPeriod(period: NwsPeriod) {
  return {
    time: period.startTime,
    temperatureF: period.temperature,
    precipitationChance: period.probabilityOfPrecipitation?.value ?? null,
    windSpeed: period.windSpeed,
    windGust: period.windGust ?? null,
    shortForecast: period.shortForecast
  };
}

function schoolImpactForPeriod(period: NwsPeriod) {
  const text = `${period.shortForecast} ${period.detailedForecast}`.toLowerCase();
  const precipitation = period.probabilityOfPrecipitation?.value ?? 0;

  if (/ice storm|freezing rain|blizzard|heavy snow|tornado|hurricane/.test(text)) {
    return { level: "High" as const, reason: "Significant hazardous weather could affect school travel." };
  }

  if (/snow|sleet|thunderstorm|heavy rain|damaging wind|strong wind/.test(text) || precipitation >= 60) {
    return { level: "Medium" as const, reason: "Weather may affect arrival, dismissal, or outdoor activities." };
  }

  return { level: "Low" as const, reason: "No major school-day weather disruptions are indicated." };
}

function buildSchoolDayOutlook(periods: NwsPeriod[]) {
  return periods
    .filter((period) => period.isDaytime)
    .filter((period) => {
      const day = new Date(period.startTime).getDay();
      return day !== 0 && day !== 6;
    })
    .slice(0, 5)
    .map((period) => {
      const impact = schoolImpactForPeriod(period);

      return {
        date: period.startTime,
        dayName: new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          timeZone: "America/New_York"
        }).format(new Date(period.startTime)),
        temperatureF: period.temperature,
        precipitationChance: period.probabilityOfPrecipitation?.value ?? null,
        shortForecast: period.shortForecast,
        impactLevel: impact.level,
        impactReason: impact.reason
      };
    });
}

function inchesFromMillimeters(value: number | null) {
  if (value === null) {
    return null;
  }

  return Math.round((value / 25.4) * 10) / 10;
}

function celsiusToFahrenheit(value: number) {
  return Math.round((value * 9) / 5 + 32);
}

async function fetchYesterdayTemperature(observationStationsUrl: string) {
  try {
    const stations = await fetchNwsJson<{ features: Array<{ id: string }> }>(observationStationsUrl);
    const stationUrl = stations.features[0]?.id;

    if (!stationUrl) {
      return null;
    }

    const target = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const start = new Date(target.getTime() - 90 * 60 * 1000).toISOString();
    const end = new Date(target.getTime() + 90 * 60 * 1000).toISOString();
    const observations = await fetchNwsJson<{ features: ObservationFeature[] }>(
      `${stationUrl}/observations?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    );

    const closest = observations.features
      .filter((feature) => feature.properties.timestamp && feature.properties.temperature?.value !== null)
      .sort((a, b) => {
        const aDistance = Math.abs(new Date(a.properties.timestamp as string).getTime() - target.getTime());
        const bDistance = Math.abs(new Date(b.properties.timestamp as string).getTime() - target.getTime());
        return aDistance - bDistance;
      })[0];
    const celsius = closest?.properties.temperature?.value;

    return typeof celsius === "number" ? celsiusToFahrenheit(celsius) : null;
  } catch {
    return null;
  }
}

function sumSnowfallBeforeTomorrowMorning(values: GridValue[] | undefined) {
  if (!values?.length) {
    return null;
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const totalMillimeters = values.reduce((sum, item) => {
    const start = new Date(item.validTime.split("/")[0]);
    if (start <= tomorrow && item.value !== null) {
      return sum + item.value;
    }

    return sum;
  }, 0);

  return inchesFromMillimeters(totalMillimeters);
}

function formatAlert(feature: {
  properties: {
    event?: string;
    severity?: string;
    headline?: string;
    description?: string;
  };
}): WeatherAlert {
  return {
    event: feature.properties.event ?? "Weather alert",
    severity: feature.properties.severity ?? "Unknown",
    headline: feature.properties.headline ?? "",
    description: feature.properties.description ?? ""
  };
}

export async function getWeatherSummary(): Promise<WeatherSummary> {
  const now = Date.now();

  if (cachedWeather && cachedWeather.expiresAt > now) {
    return cachedWeather.value;
  }

  const point = await fetchNwsJson<{
    properties: {
      forecast: string;
      forecastHourly: string;
      forecastGridData: string;
      forecastDiscussion?: string;
      observationStations: string;
    };
  }>(`https://api.weather.gov/points/${LAT},${LON}`);

  const [forecast, hourly, grid, alerts, yesterdayTemperatureF] = await Promise.all([
    fetchNwsJson<{ properties: { periods: NwsPeriod[] } }>(point.properties.forecast),
    fetchNwsJson<{ properties: { periods: NwsPeriod[] } }>(point.properties.forecastHourly),
    fetchNwsJson<{ properties: { snowfall?: { values: GridValue[] } } }>(point.properties.forecastGridData),
    fetchNwsJson<{ features: Array<Parameters<typeof formatAlert>[0]> }>(
      `https://api.weather.gov/alerts/active?point=${LAT},${LON}`
    ),
    fetchYesterdayTemperature(point.properties.observationStations)
  ]);

  const current = hourly.properties.periods[0] ?? null;
  const nextPeriods = forecast.properties.periods.slice(0, 4);
  const overnight = nextPeriods.find((period) => /tonight|overnight/i.test(period.name)) ?? null;
  const morning = chooseMorningPeriod(nextPeriods);

  const value: WeatherSummary = {
    location: LOCATION,
    currentTemperatureF: current?.temperature ?? null,
    yesterdayTemperatureF,
    precipitationChance: current?.probabilityOfPrecipitation?.value ?? null,
    expectedSnowfallInches: sumSnowfallBeforeTomorrowMorning(grid.properties.snowfall?.values),
    windSpeed: current?.windSpeed ?? null,
    windGust: current?.windGust ?? null,
    alerts: alerts.features.map(formatAlert),
    overnightForecast: overnight?.detailedForecast ?? overnight?.shortForecast ?? null,
    morningForecast: morning?.detailedForecast ?? morning?.shortForecast ?? null,
    shortForecast: current?.shortForecast ?? nextPeriods[0]?.shortForecast ?? null,
    detailedForecast: nextPeriods[0]?.detailedForecast ?? null,
    forecastDiscussion: point.properties.forecastDiscussion ?? null,
    hourlyForecast: hourly.properties.periods.slice(0, 12).map(formatHourlyPeriod),
    schoolDayOutlook: buildSchoolDayOutlook(forecast.properties.periods),
    fetchedAt: new Date().toISOString()
  };

  cachedWeather = {
    value,
    expiresAt: now + CACHE_TTL_MS
  };

  return value;
}
