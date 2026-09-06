import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function PATCH(request: Request, { params }: any) {
  try {
    const id = params.id;
    const body = await request.json();
    await adminDb.collection('locations').doc(id).update({
      ...body,
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Loi server' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: any) {
  try {
    const id = params.id;
    await adminDb.collection('locations').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Loi server' }, { status: 500 });
  }
}