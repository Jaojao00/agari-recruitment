import { NextResponse } from "next/server";
import { updateTrackingInSheet, deleteTrackingInSheet } from "@/lib/google-sheets/tracking";

type RouteContext = {
  params: Promise<{ row: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { row } = await params;
    const body = await request.json();
    
    await updateTrackingInSheet(parseInt(row), body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update tracking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { row } = await params;
    await deleteTrackingInSheet(parseInt(row));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tracking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}