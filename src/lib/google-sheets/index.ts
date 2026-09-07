import { google } from "googleapis";

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

function getGoogleAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
      private_key: getPrivateKey(),
    },
    scopes: SCOPES,
  });
}

type SheetApplication = Record<string, any> & {
  id: string;
  applicationId: string;
  status: string;
};

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function getSpreadsheetId() {
  const spreadsheetId = (process.env.GOOGLE_SHEETS_ID ?? "")
    .trim()
    .replace(/^GOOGLE_SHEETS_ID=/i, "")
    .replace(/^"|"$/g, "");
  if (!spreadsheetId)
    throw new Error("Missing GOOGLE_SHEETS_ID environment variable");
  return spreadsheetId;
}

function getSheetName() {
  return (process.env.GOOGLE_SHEETS_TAB ?? "Trang tính1")
    .trim()
    .replace(/^"|"$/g, "");
}

function formatSheetDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value ?? "");
}

function applicationToRow(application: Record<string, any>) {
  return [
    application.applicationId,
    application.fullName,
    application.dateOfBirth,
    application.cccd,
    application.phone,
    application.gender,
    application.preferredLocation,
    application.permanentAddress || "",
    application.education,
    application.preferredShift,
    application.availableStartDate,
    formatSheetDate(application.appliedAt || new Date()),
    application.status || "NEW",
    formatSheetDate(application.hiredAt),
    formatSheetDate(application.expiredAt),
    application.note || "",
    application.adminNote || "",
    formatSheetDate(application.updatedAt || new Date()),
    "SUCCESS",
  ];
}

async function getNextApplicationRow() {
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${getSheetName()}'!A1:A`,
  });
  const rows = response.data.values || [];
  let lastApplicationRow = 0;

  rows.forEach((row, index) => {
    if (/^AG-\d{4}-\d{6}$/i.test(String(row[0] ?? "").trim())) {
      lastApplicationRow = index + 1;
    }
  });

  if (lastApplicationRow > 0) return lastApplicationRow + 1;

  const firstHeaderRow = rows.findIndex((row) =>
    /mã hồ sơ|application\s*id/i.test(String(row[0] ?? "").trim()),
  );
  return firstHeaderRow >= 0 ? firstHeaderRow + 2 : 1;
}

function rowToApplication(row: string[], rowNumber: number): SheetApplication {
  return {
    id: String(rowNumber),
    applicationId: row[0] || `SHEET-${rowNumber}`,
    fullName: row[1] || "",
    dateOfBirth: row[2] || "",
    cccd: row[3] || "",
    phone: row[4] || "",
    gender: row[5] || "",
    preferredLocation: row[6] || "",
    permanentAddress: row[7] || "",
    education: row[8] || "",
    preferredShift: row[9] || "",
    availableStartDate: row[10] || "",
    appliedAt: row[11] || "",
    createdAt: row[11] || "",
    status: row[12] || "NEW",
    hiredAt: row[13] || "",
    expiredAt: row[14] || "",
    note: row[15] || "",
    adminNote: row[16] || "",
    updatedAt: row[17] || "",
    googleSheetRow: rowNumber,
    googleSheetSyncStatus: row[18] || "SUCCESS",
  };
}

export async function getApplicationsFromSheet(): Promise<SheetApplication[]> {
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${getSheetName()}'!A1:R`,
  });
  const rows = response.data.values || [];
  const firstCell = String(rows[0]?.[0] ?? "")
    .trim()
    .toLowerCase();
  const hasHeader =
    firstCell === "mã hồ sơ" ||
    firstCell === "applicationid" ||
    firstCell === "application id";
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const firstDataRowNumber = hasHeader ? 2 : 1;

  return dataRows
    .map((row, index) => rowToApplication(row, index + firstDataRowNumber))
    .filter((application) =>
      /^AG-\d{4}-\d{6}$/i.test(application.applicationId),
    );
}

export async function addApplicationToSheet(application: Record<string, any>) {
  const rowNumber = await getNextApplicationRow();
  await getSheetsClient().spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `'${getSheetName()}'!A${rowNumber}:R${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [applicationToRow(application)] },
  });

  const verification = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${getSheetName()}'!A${rowNumber}`,
  });
  const savedApplicationId = String(verification.data.values?.[0]?.[0] ?? "");
  if (savedApplicationId !== String(application.applicationId)) {
    throw new Error("Google Sheets không xác nhận được hồ sơ vừa ghi");
  }

  return rowNumber;
}

export async function updateApplicationInSheet(
  rowNumber: number,
  application: Record<string, any>,
) {
  await getSheetsClient().spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `'${getSheetName()}'!A${rowNumber}:R${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [applicationToRow(application)] },
  });
}
