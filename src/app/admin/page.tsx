import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, FileX, Calendar } from "lucide-react";
import { getApplicationsFromSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

// Server Component
export default async function AdminDashboard() {
  const applications = await getApplicationsFromSheet();

  const total = applications.length;
  const newApps = applications.filter((a: any) => a.status === "NEW").length;
  const contacted = applications.filter(
    (a: any) => a.status === "CONTACTED",
  ).length;
  const interviewed = applications.filter(
    (a: any) => a.status === "INTERVIEWED",
  ).length;
  const passed = applications.filter((a: any) => a.status === "PASSED").length;
  const hired = applications.filter((a: any) => a.status === "HIRED").length;
  const expired = applications.filter(
    (a: any) => a.status === "EXPIRED",
  ).length;

  const male = applications.filter((a: any) => a.gender === "Nam").length;
  const female = applications.filter((a: any) => a.gender === "Nữ").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Tổng quan Dashboard
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ứng viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hồ sơ mới</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newApps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã trúng tuyển
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hạn</CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expired}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Mới</span>
                <span className="font-bold">{newApps}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Đã liên hệ
                </span>
                <span className="font-bold">{contacted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Đã phỏng vấn
                </span>
                <span className="font-bold">{interviewed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Đạt</span>
                <span className="font-bold">{passed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Giới tính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Nam</span>
                <span className="font-bold">{male}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Nữ</span>
                <span className="font-bold">{female}</span>
              </div>
            </div>
            {/* We can integrate Recharts here later if needed, simple text stats for now */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
