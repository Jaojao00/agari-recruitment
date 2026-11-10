import { NextResponse } from "next/server";
import {
  getAllChatMessages,
  appendChatMessage,
  markRoomMessagesRead,
  getAllOnlineProfiles,
  normalizePhone,
  ChatThreadSummary,
  ChatMessageType,
  ChatMessageMetadata,
} from "@/lib/google-sheets/chat-and-profiles";
import {
  getApplicationsFromSheet,
  updateApplicationInSheet,
} from "@/lib/google-sheets";
import { sendCandidateResultEmail } from "@/lib/email/mailer";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Đang xử lý",
  CONTACTED: "Đã liên hệ",
  INTERVIEW_SCHEDULED: "Lịch phỏng vấn",
  INTERVIEWED: "Đã phỏng vấn",
  PASSED: "Đạt",
  FAILED: "Không đạt",
  HIRED: "Đã trúng tuyển",
  WORKING: "Đã nhận việc",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã hủy",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId")
      ? normalizePhone(searchParams.get("roomId")!)
      : "";
    const summaryOnly = searchParams.get("summaryOnly") === "true";

    const [allMessages, profiles, allApps] = await Promise.all([
      getAllChatMessages(),
      summaryOnly ? Promise.resolve([]) : getAllOnlineProfiles(),
      summaryOnly ? Promise.resolve([]) : getApplicationsFromSheet(),
    ]);

    // Group messages by roomId
    const roomMap = new Map<string, typeof allMessages>();
    for (const msg of allMessages) {
      if (!msg.roomId) continue;
      const list = roomMap.get(msg.roomId) || [];
      list.push(msg);
      roomMap.set(msg.roomId, list);
    }

    let totalUnread = 0;
    const threads: ChatThreadSummary[] = [];

    for (const [rId, msgs] of roomMap.entries()) {
      const lastMsg = msgs[msgs.length - 1];
      const unreadByAdmin = msgs.filter(
        (m) => m.sender === "candidate" && !m.readByAdmin,
      ).length;
      const unreadByCandidate = msgs.filter(
        (m) => m.sender !== "candidate" && !m.readByCandidate,
      ).length;

      totalUnread += unreadByAdmin;

      const candidateApps = summaryOnly
        ? []
        : allApps.filter((a) => normalizePhone(a.phone || "") === rId);
      const profile = summaryOnly
        ? null
        : profiles.find((p) => p.phone === rId) || null;

      threads.push({
        roomId: rId,
        candidateName:
          profile?.fullName ||
          candidateApps[0]?.fullName ||
          lastMsg.candidateName ||
          "Ứng viên",
        candidatePhone: rId,
        lastMessage: lastMsg.content,
        lastSender: lastMsg.sender,
        lastMessageAt: lastMsg.createdAt,
        unreadByAdmin,
        unreadByCandidate,
        profile,
        applicationsCount: candidateApps.length,
        latestStatus: candidateApps[0]?.status || undefined,
      });
    }

    threads.sort((a, b) =>
      String(b.lastMessageAt).localeCompare(String(a.lastMessageAt)),
    );

    if (summaryOnly) {
      return NextResponse.json({
        totalUnread,
        threadsCount: threads.length,
      });
    }

    if (roomId) {
      const roomMessages = roomMap.get(roomId) || [];
      const candidateApps = allApps
        .filter((a) => normalizePhone(a.phone || "") === roomId)
        .sort((a, b) =>
          String(b.updatedAt || b.createdAt || "").localeCompare(
            String(a.updatedAt || a.createdAt || ""),
          ),
        );
      let profile = profiles.find((p) => p.phone === roomId) || null;
      if (!profile && candidateApps.length > 0) {
        const latest = candidateApps[0];
        profile = {
          profileId: `PF-AUTO-${latest.applicationId}`,
          fullName: latest.fullName || "",
          phone: roomId,
          cccd: latest.cccd || "",
          dateOfBirth: latest.dateOfBirth || "",
          gender: latest.gender || "Nam",
          opsCode: latest.opsCode || "",
          permanentAddress: latest.permanentAddress || "",
          preferredLocation: latest.preferredLocation || "",
          education: latest.education || "12/12",
          preferredShift: latest.preferredShift || "",
          workSchedule: latest.workSchedule || "",
          availableStartDate: latest.availableStartDate || "",
          note: latest.note || "",
          createdAt: String(latest.createdAt || ""),
          updatedAt: String(latest.updatedAt || ""),
        };
      }

      return NextResponse.json({
        totalUnread,
        threads,
        activeRoom: {
          roomId,
          messages: roomMessages,
          profile,
          applications: candidateApps,
        },
      });
    }

    return NextResponse.json({
      totalUnread,
      threads,
    });
  } catch (error) {
    console.error("GET /api/admin/chat error:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách hội thoại." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const roomId = normalizePhone(body.roomId || body.candidatePhone || "");
    const candidateName = String(body.candidateName || "Ứng viên").trim();
    const senderName = String(
      body.senderName || "Nhà tuyển dụng AGARI",
    ).trim();
    const type: ChatMessageType = body.type || "text";
    const metadata: ChatMessageMetadata | undefined = body.metadata;
    let content = String(body.content || "").trim();

    if (!roomId) {
      return NextResponse.json(
        { error: "Thiếu thông tin phòng chat (SĐT ứng viên)." },
        { status: 400 },
      );
    }

    // If Admin sends an interview invite or status update, also update the candidate's application in Google Sheets!
    if (type === "interview_invite" && metadata) {
      if (!content) {
        content = `📅 THƯ MỜI PHỎNG VẤN TRỰC TIẾP\n• Thời gian: ${metadata.interviewTime || "09:00"} ngày ${metadata.interviewDate || ""}\n• Địa điểm: ${metadata.interviewLocation || ""}\n• Giấy tờ cần mang: ${metadata.documents || "CCCD gắn chip bản gốc"}`;
      }

      const [allApps, profiles] = await Promise.all([
        getApplicationsFromSheet(),
        getAllOnlineProfiles(),
      ]);
      const targetApp = metadata.applicationId
        ? allApps.find((a) => a.applicationId === metadata.applicationId)
        : allApps.find((a) => normalizePhone(a.phone || "") === roomId);
      const profile = profiles.find((p) => p.phone === roomId);
      const candidateEmail = targetApp?.email || profile?.email || "";

      if (targetApp) {
        await updateApplicationInSheet({
          ...targetApp,
          status: "INTERVIEW_SCHEDULED",
          adminNote: `Hẹn PV: ${metadata.interviewTime || ""} ${metadata.interviewDate || ""} tại ${metadata.interviewLocation || ""}`,
          updatedAt: new Date(),
        });
        metadata.applicationId = targetApp.applicationId;
        metadata.jobTitle = targetApp.jobTitle;
        metadata.status = "INTERVIEW_SCHEDULED";
        metadata.statusLabel = "Lịch phỏng vấn";
      }

      if (candidateEmail) {
        await sendCandidateResultEmail({
          candidateEmail,
          candidateName,
          candidatePhone: roomId,
          applicationId: metadata.applicationId,
          jobTitle: metadata.jobTitle,
          status: "INTERVIEW_SCHEDULED",
          interviewDate: metadata.interviewDate,
          interviewTime: metadata.interviewTime,
          interviewLocation: metadata.interviewLocation,
          documents: metadata.documents,
        }).catch((e) => console.error("Interview email error:", e));
      }
    } else if (type === "status_update" && metadata?.status) {
      const statusLabel = STATUS_LABELS[metadata.status] || metadata.status;
      metadata.statusLabel = statusLabel;

      const [allApps, profiles] = await Promise.all([
        getApplicationsFromSheet(),
        getAllOnlineProfiles(),
      ]);
      const targetApp = metadata.applicationId
        ? allApps.find((a) => a.applicationId === metadata.applicationId)
        : allApps.find((a) => normalizePhone(a.phone || "") === roomId);
      const profile = profiles.find((p) => p.phone === roomId);
      const candidateEmail = targetApp?.email || profile?.email || "";

      if (targetApp) {
        await updateApplicationInSheet({
          ...targetApp,
          status: metadata.status,
          updatedAt: new Date(),
        });
        metadata.applicationId = targetApp.applicationId;
        metadata.jobTitle = targetApp.jobTitle;
      }

      if (candidateEmail) {
        await sendCandidateResultEmail({
          candidateEmail,
          candidateName,
          candidatePhone: roomId,
          applicationId: metadata.applicationId,
          jobTitle: metadata.jobTitle,
          status: metadata.status,
        }).catch((e) => console.error("Status email error:", e));
      }

      if (!content) {
        content = `🔔 CẬP NHẬT TRẠNG THÁI HỒ SƠ ${metadata.applicationId ? `(${metadata.applicationId})` : ""}\nTrạng thái hồ sơ của bạn đã được cập nhật thành: [${statusLabel}].`;
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: "Nội dung tin nhắn không được để trống." },
        { status: 400 },
      );
    }

    // Mark candidate messages in this room as read by admin
    await markRoomMessagesRead(roomId, "admin");

    const saved = await appendChatMessage({
      roomId,
      candidateName,
      candidatePhone: roomId,
      sender: "admin",
      senderName,
      content,
      type,
      metadata,
    });

    return NextResponse.json({ message: saved });
  } catch (error) {
    console.error("POST /api/admin/chat error:", error);
    return NextResponse.json(
      { error: "Không thể gửi tin nhắn." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const roomId = normalizePhone(body.roomId || "");
    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }
    await markRoomMessagesRead(roomId, "admin");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/chat error:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 },
    );
  }
}
