import type { HourlyForecastPoint } from "@/types/api";

const easternHour = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York", hour: "numeric", hourCycle: "h23"
});
const easternWeekday = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York", weekday: "short"
});

export function parseDeparture(value: string) {
  const match = /^(0?[1-9]|1[0-2]):([0-5]\d)$/.exec(value.trim());
  return match ? { hour: Number(match[1]) % 12, minute: Number(match[2]), label: `${Number(match[1])}:${match[2]}` } : null;
}

export function nextDeparture(hours: HourlyForecastPoint[], departure: NonNullable<ReturnType<typeof parseDeparture>>, now = Date.now()) {
  return hours.find(({ time }) => {
    const date = new Date(time);
    return Number.isFinite(date.getTime()) && date.getTime() + departure.minute * 60_000 >= now &&
      !["Sat", "Sun"].includes(easternWeekday.format(date)) &&
      Number(easternHour.format(date)) === departure.hour;
  });
}

export function morningBrief(forecast?: HourlyForecastPoint) {
  if (!forecast) return { title: "No forecast for this departure yet", guidance: "Check again closer to your next weekday trip." };
  const text = forecast.shortForecast;
  if (/freezing (rain|drizzle)|ice pellets|sleet|\bice\b/i.test(text)) {
    return { title: "Slippery spots are possible", guidance: "Ice could make sidewalks and roads slick around the time you leave." };
  }
  if (/snow|flurries/i.test(text)) return { title: "Snow could slow your trip", guidance: "Give yourself extra time if snow starts to stick." };
  if (/thunder|heavy rain|fog/i.test(text)) return { title: "Visibility could drop", guidance: "Conditions may slow travel around the time you leave." };
  if (/rain|showers|drizzle/i.test(text)) return { title: "Plan for wet weather", guidance: "Bring a rain layer if you wait outside." };
  if (forecast.temperatureF <= 32) return { title: "Bundle up for the bus stop", guidance: "Temperatures are expected to be at or below freezing when you leave." };
  return { title: "No obvious weather disruption", guidance: "The departure-hour forecast doesn't show a major weather hazard. Check school status separately." };
}
