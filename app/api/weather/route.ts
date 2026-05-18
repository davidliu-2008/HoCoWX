import { NextResponse } from "next/server";
import { getWeatherSummary } from "@/lib/weather";

export async function GET() {
  try {
    return NextResponse.json(await getWeatherSummary());
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load National Weather Service data.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
