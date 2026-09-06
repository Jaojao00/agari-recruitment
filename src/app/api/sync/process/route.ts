import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { addRowToSheet, updateRowInSheet } from "@/lib/google-sheets";
import { Application } from "@/lib/firebase/models";

const MAX_ATTEMPTS = 5;

export async function POST() {
  try {
    // 1. Fetch a small queue batch without requiring a composite Firestore index.
    const queueRef = adminDb.collection("sync_queue");
    const allTasks = await queueRef.get();
    const pendingTasks = allTasks.docs
      .filter((doc) => {
        const task = doc.data();
        return (
          ["PENDING", "FAILED"].includes(task.status) &&
          (task.attempts || 0) < MAX_ATTEMPTS
        );
      })
      .slice(0, 10);

    if (pendingTasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items to process",
      });
    }

    const results = [];

    for (const doc of pendingTasks) {
      const task = doc.data();
      const newAttempts = (task.attempts || 0) + 1;

      try {
        // Mark as processing
        await doc.ref.update({
          status: "PROCESSING",
          lastAttemptAt: new Date(),
        });

        // Get application data
        const appDoc = await adminDb
          .collection("applications")
          .doc(task.applicationId)
          .get();
        if (!appDoc.exists) {
          throw new Error("Application not found");
        }

        const appData = appDoc.data() as Application;
        appData.id = appDoc.id; // Inject ID

        // Idempotency: If it has googleSheetRow, we UPDATE. Otherwise ADD.
        if (appData.googleSheetRow) {
          await updateRowInSheet(appData, appData.googleSheetRow);
          // Update application status
          await appDoc.ref.update({
            googleSheetSyncStatus: "SUCCESS",
            googleSheetLastSyncAt: new Date(),
            googleSheetSyncError: FieldValue.delete(),
          });
        } else {
          const rowNumber = await addRowToSheet(appData);
          if (rowNumber) {
            await appDoc.ref.update({
              googleSheetSyncStatus: "SUCCESS",
              googleSheetRow: rowNumber,
              googleSheetLastSyncAt: new Date(),
              googleSheetSyncError: FieldValue.delete(),
            });
          } else {
            // If addRowToSheet returns null, probably missing ENV
            throw new Error("Could not get row number or missing config");
          }
        }

        // Mark queue task as done
        await doc.ref.update({
          status: "SUCCESS",
          attempts: newAttempts,
          processedAt: new Date(),
        });

        results.push({ id: doc.id, status: "SUCCESS" });
      } catch (err: unknown) {
        console.error(`Error processing queue item ${doc.id}:`, err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        // Revert status to FAILED
        await doc.ref.update({
          status: "FAILED",
          attempts: newAttempts,
          error: errorMessage,
        });

        // Also update application status
        await adminDb
          .collection("applications")
          .doc(task.applicationId)
          .update({
            googleSheetSyncStatus: "FAILED",
            googleSheetSyncError: errorMessage,
            googleSheetLastSyncAt: new Date(),
          });

        results.push({ id: doc.id, status: "FAILED", error: errorMessage });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error("Sync queue processor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
