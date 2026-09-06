import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// GET - Admin: fetch all locations
export async function GET() {
  try {
    // Use simple get() without orderBy to avoid index issues on empty collection
    const snapshot = await adminDb.collection('locations').get();

    const locations = snapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ locations });
  } catch (error: any) {
    console.error('Admin GET locations error:', error);
    return NextResponse.json({ locations: [], error: error.message }, { status: 200 });
  }
}

// POST - Admin: create new location
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, mapUrl } = body;

    if (!name || !address) {
      return NextResponse.json({ error: 'Ten va dia chi la bat buoc.' }, { status: 400 });
    }

    // Get current count for ordering
    const snapshot = await adminDb.collection('locations').get();
    const maxOrder = snapshot.docs.reduce((max: number, doc: any) => {
      return Math.max(max, doc.data().order || 0);
    }, 0);

    const docRef = adminDb.collection('locations').doc();
    await docRef.set({
      name,
      address,
      mapUrl: mapUrl || '',
      isActive: true,
      order: maxOrder + 1,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error: any) {
    console.error('Admin POST locations error:', error);
    return NextResponse.json({ error: error.message || 'Loi server' }, { status: 500 });
  }
}