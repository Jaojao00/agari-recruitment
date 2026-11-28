import { google } from "googleapis";
import { getApplicationsFromSheet } from "./index";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getPrivateKey() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim()
    .replace(/^"|"$/g, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n");
  if (!privateKey) {
    throw new Error("Missing GOOGLE_PRIVATE_KEY environment variable");
  }
  return privateKey;
}

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
      private_key: getPrivateKey(),
    },
    scopes: SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

function getSpreadsheetId() {
  const spreadsheetId = (process.env.GOOGLE_SHEETS_ID ?? "")
    .trim()
    .replace(/^GOOGLE_SHEETS_ID=/i, "")
    .replace(/^"|"$/g, "");
  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEETS_ID environment variable");
  }
  return spreadsheetId;
}

export function normalizePhone(phone: string): string {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("84") && digits.length >= 11) {
    return "0" + digits.slice(2);
  }
  if (digits.length === 9 && !digits.startsWith("0")) {
    return "0" + digits;
  }
  return digits;
}

export function normalizeCccd(cccd: string): string {
  const digits = String(cccd || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && !digits.startsWith("0")) {
    return "0" + digits;
  }
  return digits;
}

export interface OnlineCandidateProfile {
  profileId: string;
  fullName: string;
  phone: string;
  email?: string;
  cccd: string;
  dateOfBirth: string;
  gender: "Nam" | "Nữ" | string;
  opsCode?: string;
  permanentAddress: string;
  preferredLocation: string;
  education: string;
  preferredShift: string;
  workSchedule?: string;
  availableStartDate: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  rowNumber?: number;
}

export type ChatSender = "candidate" | "admin" | "bot";
export type ChatMessageType =
  | "text"
  | "interview_invite"
  | "status_update"
  | "quick_apply";

export interface ChatMessageMetadata {
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  documents?: string;
  applicationId?: string;
  jobTitle?: string;
  status?: string;
  statusLabel?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string; // normalized candidate phone
  candidateName: string;
  candidatePhone: string;
  sender: ChatSender;
  senderName: string;
  content: string;
  type: ChatMessageType;
  metadata?: ChatMessageMetadata;
  createdAt: string;
  readByAdmin: boolean;
  readByCandidate: boolean;
  rowNumber?: number;
}

export interface ChatThreadSummary {
  roomId: string;
  candidateName: string;
  candidatePhone: string;
  lastMessage: string;
  lastSender: ChatSender;
  lastMessageAt: string;
  unreadByAdmin: number;
  unreadByCandidate: number;
  profile?: OnlineCandidateProfile | null;
  applicationsCount?: number;
  latestStatus?: string;
}

const PROFILES_SHEET_NAME = "HỒ SƠ ONLINE (WEB)";
const CHAT_SHEET_NAME = "CHAT ONLINE";

let ensuredSheetsPromise: Promise<void> | null = null;

async function ensureChatAndProfileSheets(): Promise<void> {
  if (ensuredSheetsPromise) return ensuredSheetsPromise;

  ensuredSheetsPromise = (async () => {
    try {
      const sheets = getSheetsClient();
      const spreadsheetId = getSpreadsheetId();
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const existingTitles = new Set(
        (meta.data.sheets || []).map((s) => s.properties?.title || ""),
      );

      const requests: Record<string, unknown>[] = [];
      const needProfiles = !existingTitles.has(PROFILES_SHEET_NAME);
      const needChat = !existingTitles.has(CHAT_SHEET_NAME);

      if (needProfiles) {
        requests.push({
          addSheet: {
            properties: {
              title: PROFILES_SHEET_NAME,
              gridProperties: { frozenRowCount: 1 },
            },
          },
        });
      }
      if (needChat) {
        requests.push({
          addSheet: {
            properties: {
              title: CHAT_SHEET_NAME,
              gridProperties: { frozenRowCount: 1 },
            },
          },
        });
      }

      if (requests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests },
        });
      }

      if (needProfiles) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${PROFILES_SHEET_NAME}'!A1:O1`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                "Mã Hồ Sơ Online",
                "Họ và tên",
                "Số điện thoại",
                "Số CCCD",
                "Ngày sinh",
                "Giới tính",
                "Mã Ops",
                "Địa chỉ thường trú",
                "Khu vực mong muốn",
                "Trình độ học vấn",
                "Kinh nghiệm",
                "Ca mong muốn",
                "Ngày có thể nhận việc",
                "Ghi chú",
                "Cập nhật lúc",
              ],
            ],
          },
        });
      }

      if (needChat) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${CHAT_SHEET_NAME}'!A1:L1`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                "Mã tin nhắn",
                "Phòng Chat (SĐT)",
                "Tên ứng viên",
                "SĐT ứng viên",
                "Người gửi",
                "Tên người gửi",
                "Nội dung",
                "Loại tin nhắn",
                "Dữ liệu đính kèm (JSON)",
                "Thời gian",
                "Admin đã đọc",
                "Ứng viên đã đọc",
              ],
            ],
          },
        });
      }
    } catch (error) {
      ensuredSheetsPromise = null;
      console.error("Error ensuring chat & profile sheets:", error);
    }
  })();

  return ensuredSheetsPromise;
}

