import { NextResponse } from "next/server";
import { getHcpssStatus } from "@/lib/hcpss-status";
import { getMarylandDistrict } from "@/lib/maryland-districts";
import { getMarylandDistrictStatus } from "@/lib/maryland-operations";
import { getWeatherSummary } from "@/lib/weather";

export async function GET(request: Request) {
  const district = getMarylandDistrict(new URL(request.url).searchParams.get("county") ?? "howard");
  if (!district) return NextResponse.json({ error: "County not found." }, { status: 404 });

  const [weather, status] = await Promise.allSettled([
    getWeatherSummary({ latitude: district.latitude, longitude: district.longitude, location: district.county, forecastHours: 96 }),
    district.slug === "howard"
      ? getHcpssStatus().then(({ operationStatus, sourceUrl }) => ({ operationStatus, sourceUrl }))
      : getMarylandDistrictStatus(district.slug).then((report) => ({
          operationStatus: report?.status ?? "Status unavailable",
          sourceUrl: report?.statusUrl ?? district.statusUrl
        }))
  ]);
  if (weather.status === "rejected") return NextResponse.json({ error: "Forecast unavailable." }, { status: 502 });
  return NextResponse.json({
    hours: weather.value.hourlyForecast,
    status: status.status === "fulfilled" ? status.value : { operationStatus: "Status unavailable", sourceUrl: district.statusUrl }
  });
}
