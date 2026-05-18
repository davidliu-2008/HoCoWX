import { NextResponse } from "next/server";
import { getHcpssStatus } from "@/lib/hcpss-status";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(await getHcpssStatus());
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load the official HCPSS status page.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
