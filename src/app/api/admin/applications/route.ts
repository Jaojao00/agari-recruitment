import { NextResponse } from "next/server";
import { getApplicationsFromSheet } from "@/lib/google-sheets";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const jobId = searchParams.get("jobId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    let results = await getApplicationsFromSheet();

    if (jobId) {
      results = results.filter((app) => app.jobId === jobId);
    }

    if (status && status !== "ALL") {
      results = results.filter((app) => app.status === status);
    }

    results.sort((a, b) => {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
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
