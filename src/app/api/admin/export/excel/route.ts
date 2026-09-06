import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getApplicationsFromSheet } from "@/lib/google-sheets";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    let data = await getApplicationsFromSheet();
    if (status && status !== "ALL") {
      data = data.filter((application) => application.status === status);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Applications");

    sheet.columns = [
      { header: "Mã hồ sơ", key: "id", width: 20 },
      { header: "Họ tên", key: "name", width: 30 },
      { header: "Ngày sinh", key: "dob", width: 15 },
      { header: "CCCD", key: "cccd", width: 20 },
      { header: "Số điện thoại", key: "phone", width: 20 },
      { header: "Giới tính", key: "gender", width: 10 },
      { header: "Địa chỉ", key: "address", width: 40 },
      { header: "Học vấn", key: "education", width: 15 },
      { header: "Ca làm", key: "shift", width: 20 },
      { header: "Ngày nhận việc", key: "startDate", width: 15 },
      { header: "Ngày ứng tuyển", key: "appliedAt", width: 20 },
      { header: "Trạng thái", key: "status", width: 20 },
      { header: "Ngày trúng tuyển", key: "hiredAt", width: 15 },
      { header: "Ngày hết hạn", key: "expiredAt", width: 15 },
      { header: "Ghi chú", key: "note", width: 30 },
    ];

    // Format header row
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    data.forEach((app) => {
      sheet.addRow({
        id: app.applicationId,
        name: app.fullName,
        dob: app.dateOfBirth,
        cccd: `'${app.cccd}`, // Prevent scientific notation for large numbers
        phone: `'${app.phone}`, // Prevent leading zero loss
        gender: app.gender,
        address: app.permanentAddress,
        education: app.education,
        shift: app.preferredShift,
        startDate: app.availableStartDate,
        appliedAt: app.appliedAt || "",
        status: app.status,
        hiredAt: app.hiredAt || "",
        expiredAt: app.expiredAt || "",
        note: app.adminNote || app.note || "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="AGARI_Applications_${new Date().toISOString().split("T")[0]}.xlsx"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
