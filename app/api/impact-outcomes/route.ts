import { NextResponse } from "next/server";
import { getMarylandDistrict } from "@/lib/maryland-districts";
import { saveImpactOutcome, type ImpactOutcome } from "@/lib/impact-store";

const validOutcomes = new Set<ImpactOutcome["officialOutcome"]>([
  "normal",
  "delay",
  "closure",
  "early_dismissal",
  "modified",
  "unknown"
]);

export async function POST(request: Request) {
  const configuredSecret = process.env.IMPACT_ADMIN_SECRET;
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!configuredSecret || suppliedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ImpactOutcome>;

    if (
      !body.districtSlug ||
      !getMarylandDistrict(body.districtSlug) ||
      !body.targetDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.targetDate) ||
      !body.officialOutcome ||
      !validOutcomes.has(body.officialOutcome)
    ) {
      return NextResponse.json({ error: "A supported district, date, and outcome are required." }, { status: 400 });
    }

    await saveImpactOutcome({
      districtSlug: body.districtSlug,
      targetDate: body.targetDate,
      officialOutcome: body.officialOutcome,
      sourceUrl: body.sourceUrl,
      notes: body.notes
    });

    return NextResponse.json({ stored: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to record the verified impact outcome.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
