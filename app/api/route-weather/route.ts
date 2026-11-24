import { NextResponse } from "next/server";

type Point = [number, number];
type Hour = { startTime: string; endTime: string; shortForecast: string };
type Route = { geometry: { coordinates: Point[] }; duration: number; distance: number };

function isPoint(value: unknown): value is Point {
  return Array.isArray(value) && value.length === 2 &&
    value.every((part) => typeof part === "number" && Number.isFinite(part)) &&
    value[0] >= -80 && value[0] <= -74 && value[1] >= 37 && value[1] <= 41;
}

async function forecastAt([lon, lat]: Point, time: number) {
  try {
    const options = {
      headers: { "User-Agent": process.env.NWS_USER_AGENT ?? "HoCo Weather Channel; howardcountyweather@gmail.com" },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(6500)
    };
    const point = await fetch(`https://api.weather.gov/points/${lat.toFixed(3)},${lon.toFixed(3)}`, options);
    if (!point.ok) return null;
    const grid = (await point.json()).properties?.forecastHourly;
    if (typeof grid !== "string" || !grid.startsWith("https://api.weather.gov/gridpoints/")) return null;
    const hourly = await fetch(grid, options);
    if (!hourly.ok) return null;
    const hours: Hour[] = (await hourly.json()).properties?.periods ?? [];
    return hours.find((hour) => Date.parse(hour.startTime) <= time && time < Date.parse(hour.endTime))?.shortForecast ?? null;
  } catch {
    return null;
  }
}

function impact(forecast: string | null) {
  if (!forecast) return { level: "unknown", message: "Forecast unavailable for this part of the trip." };
  if (/freezing rain|freezing drizzle|ice pellets|snow|sleet/i.test(forecast)) {
    return { level: "caution", message: "Roads could become slippery." };
  }
  if (/thunderstorm|heavy rain|fog/i.test(forecast)) {
    return { level: "caution", message: "Visibility could drop and travel may slow." };
  }
  if (/rain|showers/i.test(forecast)) return { level: "wet", message: "Roads could be wet." };
  return { level: "normal", message: "No travel hazard identified in the hourly forecast." };
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null);
  const departure = Date.parse(typeof input?.departure === "string" ? input.departure : "");
  const now = Date.now();
  const { start, end } = (input ?? {}) as { start?: unknown; end?: unknown };
  if (!isPoint(start) || !isPoint(end) || !Number.isFinite(departure) ||
      departure < now - 300_000 || departure > now + 6 * 86_400_000) {
    return NextResponse.json({ error: "Choose two points in the Maryland area and a departure within the next six days." }, { status: 400 });
  }

  const router = process.env.OSRM_BASE_URL || (process.env.NODE_ENV === "development" ? "https://router.project-osrm.org" : "");
  if (!router) return NextResponse.json({ error: "Driving routes are not available yet. You can still use the county commute forecast below." }, { status: 503 });
  try {
    const coordinates = [start, end].map((point) => point.map((part) => part.toFixed(5)).join(",")).join(";");
    const response = await fetch(`${router.replace(/\/$/, "")}/route/v1/driving/${coordinates}?overview=full&geometries=geojson&generate_hints=false`, {
      cache: "no-store", signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error("Route unavailable");
    const route: Route | undefined = (await response.json()).routes?.[0];
    const path = route?.geometry.coordinates;
    if (!route || !path || path.length < 2 || !Number.isFinite(route.duration)) throw new Error("Route unavailable");
    const cumulative = [0];
    for (let i = 1; i < path.length; i++) {
      cumulative.push(cumulative[i - 1] + Math.hypot((path[i][0] - path[i - 1][0]) * 0.77, path[i][1] - path[i - 1][1]));
    }
    const length = cumulative[cumulative.length - 1];
    if (!length) throw new Error("Route unavailable");
    const count = Math.min(5, Math.max(1, Math.ceil(route.distance / 4500)));
    const edges = [0];
    for (let i = 1; i < count; i++) {
      const index = cumulative.findIndex((distance) => distance >= length * i / count);
      if (index > edges[edges.length - 1] && index < path.length - 1) edges.push(index);
    }
    edges.push(path.length - 1);
    const segments = await Promise.all(edges.slice(0, -1).map(async (start, i) => {
      const end = edges[i + 1];
      const midpoint = (cumulative[start] + cumulative[end]) / 2;
      const index = cumulative.findIndex((distance) => distance >= midpoint);
      const fraction = (midpoint - cumulative[index - 1]) / (cumulative[index] - cumulative[index - 1]);
      const sample: Point = [0, 1].map((axis) => path[index - 1][axis] + fraction * (path[index][axis] - path[index - 1][axis])) as Point;
      const time = departure + midpoint / length * route.duration * 1000;
      const forecast = await forecastAt(sample, time);
      return { path: path.slice(start, end + 1), time: new Date(time).toISOString(), forecast, ...impact(forecast) };
    }));
    return NextResponse.json({ segments, minutes: Math.max(1, Math.round(route.duration / 60)) });
  } catch {
    return NextResponse.json({ error: "A driving route could not be loaded. Move the pins closer to the road and try again." }, { status: 502 });
  }
}
