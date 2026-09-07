import { NextResponse } from "next/server";

const DEFAULT_JOB_IMAGE = "/job-default.svg";

function normalizeJob(body: Record<string, unknown>) {
  const text = (key: string) =>
    typeof body[key] === "string" ? body[key].trim() : "";

  return {
    title: text("title"),
    company: text("company"),
    location: text("location"),
    salary: text("salary"),
    schedule: text("schedule"),
    description: text("description"),
    requirements: text("requirements"),
    benefits: text("benefits"),
    imageUrl: text("imageUrl") || DEFAULT_JOB_IMAGE,
    applicationUrl: text("applicationUrl") || "/ung-tuyen",
    isPublished: body.isPublished !== false,
  };
}

export async function GET() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const snapshot = await adminDb.collection("jobs").get();
    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Admin GET jobs error:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách tin." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const body = (await request.json()) as Record<string, unknown>;
    const job = normalizeJob(body);
    if (!job.title || !job.location || !job.description) {
      return NextResponse.json(
        { error: "Vui lòng nhập tiêu đề, địa điểm và mô tả công việc." },
        { status: 400 },
      );
    }

    const now = new Date();
    const reference = await adminDb.collection("jobs").add({
      ...job,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: reference.id, ...job }, { status: 201 });
  } catch (error) {
    console.error("Admin POST jobs error:", error);
    return NextResponse.json(
      { error: "Không thể tạo tin tuyển dụng." },
      { status: 500 },
    );
  }
}
