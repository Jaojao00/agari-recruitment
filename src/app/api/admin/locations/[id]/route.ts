import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

type LocationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: LocationRouteContext,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await adminDb
      .collection("locations")
      .doc(id)
      .update({
        ...body,
        updatedAt: new Date(),
      });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Loi server" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: LocationRouteContext,
) {
  try {
    const { id } = await params;
    await adminDb.collection("locations").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Loi server" }, { status: 500 });
  }
}
