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
  if (digits.startsWith("84") && digits.length >= 11) {
    return "0" + digits.slice(2);
  }
  return digits;
}

export interface OnlineCandidateProfile {
  profileId: string;
  fullName: string;
  phone: string;
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

const CACHE_TTL_MS = 4000;

export async function getAllOnlineProfiles(
  forceRefresh = false,
): Promise<OnlineCandidateProfile[]> {
  if (!forceRefresh && profilesCache && Date.now() < profilesCache.expiresAt) {
    return profilesCache.data;
  }

  await ensureChatAndProfileSheets();
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${PROFILES_SHEET_NAME}'!A2:O`,
  });

  const rows = res.data.values || [];
  const profiles: OnlineCandidateProfile[] = rows
    .map((row, idx) => ({
      profileId: row[0] || `PF-${idx + 2}`,
      fullName: row[1] || "",
      phone: normalizePhone(row[2] || ""),
      cccd: String(row[3] || "").trim(),
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
      rowNumber: idx + 2,
    }))
    .filter((p) => Boolean(p.phone || p.cccd));

  profilesCache = {
    data: profiles,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  return profiles;
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
  ];

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (existing?.rowNumber) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${PROFILES_SHEET_NAME}'!A${existing.rowNumber}:O${existing.rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [rowValues] },
    });
  } else {
    const targetRow = existingProfiles.length + 2;
    merged.rowNumber = targetRow;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${PROFILES_SHEET_NAME}'!A${targetRow}:O${targetRow}`,
      valueInputOption: "USER_ENTERED",
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

  await ensureChatAndProfileSheets();
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${CHAT_SHEET_NAME}'!A2:L`,
  });

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
  await ensureChatAndProfileSheets();
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
    valueInputOption: "USER_ENTERED",
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
  const messages = await getAllChatMessages(true);
  const toUpdate = messages.filter(
    (m) =>
      m.roomId === normRoom &&
      (reader === "admin" ? !m.readByAdmin : !m.readByCandidate) &&
      m.rowNumber,
  );

  if (toUpdate.length === 0) return;

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

