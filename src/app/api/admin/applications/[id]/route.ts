import { NextResponse } from "next/server";
import {
  getApplicationsFromSheet,
  updateApplicationInSheet,
} from "@/lib/google-sheets";

export async function GET(request: Request, { params }: any) {
  try {
    const application = (await getApplicationsFromSheet()).find(
      (item) => item.id === String(params.id),
    );
    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: any) {
  try {
    const body = await request.json();
    const { status, hiredAt, expiredAt, adminNote, adminId, adminName } = body;

    const applications = await getApplicationsFromSheet();
    const application = applications.find(
      (item) => item.id === String(params.id),
    );
    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData: any = { ...application, updatedAt: new Date() };

    if (status) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;

    // Parse dates if provided
    if (hiredAt === null || hiredAt === "") updateData.hiredAt = "";
    else if (hiredAt) updateData.hiredAt = new Date(hiredAt);
    if (expiredAt === null || expiredAt === "") updateData.expiredAt = "";
    else if (expiredAt) updateData.expiredAt = new Date(expiredAt);

    await updateApplicationInSheet(Number(params.id), updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update app error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
