import { google } from "googleapis";
import { Application } from "@/lib/firebase/models";

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
  const spreadsheetId = (process.env.GOOGLE_SHEETS_ID ?? "")
    .trim()
    .replace(/^GOOGLE_SHEETS_ID=/i, "")
    .replace(/^"|"$/g, "");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
      private_key: getPrivateKey(),
    },
    scopes: SCOPES,
  });
}

export async function addRowToSheet(
  application: Application,
): Promise<number | null> {
  if (!process.env.GOOGLE_SHEETS_ID) return null;

  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const range = "Applications!A:Q"; // Adjust based on your sheet name

  // Row format based on requirements
  const row = [
    application.applicationId,
    application.fullName,
    application.dateOfBirth,
    application.cccd,
    application.phone,
    application.gender,
    application.permanentAddress,
    application.education,
    application.preferredShift,
    application.availableStartDate,
    application.appliedAt
      ? new Date(application.appliedAt._seconds * 1000).toLocaleString("vi-VN")
      : "",
    application.status,
    application.hiredAt
      ? new Date(application.hiredAt._seconds * 1000).toLocaleDateString(
          "vi-VN",
        )
      : "",
    application.expiredAt
      ? new Date(application.expiredAt._seconds * 1000).toLocaleDateString(
          "vi-VN",
        )
      : "",
    application.note || "",
    new Date().toLocaleString("vi-VN"),
    "SUCCESS", // Sync Status
  ];

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    // Attempt to extract row number
    const updatedRange = response.data.updates?.updatedRange; // e.g., 'Applications!A10:Q10'
    let rowNumber = null;
    if (updatedRange) {
      const match = updatedRange.match(/[A-Z]+(\d+)/);
      if (match && match[1]) {
        rowNumber = parseInt(match[1], 10);
      }
    }

    return rowNumber;
  } catch (error) {
    console.error("Google Sheets append error:", error);
    throw error;
  }
}

// Function to update an existing row - required for idempotency/retry and admin updates
export async function updateRowInSheet(
  application: Application,
  rowNumber: number,
) {
  if (!process.env.GOOGLE_SHEETS_ID || !rowNumber) return;

  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const range = `Applications!A${rowNumber}:Q${rowNumber}`;

  const row = [
    application.applicationId,
    application.fullName,
    application.dateOfBirth,
    application.cccd,
    application.phone,
    application.gender,
    application.permanentAddress,
    application.education,
    application.preferredShift,
    application.availableStartDate,
    application.appliedAt
      ? new Date(application.appliedAt._seconds * 1000).toLocaleString("vi-VN")
      : "",
    application.status,
    application.hiredAt
      ? new Date(application.hiredAt._seconds * 1000).toLocaleDateString(
          "vi-VN",
        )
      : "",
    application.expiredAt
      ? new Date(application.expiredAt._seconds * 1000).toLocaleDateString(
          "vi-VN",
        )
      : "",
    application.note || "",
    new Date().toLocaleString("vi-VN"),
    "SUCCESS",
  ];

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    console.error("Google Sheets update error:", error);
    throw error;
  }
}
