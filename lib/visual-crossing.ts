import type { WeatherSummary } from "./types";

type VisualCrossingHour = {
  datetimeEpoch?: number;
  temp?: number | null;
  precip?: number | null;
  windspeed?: number | null;
  datetime?: string;
  source?: string;
  aqius?: number | null;
};

type VisualCrossingResponse = {
  days?: Array<{
    datetime?: string;
    hours?: VisualCrossingHour[];
  }>;
};

type VisualCrossingHistory = {
  yesterday: WeatherSummary["visualCrossingObservation"];
  overnight: WeatherSummary["visualCrossingOvernight"];
  airQuality: WeatherSummary["visualCrossingAirQuality"];
};

const localDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"
});

const VISUAL_CROSSING_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export async function getVisualCrossingHistory({
  latitude,
  longitude,
  now = new Date()
}: {
  latitude: number;
  longitude: number;
  now?: Date;
}): Promise<VisualCrossingHistory | null> {
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;

  if (!apiKey) {
    return null;
  }

  const location = encodeURIComponent(`${latitude},${longitude}`);
  const today = localDate.format(now);
  const previousDay = new Date(`${today}T00:00:00Z`);
  previousDay.setUTCDate(previousDay.getUTCDate() - 1);
  const yesterday = previousDay.toISOString().slice(0, 10);
  const query = new URLSearchParams({
    unitGroup: "us",
    include: "hours",
    elements: "datetime,datetimeEpoch,temp,precip,windspeed,source,aqius",
    contentType: "json",
    key: apiKey
  });
  const response = await fetch(`${VISUAL_CROSSING_BASE_URL}/${location}/${yesterday}/${today}?${query}`, {
    signal: AbortSignal.timeout(4000),
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    throw new Error(`Visual Crossing request failed with ${response.status}.`);
  }

  const data = (await response.json()) as VisualCrossingResponse;
  const targetTime = now.getTime() - 24 * 60 * 60 * 1000;
  const closestHour = data.days?.find((day) => day.datetime === yesterday)?.hours
    ?.filter((hour) => hour.source === "obs" && typeof hour.datetimeEpoch === "number" && typeof hour.temp === "number")
    .sort(
      (a, b) =>
        Math.abs((a.datetimeEpoch as number) * 1000 - targetTime) -
        Math.abs((b.datetimeEpoch as number) * 1000 - targetTime)
    )[0];

  const todayHours = data.days?.find((day) => day.datetime === today)?.hours ?? [];
  const observed = todayHours.filter((hour) =>
    hour.source === "obs" && /^0[0-5]:/.test(hour.datetime ?? "") &&
    typeof hour.datetimeEpoch === "number" && hour.datetimeEpoch * 1000 <= now.getTime()
  );
  const currentAirQuality = todayHours
    .filter(({ aqius, datetimeEpoch }) => typeof aqius === "number" && Number.isFinite(aqius) && aqius >= 0 &&
      typeof datetimeEpoch === "number" && now.getTime() - datetimeEpoch * 1000 >= 0 &&
      now.getTime() - datetimeEpoch * 1000 < 3600000)
    .find(({ datetimeEpoch }) => typeof datetimeEpoch === "number");
  const temperatures = observed.flatMap(({ temp }) => typeof temp === "number" ? [temp] : []);
  const winds = observed.flatMap(({ windspeed }) => typeof windspeed === "number" ? [windspeed] : []);
  return {
    airQuality: typeof currentAirQuality?.aqius === "number" && typeof currentAirQuality.datetimeEpoch === "number"
      ? { index: Math.round(currentAirQuality.aqius), validAt: new Date(currentAirQuality.datetimeEpoch * 1000).toISOString() }
      : undefined,
    yesterday: typeof closestHour?.temp === "number" && typeof closestHour.datetimeEpoch === "number"
    ? {
        observedAt: new Date(closestHour.datetimeEpoch * 1000).toISOString(),
        temperatureF: closestHour.temp,
        precipitationInches: closestHour.precip ?? null,
        windSpeedMph: closestHour.windspeed ?? null
      }
    : undefined,
    overnight: temperatures.length ? {
      date: today,
      hoursObserved: observed.length,
      lowTemperatureF: Math.min(...temperatures),
      precipitationInches: observed.every(({ precip }) => typeof precip === "number")
        ? observed.reduce((sum, { precip }) => sum + (precip ?? 0), 0) : null,
      peakWindSpeedMph: winds.length ? Math.max(...winds) : null
    } : undefined
  };
}
