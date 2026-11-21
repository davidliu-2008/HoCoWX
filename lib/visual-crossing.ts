import type { WeatherSummary } from "./types";

type VisualCrossingHour = {
  datetimeEpoch?: number;
  temp?: number | null;
  precip?: number | null;
  windspeed?: number | null;
};

type VisualCrossingResponse = {
  days?: Array<{
    hours?: VisualCrossingHour[];
  }>;
};

type VisualCrossingHistory = NonNullable<WeatherSummary["visualCrossingObservation"]>;

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
  const query = new URLSearchParams({
    unitGroup: "us",
    include: "hours",
    elements: "datetime,datetimeEpoch,temp,precip,windspeed",
    contentType: "json",
    key: apiKey
  });
  const response = await fetch(`${VISUAL_CROSSING_BASE_URL}/${location}/yesterday?${query}`, {
    signal: AbortSignal.timeout(4000),
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    throw new Error(`Visual Crossing request failed with ${response.status}.`);
  }

  const data = (await response.json()) as VisualCrossingResponse;
  const targetTime = now.getTime() - 24 * 60 * 60 * 1000;
  const closestHour = data.days
    ?.flatMap((day) => day.hours ?? [])
    .filter((hour) => typeof hour.datetimeEpoch === "number" && typeof hour.temp === "number")
    .sort(
      (a, b) =>
        Math.abs((a.datetimeEpoch as number) * 1000 - targetTime) -
        Math.abs((b.datetimeEpoch as number) * 1000 - targetTime)
    )[0];

  return typeof closestHour?.temp === "number" && typeof closestHour.datetimeEpoch === "number"
    ? {
        observedAt: new Date(closestHour.datetimeEpoch * 1000).toISOString(),
        temperatureF: closestHour.temp,
        precipitationInches: closestHour.precip ?? null,
        windSpeedMph: closestHour.windspeed ?? null
      }
    : null;
}
