import { NextResponse } from "next/server";
import type { Transaction } from "firebase-admin/firestore";
import { applicationSchema } from "@/lib/validation/application";

export async function POST(request: Request) {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const body = await request.json();

    // 1. Backend validate
    const validatedData = applicationSchema.parse(body);

    // 2. Check duplicate CCCD or Phone
    const applicationsRef = adminDb.collection("applications");

    // Checking CCCD
    const cccdQuery = await applicationsRef
      .where("cccd", "==", validatedData.cccd)
      .get();
    if (!cccdQuery.empty) {
      const existingApp = cccdQuery.docs[0].data();
      return NextResponse.json(
        {
          error: `Hồ sơ của bạn đã tồn tại với mã ${existingApp.applicationId}.`,
        },
        { status: 400 },
      );
    }

    // Checking Phone
    const phoneQuery = await applicationsRef
      .where("phone", "==", validatedData.phone)
      .get();
    if (!phoneQuery.empty) {
      const existingApp = phoneQuery.docs[0].data();
      return NextResponse.json(
        {
          error: `Số điện thoại của bạn đã được đăng ký với mã ${existingApp.applicationId}.`,
        },
        { status: 400 },
      );
    }

    // 3. Generate applicationId
    // Read a counter document
    const counterRef = adminDb.collection("settings").doc("counters");

    const newAppId = await adminDb.runTransaction(
      async (transaction: Transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let currentCount = 0;
        if (counterDoc.exists) {
          currentCount = counterDoc.data()?.applicationCount || 0;
        }

        const newCount = currentCount + 1;
        transaction.set(
          counterRef,
          { applicationCount: newCount },
          { merge: true },
        );

        const year = new Date().getFullYear();
        return `AG-${year}-${String(newCount).padStart(6, "0")}`;
      },
    );

    // 4. Save to Firestore
    const now = new Date();

    const applicationData = {
      ...validatedData,
      applicationId: newAppId,
      status: "NEW",
      appliedAt: now,
      createdAt: now,
      updatedAt: now,
      googleSheetSyncStatus: "PENDING",
    };

    const docRef = applicationsRef.doc();
    await docRef.set(applicationData);

    // 5. Create Sync Queue record
    const syncQueueRef = adminDb.collection("sync_queue").doc();
    await syncQueueRef.set({
      applicationId: docRef.id, // Firestore document ID
      applicationCode: newAppId,
      type: "CREATE_GOOGLE_SHEET_ROW",
      status: "PENDING",
      attempts: 0,
      createdAt: now,
    });

    // 6. Trigger sync asynchronously (fire and forget)
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";
    fetch(`${baseUrl}/api/sync/process`, { method: "POST" }).catch((e) =>
      console.error("Background sync failed to start:", e),
    );

    return NextResponse.json(
      { success: true, applicationId: newAppId },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Submit application error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra trong hệ thống. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
