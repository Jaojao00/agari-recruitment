import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getPrivateKey() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim()
    .replace(/^"|"$/g, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n");
  if (!privateKey) throw new Error("Missing GOOGLE_PRIVATE_KEY");
  return privateKey;
}

function getGoogleAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
      private_key: getPrivateKey(),
    },
    scopes: SCOPES,
  });
}

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function getSpreadsheetId() {
  const id = (process.env.GOOGLE_SHEETS_ID ?? "").trim().replace(/^"|"$/g, "").replace(/^GOOGLE_SHEETS_ID=/i, "");
  if (!id) throw new Error("Missing GOOGLE_SHEETS_ID");
  return id;
}

export type CandidateTracking = {
  rowNumber: number;
  stt: string;
  fullName: string;
  phone: string;
  opsCode: string;
  cvDate: string;
  screeningResult: string;
  interviewDate: string;
  interviewResult: string;
  offerDate: string;
  offerConfirmed: string;
  joinDate: string;
  team: string;
  status: string;
  note: string;
};

const TRACKING_SHEET_GID = 363771716;

async function getTrackingSheetName() {
  const response = await getSheetsClient().spreadsheets.get({
    spreadsheetId: getSpreadsheetId(),
  });
  const sheet = response.data.sheets?.find((s) => s.properties?.sheetId === TRACKING_SHEET_GID);
  return sheet?.properties?.title || "Theo dõi ứng viên";
}

export async function getTrackingsFromSheet(): Promise<CandidateTracking[]> {
  const sheetName = await getTrackingSheetName();
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!A1:Z`,
  });
  
  const rows = response.data.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => String(h).trim().toLowerCase());
  
  const getCol = (row: string[], name: string, fallback?: string) => {
    let idx = headers.indexOf(name.toLowerCase());
    if (idx < 0 && fallback) idx = headers.indexOf(fallback.toLowerCase());
    return idx >= 0 ? (row[idx] || "") : "";
  };

  const trackings: CandidateTracking[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const fullName = getCol(row, "Họ tên");
    const phone = getCol(row, "SĐT");
    if (!fullName && !phone) continue;

    trackings.push({
      rowNumber: i + 1,
      stt: getCol(row, "STT"),
      fullName: getCol(row, "Họ tên"),
      phone: getCol(row, "SĐT"),
      opsCode: getCol(row, "Mã Ops", "Nguồn"),
      cvDate: getCol(row, "Ngày nhận CV"),
      screeningResult: getCol(row, "Kết quả sàng lọc"),
      interviewDate: getCol(row, "Ngày PV"),
      interviewResult: getCol(row, "Kết quả PV"),
      offerDate: getCol(row, "Ngày gửi offer"),
      offerConfirmed: getCol(row, "Xác nhận nhận việc"),
      joinDate: getCol(row, "Ngày nhận việc"),
      team: getCol(row, "Ca/Team"),
      status: getCol(row, "Trạng thái"),
      note: getCol(row, "Ghi chú"),
    });
  }
  return trackings;
}

export async function addTrackingToSheet(data: Partial<CandidateTracking>) {
  const sheetName = await getTrackingSheetName();
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!A1:Z`,
  });
  const rows = response.data.values || [];
  let headers: string[] = [];
  
  if (rows.length === 0) {
    headers = ["STT", "Họ tên", "SĐT", "Mã Ops", "Ngày nhận CV", "Kết quả sàng lọc", "Ngày PV", "Kết quả PV", "Ngày gửi offer", "Xác nhận nhận việc", "Ngày nhận việc", "Ca/Team", "Trạng thái", "Ghi chú"];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${sheetName}'!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [headers] },
    });
  } else {
    headers = rows[0];
  }

  // Check if phone already exists
  const phoneIdx = headers.findIndex(h => String(h).trim().toLowerCase() === "sđt");
  if (phoneIdx >= 0 && data.phone) {
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][phoneIdx] === data.phone) {
        return; // Already tracked
      }
    }
  }

  const newRow: string[] = new Array(headers.length).fill("");
  const setCol = (name: string, fallback: string, value: string) => {
    let idx = headers.findIndex(h => String(h).trim().toLowerCase() === name.toLowerCase());
    if (idx < 0) idx = headers.findIndex(h => String(h).trim().toLowerCase() === fallback.toLowerCase());
    if (idx >= 0) newRow[idx] = value;
  };

  let nextStt = 1;
  for (let i = 1; i < rows.length; i++) {
    const stt = parseInt(rows[i][0] || "0");
    if (!isNaN(stt) && stt >= nextStt) nextStt = stt + 1;
  }

  setCol("STT", "STT", String(nextStt));
  setCol("Họ tên", "Họ tên", data.fullName || "");
  setCol("SĐT", "SĐT", data.phone || "");
  setCol("Mã Ops", "Nguồn", data.opsCode || "");
  setCol("Ngày nhận CV", "Ngày nhận CV", data.cvDate || "");
  setCol("Kết quả sàng lọc", "Kết quả sàng lọc", data.screeningResult || "");
  setCol("Ngày PV", "Ngày PV", data.interviewDate || "");
  setCol("Kết quả PV", "Kết quả PV", data.interviewResult || "");
  setCol("Ngày gửi offer", "Ngày gửi offer", data.offerDate || "");
  setCol("Xác nhận nhận việc", "Xác nhận nhận việc", data.offerConfirmed || "");
  setCol("Ngày nhận việc", "Ngày nhận việc", data.joinDate || "");
  setCol("Ca/Team", "Ca/Team", data.team || "");
  setCol("Trạng thái", "Trạng thái", data.status || "");
  setCol("Ghi chú", "Ghi chú", data.note || "");

  
  // Find first empty row to update instead of appending at the very bottom (which might skip formatted blank rows)
  let targetRowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    // If row has no Ho ten or SDT (ignoring STT, as templates often pre-fill it), consider it empty
    if (!r[1] && !r[2]) {
      targetRowIndex = i + 1;
      break;
    }
  }

  if (targetRowIndex !== -1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${sheetName}'!A${targetRowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [newRow] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetName}'!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [newRow] },
    });
  }

}

