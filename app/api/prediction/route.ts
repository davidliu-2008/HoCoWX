import { NextResponse } from "next/server";
import { createPrediction } from "@/lib/prediction";
import { getWeatherSummary } from "@/lib/weather";

export async function GET() {
  try {
    const weather = await getWeatherSummary();
    return NextResponse.json(createPrediction({ weather }));
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
