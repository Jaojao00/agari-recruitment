import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { addRowToSheet, updateRowInSheet } from '@/lib/google-sheets';
import { Application } from '@/lib/firebase/models';

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    // 1. Fetch PENDING or FAILED items from queue (limit 10 for batching)
    const queueRef = adminDb.collection('sync_queue');
    const snapshot = await queueRef
      .where('status', 'in', ['PENDING', 'FAILED'])
      .where('attempts', '<', MAX_ATTEMPTS)
      .limit(10)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, message: 'No items to process' });
    }

    const results = [];

    for (const doc of snapshot.docs) {
      const task = doc.data();
      const newAttempts = (task.attempts || 0) + 1;
      
      try {
        // Mark as processing
        await doc.ref.update({ status: 'PROCESSING', lastAttemptAt: new Date() });

        // Get application data
        const appDoc = await adminDb.collection('applications').doc(task.applicationId).get();
        if (!appDoc.exists) {
          throw new Error('Application not found');
        }
        
        const appData = appDoc.data() as Application;
        appData.id = appDoc.id; // Inject ID

        // Idempotency: If it has googleSheetRow, we UPDATE. Otherwise ADD.
        if (appData.googleSheetRow) {
          await updateRowInSheet(appData, appData.googleSheetRow);
          // Update application status
          await appDoc.ref.update({
            googleSheetSyncStatus: 'SUCCESS',
            googleSheetLastSyncAt: new Date(),
            googleSheetSyncError: adminDb.FieldValue.delete()
          });
        } else {
          const rowNumber = await addRowToSheet(appData);
          if (rowNumber) {
            await appDoc.ref.update({
              googleSheetSyncStatus: 'SUCCESS',
              googleSheetRow: rowNumber,
              googleSheetLastSyncAt: new Date(),
              googleSheetSyncError: adminDb.FieldValue.delete()
            });
          } else {
             // If addRowToSheet returns null, probably missing ENV
             throw new Error('Could not get row number or missing config');
          }
        }

        // Mark queue task as done
        await doc.ref.update({
          status: 'SUCCESS',
          attempts: newAttempts,
          processedAt: new Date()
        });

        results.push({ id: doc.id, status: 'SUCCESS' });

      } catch (err: any) {
        console.error(`Error processing queue item ${doc.id}:`, err);
        // Revert status to FAILED
        await doc.ref.update({
          status: 'FAILED',
          attempts: newAttempts,
          error: err.message || 'Unknown error'
        });
        
        // Also update application status
        await adminDb.collection('applications').doc(task.applicationId).update({
          googleSheetSyncStatus: 'FAILED',
          googleSheetSyncError: err.message || 'Unknown error',
          googleSheetLastSyncAt: new Date()
        });

        results.push({ id: doc.id, status: 'FAILED', error: err.message });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('Sync queue processor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
