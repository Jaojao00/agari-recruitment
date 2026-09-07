import { NextResponse } from "next/server";

// GET - Admin: fetch all locations
export async function GET() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const snapshot = await adminDb.collection("locations").get();

    const locations = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as { order?: unknown }),
      }))
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    return NextResponse.json({ locations });
  } catch (error: unknown) {
    console.error(
      "Admin GET locations error:",
      error instanceof Error ? error.message : error,
    );
    // Return empty list instead of 500 so UI doesn't crash
    return NextResponse.json({ locations: [] });
  }
}

// POST - Admin: create new location
export async function POST(request: Request) {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const body = await request.json();
    const { name, address, mapUrl } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: "Ten va dia chi la bat buoc." },
        { status: 400 },
      );
    }

    const snapshot = await adminDb.collection("locations").get();
    const maxOrder = snapshot.docs.reduce((max: number, doc) => {
      return Math.max(max, Number(doc.data().order || 0));
    }, 0);

    const docRef = adminDb.collection("locations").doc();
    await docRef.set({
      name,
      address,
      mapUrl: mapUrl || "",
      isActive: true,
      order: maxOrder + 1,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Loi server";
    console.error("Admin POST locations error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
