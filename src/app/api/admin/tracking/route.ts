import { NextResponse } from "next/server";
import { getTrackingsFromSheet, addTrackingToSheet } from "@/lib/google-sheets/tracking";

export async function GET() {
  try {
    const data = await getTrackingsFromSheet();
    data.sort((a, b) => a.rowNumber - b.rowNumber);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching trackings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await addTrackingToSheet(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add tracking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}