// In-memory caches to keep polling fast and avoid Google Sheets rate limits
let profilesCache: { data: OnlineCandidateProfile[]; expiresAt: number } | null =
  null;
let messagesCache: { data: ChatMessage[]; expiresAt: number } | null = null;

const CACHE_TTL_MS = 8000;

export async function getAllOnlineProfiles(
  forceRefresh = false,
): Promise<OnlineCandidateProfile[]> {
  if (!forceRefresh && profilesCache && Date.now() < profilesCache.expiresAt) {
    return profilesCache.data;
  }

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    let res;
    try {
      res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${PROFILES_SHEET_NAME}'!A2:P`,
      });
    } catch (innerErr: unknown) {
      const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
      if (msg.includes("Unable to parse range")) {
        await ensureChatAndProfileSheets();
        res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${PROFILES_SHEET_NAME}'!A2:P`,
        });
      } else {
        throw innerErr;
      }
    }

    const rows = res.data.values || [];
    const profiles: OnlineCandidateProfile[] = rows
      .map((row, idx) => ({
        profileId: row[0] || `PF-${idx + 2}`,
        fullName: row[1] || "",
        phone: normalizePhone(row[2] || ""),
        cccd: normalizeCccd(row[3] || ""),
        dateOfBirth: row[4] || "",
        gender: row[5] || "Nam",
        opsCode: row[6] || "",
        permanentAddress: row[7] || "",
        preferredLocation: row[8] || "",
        education: row[9] || "12/12",
        preferredShift:
          row[10] || "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
        workSchedule: row[11] || "",
        availableStartDate: row[12] || "",
        note: row[13] || "",
        createdAt: row[14] || new Date().toISOString(),
        updatedAt: row[14] || new Date().toISOString(),
        email: String(row[15] || "").trim().toLowerCase(),
        rowNumber: idx + 2,
      }))
      .filter((p) => Boolean(p.phone || p.cccd));

    profilesCache = {
      data: profiles,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    return profiles;
  } catch (error) {
    console.error("getAllOnlineProfiles error (using fallback cache):", error);
    if (profilesCache) {
      return profilesCache.data;
    }
    return [];
  }
}

