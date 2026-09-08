import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

if (getApps().length) {
  adminApp = getApps()[0];
} else {
  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL?.trim() ||
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = (
    process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY
  )
    ?.trim()
    .replace(/^"|"$/g, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Thiếu cấu hình Firebase Admin. Cần NEXT_PUBLIC_FIREBASE_PROJECT_ID cùng FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY hoặc GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_PRIVATE_KEY.",
    );
  }

  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