export async function updateTrackingInSheet(rowNumber: number, data: Partial<CandidateTracking>) {
  const sheetName = await getTrackingSheetName();
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!A1:Z1`,
  });
  
  const headers = response.data.values?.[0] || [];
  const currentRowResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!A${rowNumber}:Z${rowNumber}`,
  });
  const currentRow = currentRowResponse.data.values?.[0] || new Array(headers.length).fill("");

  const newRow = [...currentRow];
  while (newRow.length < headers.length) newRow.push("");

  const setCol = (name: string, fallback: string, value: string | undefined) => {
    if (value === undefined) return;
    let idx = headers.findIndex(h => String(h).trim().toLowerCase() === name.toLowerCase());
    if (idx < 0) idx = headers.findIndex(h => String(h).trim().toLowerCase() === fallback.toLowerCase());
    if (idx >= 0) newRow[idx] = value;
  };

  setCol("Họ tên", "Họ tên", data.fullName);
  setCol("SĐT", "SĐT", data.phone);
  setCol("Mã Ops", "Nguồn", data.opsCode);
  setCol("Ngày nhận CV", "Ngày nhận CV", data.cvDate);
  setCol("Kết quả sàng lọc", "Kết quả sàng lọc", data.screeningResult);
  setCol("Ngày PV", "Ngày PV", data.interviewDate);
  setCol("Kết quả PV", "Kết quả PV", data.interviewResult);
  setCol("Ngày gửi offer", "Ngày gửi offer", data.offerDate);
  setCol("Xác nhận nhận việc", "Xác nhận nhận việc", data.offerConfirmed);
  setCol("Ngày nhận việc", "Ngày nhận việc", data.joinDate);
  setCol("Ca/Team", "Ca/Team", data.team);
  setCol("Trạng thái", "Trạng thái", data.status);
  setCol("Ghi chú", "Ghi chú", data.note);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${sheetName}'!A${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newRow] },
  });
}

export async function deleteTrackingInSheet(rowNumber: number) {
  const sheetName = await getTrackingSheetName();
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  // We can just clear the row to be safe and avoid shifting issues
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `'${sheetName}'!A${rowNumber}:Z${rowNumber}`,
  });
}