export async function upsertOnlineProfile(
  input: Partial<OnlineCandidateProfile> & { fullName: string; phone: string },
): Promise<OnlineCandidateProfile> {
  await ensureChatAndProfileSheets();
  const normalizedPhone = normalizePhone(input.phone);
  const existingProfiles = await getAllOnlineProfiles(true);

  const existing = existingProfiles.find(
    (p) =>
      (normalizedPhone && p.phone === normalizedPhone) ||
      (input.cccd && p.cccd && p.cccd === input.cccd.trim()),
  );

  const nowIso = new Date().toISOString();
  const profileId =
    existing?.profileId ||
    `PF-${new Date().getFullYear()}-${String(existingProfiles.length + 1).padStart(5, "0")}`;

  const merged: OnlineCandidateProfile = {
    profileId,
    fullName: input.fullName?.trim() || existing?.fullName || "",
    phone: normalizedPhone || existing?.phone || "",
    email:
      input.email !== undefined
        ? input.email.trim().toLowerCase()
        : existing?.email || "",
    cccd: input.cccd?.trim() || existing?.cccd || "",
    dateOfBirth: input.dateOfBirth || existing?.dateOfBirth || "",
    gender: input.gender || existing?.gender || "Nam",
    opsCode:
      input.opsCode !== undefined ? input.opsCode : existing?.opsCode || "",
    permanentAddress:
      input.permanentAddress || existing?.permanentAddress || "",
    preferredLocation:
      input.preferredLocation || existing?.preferredLocation || "",
    education: input.education || existing?.education || "12/12",
    preferredShift:
      input.preferredShift ||
      existing?.preferredShift ||
      "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
    workSchedule:
      input.workSchedule !== undefined
        ? input.workSchedule
        : existing?.workSchedule || "",
    availableStartDate:
      input.availableStartDate || existing?.availableStartDate || "",
    note: input.note !== undefined ? input.note : existing?.note || "",
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
    rowNumber: existing?.rowNumber,
  };

  const rowValues = [
    merged.profileId,
    merged.fullName,
    merged.phone,
    merged.cccd,
    merged.dateOfBirth,
    merged.gender,
    merged.opsCode || "",
    merged.permanentAddress,
    merged.preferredLocation,
    merged.education,
    merged.preferredShift,
    merged.workSchedule || "",
    merged.availableStartDate,
    merged.note || "",
    merged.updatedAt,
    merged.email || "",
  ];

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (existing?.rowNumber) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${PROFILES_SHEET_NAME}'!A${existing.rowNumber}:P${existing.rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values: [rowValues] },
    });
  } else {
    const targetRow = existingProfiles.length + 2;
    merged.rowNumber = targetRow;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${PROFILES_SHEET_NAME}'!A${targetRow}:P${targetRow}`,
      valueInputOption: "RAW",
      requestBody: { values: [rowValues] },
    });
  }

  // Update cache immediately
  const updatedList = existing
    ? existingProfiles.map((p) =>
        p.profileId === merged.profileId ? merged : p,
      )
    : [...existingProfiles, merged];
  profilesCache = {
    data: updatedList,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };

  return merged;
}

export async function lookupCandidateProfileAndApplications(params: {
  phone?: string;
  cccd?: string;
}) {
  const normPhone = params.phone ? normalizePhone(params.phone) : "";
  const normCccd = params.cccd ? params.cccd.trim() : "";

  const [profiles, allApps] = await Promise.all([
    getAllOnlineProfiles(),
    getApplicationsFromSheet(),
  ]);

  const matchingApps = allApps.filter((app) => {
    const appPhone = normalizePhone(app.phone || "");
    const appCccd = String(app.cccd || "").trim();
    if (normPhone && appPhone === normPhone) return true;
    if (normCccd && appCccd === normCccd) return true;
    return false;
  });

  // Sort latest application first
  matchingApps.sort((a, b) =>
    String(b.updatedAt || b.createdAt || "").localeCompare(
      String(a.updatedAt || a.createdAt || ""),
    ),
  );

  let profile =
    profiles.find((p) => {
      if (normPhone && p.phone === normPhone) return true;
      if (normCccd && p.cccd === normCccd) return true;
      return false;
    }) || null;

  // If no saved online profile yet, synthesize one from their latest application
  if (!profile && matchingApps.length > 0) {
    const latest = matchingApps[0];
    profile = {
      profileId: `PF-AUTO-${latest.applicationId}`,
      fullName: latest.fullName || "",
      phone: normalizePhone(latest.phone || ""),
      cccd: latest.cccd || "",
      dateOfBirth: latest.dateOfBirth || "",
      gender: latest.gender || "Nam",
      opsCode: latest.opsCode || "",
      permanentAddress: latest.permanentAddress || "",
      preferredLocation: latest.preferredLocation || "",
      education: latest.education || "12/12",
      preferredShift:
        latest.preferredShift ||
        "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
      workSchedule: latest.workSchedule || "",
      availableStartDate: latest.availableStartDate || "",
      note: latest.note || "",
      createdAt: String(latest.createdAt || new Date().toISOString()),
      updatedAt: String(latest.updatedAt || new Date().toISOString()),
    };
  }

  return {
    profile,
    applications: matchingApps,
  };
}

