import { morningBrief, nextDeparture, parseDeparture } from "../morningBrief";
import type { HourlyForecastPoint } from "@/types/api";

const forecast: HourlyForecastPoint = {
  time: "2026-11-25T11:00:00Z",
  shortForecast: "Freezing Rain",
  temperatureF: 30,
  precipitationChance: 70,
  windSpeed: "5 mph",
  windGust: null
};

test("uses the hourly forecast for an exact future departure", () => {
  const time = parseDeparture("06:35")!;
  expect(time.label).toBe("6:35");
  expect(nextDeparture([forecast], time, Date.parse("2026-11-25T11:30:00Z"))).toBe(forecast);
  expect(nextDeparture([forecast], time, Date.parse("2026-11-25T11:36:00Z"))).toBeUndefined();
  expect(morningBrief(forecast).title).toBe("Slippery spots are possible");
});

test("validates morning time and handles midnight", () => {
  expect(parseDeparture("12:05")?.hour).toBe(0);
  expect(parseDeparture("7:60")).toBeNull();
  expect(parseDeparture("13:00")).toBeNull();
});
