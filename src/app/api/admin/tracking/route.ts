import { NextResponse } from "next/server";
import { getTrackingsFromSheet } from "@/lib/google-sheets/tracking";

export async function GET() {
  try {
    const data = await getTrackingsFromSheet();
    // sort by rowNumber descending (newest first)
    data.sort((a, b) => b.rowNumber - a.rowNumber);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching trackings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}