export async function getAllChatMessages(
  forceRefresh = false,
): Promise<ChatMessage[]> {
  if (!forceRefresh && messagesCache && Date.now() < messagesCache.expiresAt) {
    return messagesCache.data;
  }

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    let res;
    try {
      res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${CHAT_SHEET_NAME}'!A2:L`,
      });
    } catch (innerErr: unknown) {
      const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
      if (msg.includes("Unable to parse range")) {
        await ensureChatAndProfileSheets();
        res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${CHAT_SHEET_NAME}'!A2:L`,
        });
      } else {
        throw innerErr;
      }
    }

    const rows = res.data.values || [];
    const messages: ChatMessage[] = rows
      .map((row, index) => {
        let metadata: ChatMessageMetadata | undefined;
        if (row[8]) {
          try {
            metadata = JSON.parse(row[8]);
          } catch {
            metadata = undefined;
          }
        }
        return {
          id: row[0] || `MSG-${index + 2}`,
          roomId: normalizePhone(row[1] || ""),
          candidateName: row[2] || "Ứng viên",
          candidatePhone: normalizePhone(row[3] || row[1] || ""),
          sender: (row[4] as ChatSender) || "candidate",
          senderName: row[5] || row[2] || "Ứng viên",
          content: row[6] || "",
          type: (row[7] as ChatMessageType) || "text",
          metadata,
          createdAt: row[9] || new Date().toISOString(),
          readByAdmin: String(row[10] || "").toUpperCase() === "TRUE",
          readByCandidate: String(row[11] || "").toUpperCase() === "TRUE",
          rowNumber: index + 2,
        };
      })
      .filter((m) => Boolean(m.roomId && m.content));

    messagesCache = {
      data: messages,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return messages;
  } catch (error) {
    console.error("getAllChatMessages error (using fallback cache):", error);
    if (messagesCache) {
      return messagesCache.data;
    }
    return [];
  }
}

export async function appendChatMessage(input: {
  roomId: string;
  candidateName: string;
  candidatePhone: string;
  sender: ChatSender;
  senderName: string;
  content: string;
  type?: ChatMessageType;
  metadata?: ChatMessageMetadata;
}): Promise<ChatMessage> {
  const existing = await getAllChatMessages();
  const normRoom = normalizePhone(input.roomId || input.candidatePhone);
  const nowIso = new Date().toISOString();
  const msgId = `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const newMessage: ChatMessage = {
    id: msgId,
    roomId: normRoom,
    candidateName: input.candidateName?.trim() || "Ứng viên",
    candidatePhone: normRoom,
    sender: input.sender,
    senderName: input.senderName?.trim() || "Ứng viên",
    content: input.content.trim(),
    type: input.type || "text",
    metadata: input.metadata,
    createdAt: nowIso,
    readByAdmin: input.sender !== "candidate",
    readByCandidate: input.sender === "candidate",
    rowNumber: existing.length + 2,
  };

  const rowValues = [
    newMessage.id,
    newMessage.roomId,
    newMessage.candidateName,
    newMessage.candidatePhone,
    newMessage.sender,
    newMessage.senderName,
    newMessage.content,
    newMessage.type,
    newMessage.metadata ? JSON.stringify(newMessage.metadata) : "",
    newMessage.createdAt,
    newMessage.readByAdmin ? "TRUE" : "FALSE",
    newMessage.readByCandidate ? "TRUE" : "FALSE",
  ];

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${CHAT_SHEET_NAME}'!A:L`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [rowValues] },
  });

  const updated = [...existing, newMessage];
  messagesCache = {
    data: updated,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };

  return newMessage;
}

export async function markRoomMessagesRead(
  roomId: string,
  reader: "admin" | "candidate",
): Promise<void> {
  const normRoom = normalizePhone(roomId);
  const messages = await getAllChatMessages(false);
  const toUpdate = messages.filter(
    (m) =>
      m.roomId === normRoom &&
      (reader === "admin" ? !m.readByAdmin : !m.readByCandidate) &&
      m.rowNumber,
  );

  if (toUpdate.length === 0) return;

  try {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    const colLetter = reader === "admin" ? "K" : "L";

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: toUpdate.map((m) => ({
          range: `'${CHAT_SHEET_NAME}'!${colLetter}${m.rowNumber}`,
          values: [["TRUE"]],
        })),
      },
    });

    // Update cache
    messagesCache = {
      data: messages.map((m) => {
        if (m.roomId !== normRoom) return m;
        return reader === "admin"
          ? { ...m, readByAdmin: true }
          : { ...m, readByCandidate: true };
      }),
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
  } catch (error) {
    console.error("markRoomMessagesRead non-fatal error:", error);
  }
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "Đang xử lý",
  CONTACTED: "Đã liên hệ",
  INTERVIEW_SCHEDULED: "Lịch phỏng vấn",
  INTERVIEWED: "Đã phỏng vấn",
  PASSED: "Đạt phỏng vấn",
  FAILED: "Chưa phù hợp",
  HIRED: "Đã trúng tuyển",
  WORKING: "Đã nhận việc",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã hủy",
};

