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

type SheetApplicationFields = {
  applicationId?: string;
  jobId?: string;
  jobTitle?: string;
  workSchedule?: string;
  fullName?: string;
  dateOfBirth?: string;
  cccd?: string;
  phone?: string;
  gender?: string;
  preferredLocation?: string;
  permanentAddress?: string;
  education?: string;
  preferredShift?: string;
  availableStartDate?: string;
  appliedAt?: unknown;
  createdAt?: unknown;
  status?: string;
  hiredAt?: unknown;
  expiredAt?: unknown;
  note?: string;
  adminNote?: string;
  updatedAt?: unknown;
  googleSheetRow?: number;
  googleSheetName?: string;
  googleSheetSyncStatus?: string;
};

type SheetApplication = SheetApplicationFields & {
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

function getDefaultSheetName() {
  return (process.env.GOOGLE_SHEETS_TAB ?? "Trang tính1")
    .trim()
    .replace(/^"|"$/g, "");
}

let sheetInfoCache: { gid: number; title: string }[] | null = null;

async function getSheetTitles() {
  if (sheetInfoCache) return sheetInfoCache;
  const response = await getSheetsClient().spreadsheets.get({
    spreadsheetId: getSpreadsheetId(),
  });
  sheetInfoCache =
    response.data.sheets?.map((s) => ({
      gid: s.properties?.sheetId || 0,
      title: s.properties?.title || "",
    })) || [];
  return sheetInfoCache;
}

async function getJobSheetName(jobId?: string): Promise<string> {
  const defaultSheetName = getDefaultSheetName();

  if (jobId === "agari-part-time") {
    const titles = await getSheetTitles();
    const sheet = titles.find((s) => s.gid === 902668352);
    if (sheet) return sheet.title;
  }

  if (jobId === "spx-fulltime") {
    const titles = await getSheetTitles();
    const sheet = titles.find((s) => s.gid === 1291225589);
    if (sheet) return sheet.title;
  }

  return defaultSheetName;
}

function formatSheetDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value ?? "");
}

function applicationToRow(application: SheetApplicationFields) {
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
    application.jobId || "warehouse-rotating-shift",
    application.jobTitle || "Nhân viên kho - Ca xoay",
    application.workSchedule || "",
  ];
}

async function getNextApplicationRow(sheetName: string) {
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!A1:A`,
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

function rowToApplication(
  row: string[],
  rowNumber: number,
  sheetName: string,
): SheetApplication {
  return {
    id: `${sheetName}_${rowNumber}`,
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
    googleSheetName: sheetName,
    googleSheetSyncStatus: row[18] || "SUCCESS",
    jobId: row[19] || "warehouse-rotating-shift",
    jobTitle: row[20] || "Nhân viên kho - Ca xoay",
    workSchedule: row[21] || "",
  };
}

export async function getApplicationsFromSheet(): Promise<SheetApplication[]> {
  const defaultSheetName = getDefaultSheetName();
  const titles = await getSheetTitles();

  const targetSheetNames = new Set<string>([defaultSheetName]);

  const ptSheet = titles.find((s) => s.gid === 902668352);
  if (ptSheet) targetSheetNames.add(ptSheet.title);

  const ftSheet = titles.find((s) => s.gid === 1291225589);
  if (ftSheet) targetSheetNames.add(ftSheet.title);

  let allApplications: SheetApplication[] = [];

  for (const sheetTitle of targetSheetNames) {
    const response = await getSheetsClient().spreadsheets.values.get({
      spreadsheetId: getSpreadsheetId(),
      range: `'${sheetTitle}'!A1:V`,
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

    const sheetApps = dataRows
      .map((row, index) =>
        rowToApplication(row, index + firstDataRowNumber, sheetTitle),
      )
      .filter((application) =>
        /^AG-\d{4}-\d{6}$/i.test(application.applicationId),
      );

    allApplications = allApplications.concat(sheetApps);
  }

  return allApplications;
}

export async function addApplicationToSheet(
  application: SheetApplicationFields,
) {
  const sheetName = await getJobSheetName(application.jobId);
  const rowNumber = await getNextApplicationRow(sheetName);
  
  await getSheetsClient().spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!A${rowNumber}:V${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [applicationToRow(application)] },
  });

  const verification = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!A${rowNumber}`,
  });
  const savedApplicationId = String(verification.data.values?.[0]?.[0] ?? "");
  if (savedApplicationId !== String(application.applicationId)) {
    throw new Error("Google Sheets không xác nhận được hồ sơ vừa ghi");
  }

  return rowNumber;
}

export async function updateApplicationInSheet(
  application: SheetApplicationFields,
) {
  const sheetName = application.googleSheetName || await getJobSheetName(application.jobId);
  const rowNumber = application.googleSheetRow;
  
  if (!rowNumber) {
    throw new Error("Missing rowNumber for update");
  }
  
  await getSheetsClient().spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!A${rowNumber}:V${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [applicationToRow(application)] },
  });
}