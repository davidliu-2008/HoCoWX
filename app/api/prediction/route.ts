import { NextResponse } from "next/server";
import { createStoredImpactPrediction } from "@/lib/impact-service";
import { getMarylandDistrict } from "@/lib/maryland-districts";
import { getWeatherSummary } from "@/lib/weather";

export async function GET(request: Request) {
  try {
    const county = new URL(request.url).searchParams.get("county") ?? "howard";
    const district = getMarylandDistrict(county) ?? getMarylandDistrict("howard")!;
    const weather = await getWeatherSummary({
      latitude: district.latitude,
      longitude: district.longitude,
      location: district.county
    });
    const run = await createStoredImpactPrediction({
      weather,
      districtSlug: district.slug,
      county: district.county
    });

    return NextResponse.json(run.prediction, {
      headers: {
        "X-Impact-Model-Version": run.modelVersion,
        "X-Impact-Target-Date": run.targetDate
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to create a weather-based school operations prediction.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