export async function generateSmartAutoReply(params: {
  roomId: string;
  candidateName: string;
  candidatePhone: string;
  userText: string;
  isFirstCandidateMessage: boolean;
}): Promise<string | null> {
  const text = params.userText.toLowerCase();

  // Check if asking about application status
  if (
    text.includes("trạng thái") ||
    text.includes("kiểm tra hồ sơ") ||
    text.includes("kết quả") ||
    text.includes("mã hồ sơ")
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

  // Check if asking about salary / income / benefits
  if (
    text.includes("mức lương") ||
    text.includes("thu nhập") ||
    text.includes("phụ cấp") ||
    text.includes("lương bao nhiêu")
  ) {
    return (
      `💰 Thông tin Mức lương & Đãi ngộ tại AGARI (SPX Express):\n` +
      `1️⃣ Khu vực TP.HCM (Nhân viên Chính thức): 10.500.000 - 12.500.000đ/tháng (Định mức 10.400.000đ: Lương cơ bản 5.310.000đ + PC nhà ở/xăng 1.310.000đ + PC cơm 780.000đ + KPI 2.500.000đ + Hỗ trợ thử việc 500.000đ/tháng, đóng đủ BHXH).\n` +
      `2️⃣ Khu vực Vĩnh Long - KCN Bình Minh: BPO Cố định 8.400.000 - 11.300.000đ/tháng (250k - 300k/ca) | Part-time: 125k - 300k/ca.\n` +
      `3️⃣ Khu vực Cần Thơ (Thốt Nốt): 250.000đ/ngày + Thưởng chuyên cần 750.000đ/tháng (đủ 26 công).\n` +
      `4️⃣ Khu vực Đồng Tháp: 140.000đ/ca (4 tiếng) - 280.000đ/ngày.\n\n` +
      `Bạn đang quan tâm ứng tuyển khu vực nào để HR tư vấn chi tiết hơn ạ?`
    );
  }

  // Check if asking about shifts / working hours
  if (
    text.includes("ca làm") ||
    text.includes("thời gian") ||
    text.includes("xoay ca") ||
    text.includes("mấy giờ")
  ) {
    return (
      `⏰ Thời gian các ca làm việc tại Kho SPX Express:\n` +
      `• TP.HCM (Xoay 5 ca, tối thiểu 23 công/tháng, nghỉ xoay tuần): Ca 1 (05:00-14:00) | Ca 2 & 3 (11:00-20:00 & 12:00-21:00) | Ca 4 & 5 (14:00-23:00 & 15:00-24:00).\n` +
      `• Vĩnh Long (KCN Bình Minh): Ca 1 (06:00-15:00) | Ca 2 (13:00-22:00) | Ca 3 (22:00-06:00) | Ca Part-time 4h-5h.\n` +
      `• Cần Thơ (Thốt Nốt): Ca hành chính cố định 09:00 - 18:00 (26 công/tháng, nghỉ 4 ngày).\n` +
      `• Đồng Tháp: Ca sáng 08:00-12:00 | Ca chiều 15:00-19:00.\n\n` +
      `Nhà tuyển dụng AGARI đã nhận được tin nhắn và sẽ hỗ trợ xếp lịch ca cho bạn ngay!`
    );
  }

  // Check if asking about interview location / address
  if (
    text.includes("địa chỉ") ||
    text.includes("ở đâu") ||
    text.includes("địa điểm phỏng vấn") ||
    text.includes("kho nào")
  ) {
    return (
      `📍 Địa điểm Phỏng vấn & Làm việc chính của AGARI:\n` +
      `• TP.HCM - Quận Bình Tân: 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân.\n` +
      `• TP.HCM - Quận Tân Phú: 549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân (cùng 19 Hub SPX khắp các quận/huyện TP.HCM).\n` +
      `• Vĩnh Long: SW SOC - KCN Bình Minh, Thị xã Bình Minh, Vĩnh Long.\n` +
      `• Cần Thơ: 78-CTO Co Do 02 Hub - Ấp Tân Lợi 1, Xã Thuận Hưng, Huyện Thốt Nốt, Cần Thơ.\n` +
      `• Đồng Tháp: Các Hub Cao Lãnh, Lấp Vò, Sa Đéc, Tân Bình, Tân Thành.\n\n` +
      `Bạn muốn đăng ký làm tại Kho/Hub nào, hãy nhắn tên Quận/Khu vực để HR gửi lịch phỏng vấn nhé!`
    );
  }

  // Check if asking about documents / CCCD
  if (
    text.includes("giấy tờ") ||
    text.includes("hồ sơ cần") ||
    text.includes("cccd") ||
    text.includes("mang theo gì")
  ) {
    return (
      `🪪 Hồ sơ khi đi phỏng vấn & nhận việc rất đơn giản:\n` +
      `• Chỉ cần mang theo CCCD gắn chip bản gốc (và điện thoại có cài VNeID Mức 2).\n` +
      `• Trang phục lịch sự, mang giày hoặc dép có quai hậu khi vào kho.\n` +
      `• Các giấy tờ bổ sung sẽ được bộ phận Nhân sự AGARI hướng dẫn sau khi trúng tuyển!`
    );
  }

  // First message greeting if none of the specific keywords matched
  if (params.isFirstCandidateMessage) {
    return (
      `Xin chào ${params.candidateName}! 👋 Bộ phận Tuyển dụng AGARI đã nhận được tin nhắn của bạn.\n` +
      `Trong lúc chờ HR phản hồi trực tiếp, bạn có thể bấm các nút câu hỏi nhanh bên dưới (Lương, Ca làm, Địa điểm, Kiểm tra hồ sơ) hoặc để lại khu vực muốn ứng tuyển nhé!`
    );
  }

  return null;
}
