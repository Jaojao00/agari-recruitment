import { NextResponse } from "next/server";
import {
  getAllChatMessages,
  appendChatMessage,
  markRoomMessagesRead,
  generateSmartAutoReply,
  normalizePhone,
  lookupCandidateProfileAndApplications,
} from "@/lib/google-sheets/chat-and-profiles";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawRoom = searchParams.get("roomId") || searchParams.get("phone") || "";
    const roomId = normalizePhone(rawRoom);
    const markRead = searchParams.get("markRead") === "true";

    if (!roomId) {
      return NextResponse.json({ messages: [], unreadCount: 0 });
    }

    const allMessages = await getAllChatMessages();
    const roomMessages = allMessages.filter(
      (m) => normalizePhone(m.roomId) === roomId,
    );
    const unreadMessages = roomMessages.filter(
      (m) => m.sender !== "candidate" && !m.readByCandidate,
    );

    if (markRead && unreadMessages.length > 0) {
      // Run non-blocking or mark read only when there are actually unread messages
      await markRoomMessagesRead(roomId, "candidate");
    }

    return NextResponse.json({
      messages: roomMessages,
      unreadCount: markRead ? 0 : unreadMessages.length,
    });
  } catch (error) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json(
      { error: "Không thể tải tin nhắn." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidateName = String(body.candidateName || "Ứng viên").trim();
    const candidatePhone = normalizePhone(
      body.candidatePhone || body.roomId || "",
    );
    const content = String(body.content || "").trim();

    if (!candidatePhone || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập Số điện thoại và nội dung tin nhắn." },
        { status: 400 },
      );
    }

    const allMessages = await getAllChatMessages();
    const existingCandidateMsgs = allMessages.filter(
      (m) => normalizePhone(m.roomId) === candidatePhone && m.sender === "candidate",
    );
    const isFirstCandidateMessage = existingCandidateMsgs.length === 0;

    // 1. Save candidate message
    const savedMsg = await appendChatMessage({
      roomId: candidatePhone,
      candidateName,
      candidatePhone,
      sender: "candidate",
      senderName: candidateName,
      content,
      type: "text",
    });

    // 2. Check if we should send a smart auto-reply while waiting for HR
    let botReply = null;
    if (body.disableAutoReply !== true) {
      const replyText = await generateSmartAutoReply({
        roomId: candidatePhone,
        candidateName,
        candidatePhone,
        userText: content,
        isFirstCandidateMessage,
      });

      if (replyText) {
        botReply = await appendChatMessage({
          roomId: candidatePhone,
          candidateName,
          candidatePhone,
          sender: "bot",
          senderName: "Trợ lý Tuyển dụng AGARI",
          content: replyText,
          type: "text",
        });
      }
    }

    let applicationsCount = 0;
    try {
      const lookup = await lookupCandidateProfileAndApplications({
        phone: candidatePhone,
      });
      applicationsCount = lookup.applications.length;
    } catch {
      // ignore
    }

    return NextResponse.json({
      message: savedMsg,
      botReply,
      applicationsCount,
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Không thể gửi tin nhắn. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
