import { NextRequest, NextResponse } from "next/server";
import { getMarylandDistrict } from "@/lib/maryland-districts";
import { getMarylandDistrictStatus } from "@/lib/maryland-operations";

type NwsPeriod = {
  startTime: string;
  temperature: number;
  windSpeed: string;
  shortForecast: string;
  probabilityOfPrecipitation?: { value: number | null };
};

type CommuteWindow = "morning" | "afternoon";

async function fetchNws<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/geo+json, application/json",
      "User-Agent": process.env.NWS_USER_AGENT ?? "HoCo Weather Channel; howardcountyweather@gmail.com"
    },
    next: { revalidate: 600 }
  });

  if (!response.ok) {
    throw new Error(`National Weather Service request failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function localHour(value: string) {
  return Number(new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: "America/New_York"
  }).format(new Date(value)));
}

function localDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

function selectCommutePeriods(periods: NwsPeriod[], window: CommuteWindow) {
  const [startHour, endHour] = window === "morning" ? [5, 9] : [14, 17];
  const candidates = periods.filter((period) => {
    const hour = localHour(period.startTime);
    return hour >= startHour && hour < endHour;
  });
  const firstDate = candidates[0] ? localDate(candidates[0].startTime) : null;
  return firstDate ? candidates.filter((period) => localDate(period.startTime) === firstDate) : [];
}

function windNumber(value: string) {
  const values = value.match(/\d+/g)?.map(Number) ?? [];
  return values.length ? Math.max(...values) : 0;
}

function commuteRisk(periods: NwsPeriod[], alerts: string[]) {
  const text = `${periods.map((period) => period.shortForecast).join(" ")} ${alerts.join(" ")}`.toLowerCase();
  const maxPrecipitation = Math.max(0, ...periods.map((period) => period.probabilityOfPrecipitation?.value ?? 0));
  const maxWind = Math.max(0, ...periods.map((period) => windNumber(period.windSpeed)));

  if (/ice storm|freezing rain|blizzard|heavy snow|tornado|hurricane|snow squall/.test(text)) {
    return { level: "High", explanation: "Hazardous weather may create difficult or unsafe school travel conditions." };
  }

  if (/snow|sleet|thunderstorm|heavy rain|dense fog/.test(text) || maxPrecipitation >= 60 || maxWind >= 30) {
    return { level: "Medium", explanation: "Weather may slow travel or affect visibility during the selected commute." };
  }

  return { level: "Low", explanation: "No major weather-related commute disruptions are indicated for this window." };
}

export async function GET(request: NextRequest) {
  const county = request.nextUrl.searchParams.get("county") ?? "howard";
  const commuteWindow = request.nextUrl.searchParams.get("window") === "afternoon" ? "afternoon" : "morning";
  const district = getMarylandDistrict(county);

  if (!district) {
    return NextResponse.json({ error: "County not found." }, { status: 404 });
  }

  try {
    const point = await fetchNws<{ properties: { forecastHourly: string } }>(
      `https://api.weather.gov/points/${district.latitude},${district.longitude}`
    );
    const [hourly, alerts, operation] = await Promise.all([
      fetchNws<{ properties: { periods: NwsPeriod[] } }>(point.properties.forecastHourly),
      fetchNws<{ features: Array<{ properties: { event?: string; headline?: string } }> }>(
        `https://api.weather.gov/alerts/active?point=${district.latitude},${district.longitude}`
      ),
      getMarylandDistrictStatus(county)
    ]);
    const periods = selectCommutePeriods(hourly.properties.periods, commuteWindow);
    const alertNames = alerts.features.map((feature) => feature.properties.event ?? "Weather alert");
    const risk = commuteRisk(periods, alertNames);

    return NextResponse.json({
      county: district.county,
      district: district.district,
      status: operation?.status ?? "Unknown",
      statusKind: operation?.statusKind ?? "unknown",
      statusUrl: operation?.statusUrl ?? district.statusUrl,
      window: commuteWindow,
      forecastDate: periods[0]?.startTime ?? null,
      temperatureLowF: periods.length ? Math.min(...periods.map((period) => period.temperature)) : null,
      temperatureHighF: periods.length ? Math.max(...periods.map((period) => period.temperature)) : null,
      precipitationChance: Math.max(0, ...periods.map((period) => period.probabilityOfPrecipitation?.value ?? 0)),
      windSpeed: periods.reduce((strongest, period) => windNumber(period.windSpeed) > windNumber(strongest) ? period.windSpeed : strongest, periods[0]?.windSpeed ?? "Unavailable"),
      forecasts: [...new Set(periods.map((period) => period.shortForecast))],
      alerts: alertNames,
      riskLevel: risk.level,
      explanation: risk.explanation,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: "County commute weather could not be loaded.",
      detail: error instanceof Error ? error.message : "Unknown error"
    }, { status: 502 });
  }
}