function normalizeVi(str: string): string {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function buildAreaPickerPrompt(candidateName: string, topicHint?: string): string {
  const intro = topicHint
    ? `Chào ${candidateName}! Để gửi thông tin chính xác nhất về ${topicHint}, bạn vui lòng chọn 1 KHU VỰC đang mở tuyển bên dưới nhé:`
    : `Chào ${candidateName}! 👋 AGARI hiện đang mở tuyển tại các khu vực sau — bạn hãy nhắn hoặc bấm chọn 1 KHU VỰC để nhận thông tin chi tiết nhất nhé:`;

  return (
    `${intro}\n\n` +
    `1️⃣ Tech Link Q.7 (KCX Tân Thuận, TP.HCM – 300k–500k/ca, bao cơm, lương tuần Thứ 6)\n` +
    `2️⃣ TP.HCM SPX (Q. Bình Tân, Q. Tân Phú & 19 Hub – 10.5M–12.5M/tháng)\n` +
    `3️⃣ Vĩnh Long Part-time (SW SOC KCN Bình Minh – 125k–300k/ca, đăng ký lịch tuần)\n\n` +
    `ℹ️ Lưu ý: Các khu vực Cần Thơ, Sóc Trăng, Đồng Tháp và Vĩnh Long Full-time hiện đang tạm ngưng tuyển (đã đủ chỉ tiêu).\n` +
    `👉 Hãy bấm nút khu vực bên dưới hoặc nhắn tên khu vực bạn quan tâm nhé!`
  );
}

function buildAgeFeedback(normText: string, maxAge = 35): string {
  const yearMatch = normText.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  if (!yearMatch) return "";
  const birthYear = parseInt(yearMatch[1], 10);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  if (age < 18) {
    return `\n⚠️ Lưu ý độ tuổi: Bạn sinh năm ${birthYear} (${age} tuổi) — hiện hệ thống chỉ tiếp nhận ứng viên từ đủ 18 tuổi trở lên ạ.\n`;
  }
  if (age > maxAge) {
    return `\n⚠️ Lưu ý độ tuổi: Bạn sinh năm ${birthYear} (${age} tuổi) — vị trí này ưu tiên độ tuổi từ 18 – ${maxAge} tuổi. HR sẽ kiểm tra thêm và phản hồi trực tiếp cho bạn nhé!\n`;
  }
  return `\n✅ Độ tuổi của bạn (sinh năm ${birthYear} – ${age} tuổi) hoàn toàn phù hợp yêu cầu tuyển dụng!\n`;
}

export async function generateSmartAutoReply(params: {
  roomId: string;
  candidateName: string;
  candidatePhone: string;
  userText: string;
  isFirstCandidateMessage: boolean;
}): Promise<string | null> {
  const norm = normalizeVi(params.userText);

  // 0. Kiểm tra trạng thái hồ sơ đã nộp
  if (
    norm.includes("trang thai") ||
    norm.includes("kiem tra ho so") ||
    norm.includes("ket qua") ||
    norm.includes("ma ho so")
  ) {
    const { applications } = await lookupCandidateProfileAndApplications({
      phone: params.candidatePhone,
    });
    if (applications.length > 0) {
      const lines = applications.slice(0, 3).map((app) => {
        const st = STATUS_LABELS[app.status || "NEW"] || app.status;
        return `• Mã ${app.applicationId}: ${app.jobTitle || "Nhân viên kho"} (${app.preferredLocation || "Đang cập nhật"}) ➜ Trạng thái: [${st}]`;
      });
      return `Chào ${params.candidateName}, hệ thống AGARI tìm thấy ${applications.length} hồ sơ ứng tuyển với SĐT ${params.candidatePhone}:\n${lines.join("\n")}\n\nNhân sự phụ trách sẽ phản hồi trực tiếp cho bạn ngay tại khung chat này nhé!`;
    } else {
      return `Chào ${params.candidateName}, hiện hệ thống chưa ghi nhận đơn ứng tuyển nào với SĐT ${params.candidatePhone}. Bạn có thể bấm vào mục "Hồ sơ Online" trên thanh menu để tạo hồ sơ và ứng tuyển nhanh 1 chạm nhé!`;
    }
  }

  // 1. QUÉT TỪ KHÓA NHẬN DIỆN CHÍNH XÁC KHU VỰC ỨNG VIÊN CHỌN (ưu tiên cao nhất!)
  const isTechLink =
    norm.includes("tech link") ||
    norm.includes("techlink") ||
    norm.includes("tan thuan") ||
    /\bq\.?\s*7\b/.test(norm) ||
    norm.includes("quan 7") ||
    norm.includes("linh kien");

  const isSocTrang =
    norm.includes("soc trang") || norm.includes("nam ky khoi nghia");

  const isThotNot = norm.includes("thot not");
  const isCanTho =
    norm.includes("can tho") ||
    norm.includes("long thoi") ||
    norm.includes("thoi long") ||
    norm.includes("ql91") ||
    norm.includes("quoc lo 91");

  const isVinhLong =
    norm.includes("vinh long") ||
    norm.includes("binh minh") ||
    norm.includes("sw soc") ||
    norm.includes("my hoa");

  const isHcmSpx =
    !isTechLink &&
    (norm.includes("tp.hcm") ||
      norm.includes("tphcm") ||
      norm.includes("tp hcm") ||
      norm.includes("sai gon") ||
      norm.includes("ho chi minh") ||
      norm.includes("binh tan") ||
      norm.includes("tan phu") ||
      /\bhcm\b/.test(norm));

  const isDongThap =
    norm.includes("dong thap") ||
    norm.includes("cao lanh") ||
    norm.includes("lap vo") ||
    norm.includes("sa dec");

  // 1a. TECH LINK Q.7
  if (isTechLink) {
    const ageNote = buildAgeFeedback(norm, 40);
    return (
      `🔥 THÔNG TIN CHI TIẾT DỰ ÁN TECH LINK – KCX TÂN THUẬN, QUẬN 7 (ĐANG TUYỂN GẤP):\n` +
      ageNote +
      `\n💰 MỨC LƯƠNG THEO CA (Nhận lương tuần uy tín vào Thứ 6):\n` +
      `• Ca 8 tiếng Ngày: 300.000 VNĐ / Ca\n` +
      `• Ca 8 tiếng Đêm: 350.000 VNĐ / Ca\n` +
      `• Ca 12 tiếng Ngày (08:00 – 20:00): 435.000 VNĐ / Ca\n` +
      `• Ca 12 tiếng Đêm (20:00 – 08:00): 500.000 VNĐ / Ca\n` +
      `🎁 Đãi ngộ: BAO CƠM theo ca • Có nhận làm Part-time đăng ký lịch theo tuần • Nghỉ 1 tiếng 30 phút/ca (chia 2 lần).\n\n` +
      `📦 Công việc: Kho linh kiện ô tô, nhựa gia dụng, đóng gói, đổ khuôn, kiểm tra sản phẩm... được hướng dẫn cụ thể từ A–Z.\n` +
      `🪪 Yêu cầu & Hồ sơ: Biết đọc viết, không cận thị, mặc quần dài, không mang điện thoại vào xưởng. Chỉ cần CCCD photo (hoàn tiền photo vào kỳ lương) + VNeID mức 2 & SMS chính chủ.\n\n` +
      `📍 Địa điểm: Công ty Tech Link – Số 05B-07A Đường Số 15, KCX Tân Thuận, Quận 7, TP.HCM.\n` +
      `👉 Nộp hồ sơ nhanh: https://agari-recruitment.vercel.app/ung-tuyen?job=tech-link-quan-7\n` +
      `📞 Zalo hỗ trợ đi làm ngay: 0586.482.344 (Gặp Tài)`
    );
  }

  // 1b. SÓC TRĂNG (TẠM NGƯNG TUYỂN)
  if (isSocTrang) {
    const ageNote = buildAgeFeedback(norm, 35);
    return (
      `⚠️ Chào ${params.candidateName}, khu vực **Sóc Trăng** hiện đã tuyển đủ chỉ tiêu và đang **tạm ngưng nhận hồ sơ mới**.\n` +
      ageNote +
      `\n🔥 Hiện AGARI đang tuyển gấp & đi làm ngay tại các khu vực sau:\n` +
      `1️⃣ Tech Link Q.7 (KCX Tân Thuận, TP.HCM): 300k–500k/ca, bao cơm, lương tuần Thứ 6.\n` +
      `2️⃣ TP.HCM SPX (Bình Tân, Tân Phú & 19 Hub): 10.5M – 12.5M/tháng, đóng đủ BHXH.\n` +
      `3️⃣ Vĩnh Long Part-time (KCN Bình Minh): 125k – 300k/ca, đăng ký lịch tuần.\n\n` +
      `👉 Bạn có muốn tìm hiểu khu vực nào trong 3 vị trí trên không? Hoặc nhắn Zalo HR: 0586.482.344 (Gặp Tài) để được lưu thông tin khi Sóc Trăng mở đợt mới nhé!`
    );
  }

  // 1c. CẦN THƠ (TẠM NGƯNG TUYỂN)
  if (isCanTho || isThotNot) {
    const ageNote = buildAgeFeedback(norm, 35);
    return (
      `⚠️ Chào ${params.candidateName}, khu vực **Cần Thơ (Long Thới & Thốt Nốt)** hiện đã tuyển đủ chỉ tiêu và đang **tạm ngưng nhận hồ sơ mới**.\n` +
      ageNote +
      `\n🔥 Nếu bạn ở gần khu vực **KCN Bình Minh, Vĩnh Long** (chỉ qua cầu Cần Thơ), AGARI đang mở tuyển **Part-time linh hoạt (125k – 300k/ca, trả lương Thứ 6 hàng tuần)**!\n` +
      `👉 Đăng ký Part-time Vĩnh Long: https://agari-recruitment.vercel.app/ung-tuyen?job=agari-part-time\n` +
      `🔥 Hoặc tham khảo các dự án đang tuyển gấp tại TP.HCM: **Tech Link Q.7 (300k–500k/ca, bao cơm)** & **SPX TP.HCM (10.5M–12.5M/tháng)**.\n` +
      `📞 Zalo HR: 0586.482.344 (Gặp Tài)`
    );
  }

  // 1d. VĨNH LONG (PART-TIME ĐANG TUYỂN, FULL-TIME TẠM NGƯNG)
  if (isVinhLong) {
    const ageNote = buildAgeFeedback(norm, 35);
    return (
      `🔥 THÔNG TIN TUYỂN DỤNG TẠI KHO SPX – SW SOC KCN BÌNH MINH, VĨNH LONG:\n` +
      ageNote +
      `\n✅ ĐANG MỞ TUYỂN: PART-TIME / THỜI VỤ LINH HOẠT (125.000 – 300.000 VNĐ/ca • Trả lương Thứ 6 hàng tuần):\n` +
      `• Ca 1 (06:00 – 15:00): 250.000đ/ca\n` +
      `• Ca 2 (13:00 – 22:00): 250.000đ/ca\n` +
      `• Ca 3 đêm (22:00 – 06:00): 300.000đ/ca\n` +
      `• Ca 4 ngắn 4h (18:00 – 22:00): 125.000đ/ca\n` +
      `• Ca 5 ngắn 5h (06:00 – 11:00): 155.000đ/ca\n` +
      `⚠️ Lưu ý: Vị trí Full-time BPO tại Vĩnh Long hiện tạm ngưng tuyển do đã đủ chỉ tiêu.\n\n` +
      `📍 Địa chỉ: Lô 01, kho số A01, KCN Bình Minh, Ấp Mỹ Lợi, Xã Mỹ Hòa, Vĩnh Long.\n` +
      `🪪 Yêu cầu: Nam/Nữ 18 – 35 tuổi, có CCCD gốc & VNeID Mức 2 (không cần kinh nghiệm).\n` +
      `👉 Nộp Part-time nhanh: https://agari-recruitment.vercel.app/ung-tuyen?job=agari-part-time\n` +
      `📞 Zalo hỗ trợ: 0586.482.344 (Gặp Tài)`
    );
  }

  // 1e. TP.HCM SPX (S-BPO)
  if (isHcmSpx) {
    const ageNote = buildAgeFeedback(norm, 35);
    return (
      `🔥 THÔNG TIN CHI TIẾT NHÂN VIÊN CHÍNH THỨC (S-BPO) KHO SPX – TP.HCM:\n` +
      ageNote +
      `\n💰 THU NHẬP DỰ KIẾN: 10.500.000 – 12.500.000đ / THÁNG (Định mức chưa tăng ca: 10.400.000đ):\n` +
      `• Lương cơ bản: 5.310.000đ (Ký HĐLĐ chính thức, đóng BHXH đầy đủ)\n` +
      `• Phụ cấp nhà ở & xăng xe: 1.310.000đ | Phụ cấp cơm: 780.000đ\n` +
      `• Phụ cấp KPI hiệu suất: 2.500.000đ | Hỗ trợ 2 tháng thử việc: 500.000đ/tháng\n\n` +
      `⏰ Chế độ xoay 5 ca (tối thiểu 23 công/tháng, nghỉ xoay tuần): Ca 1 (05:00-14:00) | Ca 2 & 3 (11:00-20:00 & 12:00-21:00) | Ca 4 & 5 (14:00-23:00 & 15:00-24:00).\n` +
      `📍 Địa chỉ phỏng vấn chính:\n` +
      `• Q. Bình Tân: 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân\n` +
      `• Q. Tân Phú: 549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân (+ 19 Hub SPX khắp TP.HCM)\n` +
      `🪪 Hồ sơ phỏng vấn: Mang theo CCCD gắn chip bản gốc.\n\n` +
      `👉 Xem 19 Hub & Nộp hồ sơ: https://agari-recruitment.vercel.app/viec-lam/tp-ho-chi-minh\n` +
      `📞 Zalo hỗ trợ: 0586.482.344 (Gặp Tài)`
    );
  }

  // 1f. ĐỒNG THÁP (ĐÃ TUYỂN ĐỦ)
  if (isDongThap) {
    return (
      `✅ Khu vực Đồng Tháp (Cao Lãnh / Lấp Vò / Sa Đéc) hiện đã tuyển đủ số lượng chỉ tiêu cho đợt này ạ.\n\n` +
      buildAreaPickerPrompt(params.candidateName, "các khu vực đang mở tuyển gần bạn")
    );
  }

  // 2. Hỏi chung về giấy tờ / CCCD
  if (
    norm.includes("giay to") ||
    norm.includes("ho so can") ||
    norm.includes("cccd") ||
    norm.includes("mang theo gi")
  ) {
    return (
      `🪪 Hồ sơ khi đi phỏng vấn & nhận việc rất đơn giản:\n` +
      `• Kho SPX (TP.HCM, Sóc Trăng, Cần Thơ, Vĩnh Long): Mang theo CCCD gắn chip bản gốc và cài VNeID Mức 2.\n` +
      `• Dự án Tech Link (KCX Tân Thuận, Q.7): Chỉ cần CCCD photo (hoàn tiền photo vào kỳ lương) + VNeID Mức 2 & SMS chính chủ.\n\n` +
      `👉 Bạn muốn ứng tuyển khu vực nào (Tech Link Q.7 / TP.HCM SPX / Sóc Trăng / Cần Thơ / Vĩnh Long)? Nhắn tên khu vực để trợ lý gửi chi tiết nhé!`
    );
  }

  // 3. Hỏi chung về mức lương / ca làm / địa chỉ / khu vực / còn tuyển nhưng CHƯA nêu tên khu vực cụ thể
  if (
    norm.includes("khu vuc") ||
    norm.includes("dia chi") ||
    norm.includes("o dau") ||
    norm.includes("dia diem") ||
    norm.includes("kho nao") ||
    norm.includes("hub nao") ||
    norm.includes("tinh nao") ||
    norm.includes("con tuyen") ||
    norm.includes("het tuyen") ||
    norm.includes("ngung tuyen") ||
    norm.includes("muc luong") ||
    norm.includes("thu nhap") ||
    norm.includes("phu cap") ||
    norm.includes("luong bao nhieu") ||
    norm.includes("luong tuan") ||
    norm.includes("ca lam") ||
    norm.includes("thoi gian") ||
    norm.includes("xoay ca") ||
    norm.includes("may gio") ||
    norm.includes("nam hay nu") ||
    norm.includes("gioi tinh") ||
    norm.includes("sinh nam") ||
    norm.includes("bao nhieu tuoi") ||
    norm.includes("do tuoi")
  ) {
    let topicHint = "vị trí tuyển dụng";
    if (norm.includes("dia chi") || norm.includes("dia diem") || norm.includes("o dau")) {
      topicHint = "địa chỉ phỏng vấn & làm việc";
    } else if (norm.includes("luong") || norm.includes("thu nhap") || norm.includes("phu cap")) {
      topicHint = "mức lương & phụ cấp";
    } else if (norm.includes("ca lam") || norm.includes("thoi gian") || norm.includes("xoay ca")) {
      topicHint = "ca làm việc";
    }
    return buildAreaPickerPrompt(params.candidateName, topicHint);
  }

  // 4. Tin nhắn chào đầu tiên nếu chưa khớp từ khóa nào
  if (params.isFirstCandidateMessage) {
    return buildAreaPickerPrompt(params.candidateName);
  }

  return null;
}
