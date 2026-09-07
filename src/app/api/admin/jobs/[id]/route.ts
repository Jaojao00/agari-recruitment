import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

type JobRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: JobRouteContext) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const job = {
      ...(typeof body.title === "string" ? { title: body.title.trim() } : {}),
      ...(typeof body.company === "string"
        ? { company: body.company.trim() }
        : {}),
      ...(typeof body.location === "string"
        ? { location: body.location.trim() }
        : {}),
      ...(typeof body.salary === "string"
        ? { salary: body.salary.trim() }
        : {}),
      ...(typeof body.schedule === "string"
        ? { schedule: body.schedule.trim() }
        : {}),
      ...(typeof body.description === "string"
        ? { description: body.description.trim() }
        : {}),
      ...(typeof body.requirements === "string"
        ? { requirements: body.requirements.trim() }
        : {}),
      ...(typeof body.benefits === "string"
        ? { benefits: body.benefits.trim() }
        : {}),
      ...(typeof body.imageUrl === "string"
        ? { imageUrl: body.imageUrl.trim() }
        : {}),
      ...(typeof body.applicationUrl === "string"
        ? { applicationUrl: body.applicationUrl.trim() }
        : {}),
      ...(typeof body.isPublished === "boolean"
        ? { isPublished: body.isPublished }
        : {}),
      updatedAt: new Date(),
    };
    await adminDb.collection("jobs").doc(id).update(job);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin PATCH job error:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật tin tuyển dụng." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: JobRouteContext) {
  try {
    const { id } = await params;
    await adminDb.collection("jobs").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE job error:", error);
    return NextResponse.json(
      { error: "Không thể xoá tin tuyển dụng." },
      { status: 500 },
    );
  }
}
