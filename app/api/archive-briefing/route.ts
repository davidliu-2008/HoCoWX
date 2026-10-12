import { NextRequest, NextResponse } from "next/server";
import { archiveDailyBriefing, createArchivedBriefing } from "@/lib/briefing-archive";
import { createPrediction } from "@/lib/prediction";
import { getWeatherSummary } from "@/lib/weather";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const weather = await getWeatherSummary();
    const prediction = createPrediction({ weather });
    const briefing = createArchivedBriefing(weather, prediction);
    const result = await archiveDailyBriefing(briefing);

    return NextResponse.json({ date: briefing.briefing_date, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "The daily briefing could not be archived." },
      { status: 500 }
    );
  }
}
