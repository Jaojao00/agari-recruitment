import { NextResponse } from "next/server";

type ApplicationRecord = {
  id: string;
  status?: string;
  createdAt?: { _seconds?: number; seconds?: number };
  fullName?: string;
  applicationId?: string;
  cccd?: string;
  phone?: string;
  [key: string]: unknown;
};

export async function GET(request: Request) {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    // Read without orderBy/where so this endpoint does not depend on a Firestore index.
    let snapshot = await adminDb.collection("applications").get();
    let results: ApplicationRecord[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ApplicationRecord,
    );

    // Older records in this project were stored under registrations.
    if (results.length === 0) {
      snapshot = await adminDb.collection("registrations").get();
      results = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as ApplicationRecord,
      );
    }

    if (status && status !== "ALL") {
      results = results.filter((app) => app.status === status);
    }

    results.sort((a, b) => {
      const first = a.createdAt?._seconds || a.createdAt?.seconds || 0;
      const second = b.createdAt?._seconds || b.createdAt?.seconds || 0;
      return second - first;
    });

    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(
        (app) =>
          (app.fullName && app.fullName.toLowerCase().includes(lowerSearch)) ||
          (app.applicationId &&
            app.applicationId.toLowerCase().includes(lowerSearch)) ||
          (app.cccd && app.cccd.includes(search)) ||
          (app.phone && app.phone.includes(search)),
      );
    }

    const total = results.length;
    const paginatedResults = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginatedResults,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
