import { NextResponse } from "next/server";
import { getMarylandOperationsComparison } from "@/lib/maryland-operations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json({
      statuses: await getMarylandOperationsComparison(),
      note: "Non-HCPSS statuses are experimental because district websites use different formats."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load Maryland school operations comparison.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
