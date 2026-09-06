import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/locations - Public: fetch all active locations
export async function GET() {
  try {
    const snapshot = await adminDb.collection('locations').get();

    const locations = snapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .filter((loc: any) => loc.isActive !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ locations });
  } catch (error: any) {
    console.error('GET locations error:', error);
    return NextResponse.json({ locations: [] }, { status: 200 });
  }
}