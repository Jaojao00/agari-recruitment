import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

const defaultLocations = [
  {
    id: "default-sw-soc-binh-minh",
    name: "SW SOC - KCN BÌNH MINH VĨNH LONG",
    address: "KCN Bình Minh, Vĩnh Long",
    isActive: true,
    order: 1,
  },
  {
    id: "default-flm-binh-tan",
    name: "FLM - BÌNH TÂN, TP HCM",
    address: "Bình Tân, TP HCM",
    isActive: true,
    order: 2,
  },
];

interface LocationRecord {
  id: string;
  name?: string;
  address?: string;
  isActive?: boolean;
  order?: number;
}

// GET /api/locations - Public: fetch all active locations
export async function GET() {
  try {
    const snapshot = await adminDb.collection("locations").get();

    const locations = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as LocationRecord)
      .filter((loc) => loc.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ locations });
  } catch (error: unknown) {
    console.error("GET locations error:", error);
    return NextResponse.json({ locations: defaultLocations }, { status: 200 });
  }
}
