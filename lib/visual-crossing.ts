type VisualCrossingHour = {
  datetimeEpoch?: number;
  temp?: number | null;
};

type VisualCrossingResponse = {
  days?: Array<{
    hours?: VisualCrossingHour[];
  }>;
};

export type VisualCrossingHistory = {
  yesterdayTemperatureF: number;
};

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
    elements: "datetime,datetimeEpoch,temp",
    contentType: "json",
    key: apiKey
  });
  const response = await fetch(`${VISUAL_CROSSING_BASE_URL}/${location}/yesterday?${query}`, {
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

  return typeof closestHour?.temp === "number"
    ? { yesterdayTemperatureF: Math.round(closestHour.temp) }
    : null;
}
