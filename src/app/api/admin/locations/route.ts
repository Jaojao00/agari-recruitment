import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// GET - Admin: fetch all locations
export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('locations')
      .orderBy('order', 'asc')
      .get();

    const locations = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    return NextResponse.json({ error: 'Loi server' }, { status: 500 });
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

    // Get current max order
    const snapshot = await adminDb.collection('locations').orderBy('order', 'desc').limit(1).get();
    const maxOrder = snapshot.empty ? 0 : (snapshot.docs[0].data().order || 0);

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
  } catch (error) {
    return NextResponse.json({ error: 'Loi server' }, { status: 500 });
  }
}
