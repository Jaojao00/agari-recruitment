import { NextResponse } from "next/server";
import {
  applicationSchema,
  normalizeApplicationPayload,
} from "@/lib/validation/application";
import {
  addApplicationToSheet,
  getApplicationsFromSheet,
} from "@/lib/google-sheets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const normalizedBody = normalizeApplicationPayload(body);

    // 1. Backend validate
    const validatedData = applicationSchema.parse(normalizedBody);

    const existingApplications = await getApplicationsFromSheet();
    const duplicate = existingApplications.find(
      (application) =>
        application.cccd === validatedData.cccd ||
        application.phone === validatedData.phone,
    );
    if (duplicate) {
      return NextResponse.json(
        {
          error: `Hồ sơ của bạn đã tồn tại với mã ${duplicate.applicationId}.`,
        },
        { status: 400 },
      );
    }
    const newAppId = `AG-${new Date().getFullYear()}-${String(existingApplications.length + 1).padStart(6, "0")}`;
    const now = new Date();

    const applicationData = {
      ...validatedData,
      applicationId: newAppId,
      status: "NEW",
      appliedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    await addApplicationToSheet(applicationData);

    return NextResponse.json(
      { success: true, applicationId: newAppId },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Submit application error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra trong hệ thống. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
