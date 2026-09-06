import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/locations - Public: fetch all active locations
export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('locations')
      .where('isActive', '==', true)
      .orderBy('order', 'asc')
      .get();

    const locations = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Fetch locations error:', error);
    return NextResponse.json({ error: 'Khong the tai danh sach khu vuc.' }, { status: 500 });
  }
}
