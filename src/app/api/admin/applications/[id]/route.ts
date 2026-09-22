import { NextResponse } from "next/server";
import {
  getApplicationsFromSheet,
  updateApplicationInSheet,
} from "@/lib/google-sheets";
import { addTrackingToSheet } from "@/lib/google-sheets/tracking";

type ApplicationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: ApplicationRouteContext,
) {
  try {
    const { id } = await params;
    const application = (await getApplicationsFromSheet()).find(
      (item) => item.id === id,
    );
    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: ApplicationRouteContext,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, hiredAt, expiredAt, adminNote, opsCode } = body;

    const applications = await getApplicationsFromSheet();
    const application = applications.find((item) => item.id === id);
    if (!application)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData = { ...application, updatedAt: new Date() };

    if (status) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (opsCode !== undefined) updateData.opsCode = opsCode;

    // Parse dates if provided
    if (hiredAt === null || hiredAt === "") updateData.hiredAt = "";
    else if (hiredAt) updateData.hiredAt = new Date(hiredAt);
    if (expiredAt === null || expiredAt === "") updateData.expiredAt = "";
    else if (expiredAt) updateData.expiredAt = new Date(expiredAt);

    await updateApplicationInSheet(updateData);

    // If status changed to PASSED, add to Tracking Sheet
    if (status === "PASSED" && application.status !== "PASSED") {
      await addTrackingToSheet({
        fullName: application.fullName,
        phone: application.phone,
        cvDate: new Date().toLocaleDateString("vi-VN"),
        status: "Mới",
        team: application.workSchedule || application.preferredShift || application.jobTitle,
        opsCode: updateData.opsCode || application.opsCode || "",
      }).catch(err => console.error("Error adding tracking:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update app error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}