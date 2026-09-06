import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: Request, { params }: any) {
  try {
    const doc = await adminDb.collection('applications').doc(params.id).get();
    if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: any) {
  try {
    const body = await request.json();
    const { status, hiredAt, expiredAt, adminNote, adminId, adminName } = body;
    
    const docRef = adminDb.collection('applications').doc(params.id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const oldData = doc.data();
    const updateData: any = { updatedAt: new Date() };
    
    if (status) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    
    // Parse dates if provided
    if (hiredAt) updateData.hiredAt = new Date(hiredAt);
    if (expiredAt) updateData.expiredAt = new Date(expiredAt);

    await docRef.update(updateData);

    // Audit log
    if (status && oldData?.status !== status) {
      await adminDb.collection('application_logs').add({
        applicationId: params.id,
        action: 'STATUS_CHANGE',
        oldStatus: oldData?.status,
        newStatus: status,
        adminId: adminId || 'unknown',
        adminName: adminName || 'Admin',
        createdAt: new Date(),
      });
    }

    // Push to sync queue if it was successfully synced before or if we need to sync updates
    if (oldData?.googleSheetSyncStatus === 'SUCCESS') {
      await adminDb.collection('sync_queue').add({
        applicationId: params.id,
        type: 'UPDATE_GOOGLE_SHEET_ROW',
        status: 'PENDING',
        attempts: 0,
        createdAt: new Date(),
      });
      // Optionally trigger sync immediately
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';
      fetch(`${baseUrl}/api/sync/process`, { method: 'POST' }).catch(e => console.error(e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update app error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
