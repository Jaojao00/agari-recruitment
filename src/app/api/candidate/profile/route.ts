import { NextResponse } from "next/server";
import {
  lookupCandidateProfileAndApplications,
  upsertOnlineProfile,
  appendChatMessage,
} from "@/lib/google-sheets/chat-and-profiles";
import {
  addApplicationToSheet,
  getApplicationsFromSheet,
} from "@/lib/google-sheets";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim() || "";
    const cccd = searchParams.get("cccd")?.trim() || "";

    if (!phone && !cccd) {
      return NextResponse.json(
        { error: "Vui lòng nhập Số điện thoại hoặc Số CCCD để tra cứu." },
        { status: 400 },
      );
    }

    const result = await lookupCandidateProfileAndApplications({ phone, cccd });
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/candidate/profile error:", error);
    return NextResponse.json(
      { error: "Không thể tra cứu hồ sơ trực tuyến. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Họ tên và Số điện thoại Zalo." },
        { status: 400 },
      );
    }

    const profile = await upsertOnlineProfile({
      fullName,
      phone,
      cccd: String(body.cccd || "").trim(),
      dateOfBirth: String(body.dateOfBirth || "").trim(),
      gender: body.gender || "Nam",
      opsCode: String(body.opsCode || "").trim(),
      permanentAddress: String(body.permanentAddress || "").trim(),
      preferredLocation: String(body.preferredLocation || "").trim(),
      education: String(body.education || "12/12").trim(),
      preferredShift: String(
        body.preferredShift ||
          "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
      ).trim(),
      workSchedule: String(body.workSchedule || "").trim(),
      availableStartDate:
        String(body.availableStartDate || "").trim() ||
        new Date().toISOString().slice(0, 10),
      note: String(body.note || "").trim(),
    });

    // If quickApply is requested, create an application directly in the corresponding regional sheet
    if (body.applyJobId) {
      const existingApplications = await getApplicationsFromSheet();
      const duplicate = existingApplications.find(
        (app) =>
          (app.phone === profile.phone ||
            (profile.cccd && app.cccd === profile.cccd)) &&
          app.jobId === body.applyJobId,
      );

      if (duplicate) {
        return NextResponse.json(
          {
            profile,
            alreadyApplied: true,
            applicationId: duplicate.applicationId,
            message: `Bạn đã nộp hồ sơ cho vị trí này (Mã: ${duplicate.applicationId}).`,
          },
          { status: 200 },
        );
      }

      const newAppId = `AG-${new Date().getFullYear()}-${String(existingApplications.length + 1).padStart(6, "0")}`;
      const now = new Date();
      const jobTitle = String(body.applyJobTitle || "Nhân viên kho SPX");
      const preferredLocation = String(
        body.applyLocation || profile.preferredLocation || "",
      );
      const workSchedule = String(
        body.applySchedule || profile.workSchedule || "",
      );

      await addApplicationToSheet({
        applicationId: newAppId,
        jobId: String(body.applyJobId),
        jobTitle,
        workSchedule,
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        cccd: profile.cccd,
        phone: profile.phone,
        gender: profile.gender,
        opsCode: profile.opsCode,
        preferredLocation,
        permanentAddress: profile.permanentAddress,
        education: profile.education,
        preferredShift: profile.preferredShift,
        availableStartDate: profile.availableStartDate,
        note: profile.note,
        status: "NEW",
        appliedAt: now,
        createdAt: now,
        updatedAt: now,
      });

      // Also drop a notification in their chat room so HR & Candidate both see the 1-Click application
      try {
        await appendChatMessage({
          roomId: profile.phone,
          candidateName: profile.fullName,
          candidatePhone: profile.phone,
          sender: "candidate",
          senderName: profile.fullName,
          content: `Đã ứng tuyển nhanh 1 chạm vào vị trí: ${jobTitle} (${preferredLocation}) - Mã hồ sơ: ${newAppId}`,
          type: "quick_apply",
          metadata: {
            applicationId: newAppId,
            jobTitle,
            interviewLocation: preferredLocation,
            status: "NEW",
            statusLabel: "Đang xử lý",
          },
        });
      } catch (chatErr) {
        console.error("Quick apply chat notification error:", chatErr);
      }

      const refreshed = await lookupCandidateProfileAndApplications({
        phone: profile.phone,
        cccd: profile.cccd,
      });

      return NextResponse.json({
        profile: refreshed.profile,
        applications: refreshed.applications,
        applicationId: newAppId,
        quickApplied: true,
      });
    }

    const refreshed = await lookupCandidateProfileAndApplications({
      phone: profile.phone,
      cccd: profile.cccd,
    });

    return NextResponse.json({
      profile: refreshed.profile,
      applications: refreshed.applications,
    });
  } catch (error) {
    console.error("POST /api/candidate/profile error:", error);
    return NextResponse.json(
      { error: "Có lỗi khi lưu Hồ sơ Online. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
