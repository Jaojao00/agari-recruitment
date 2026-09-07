import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  CheckCircle,
  FileX,
  Calendar,
  Clock3,
  MapPin,
  TrendingUp,
  BriefcaseBusiness,
} from "lucide-react";
import { getApplicationsFromSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

type DashboardApplication = {
  status?: string;
  gender?: string;
  preferredLocation?: string;
  preferredShift?: string;
};

// Server Component
export default async function AdminDashboard() {
  const applications = await getApplicationsFromSheet();

  const total = applications.length;
  const newApps = applications.filter(
    (a: DashboardApplication) => a.status === "NEW",
  ).length;
  const contacted = applications.filter(
    (a: DashboardApplication) => a.status === "CONTACTED",
  ).length;
  const interviewed = applications.filter(
    (a: DashboardApplication) => a.status === "INTERVIEWED",
  ).length;
  const passed = applications.filter(
    (a: DashboardApplication) => a.status === "PASSED",
  ).length;
  const hired = applications.filter(
    (a: DashboardApplication) => a.status === "HIRED",
  ).length;
  const expired = applications.filter(
    (a: DashboardApplication) => a.status === "EXPIRED",
  ).length;
  const pending = applications.filter((a: DashboardApplication) =>
    ["NEW", "CONTACTED"].includes(a.status ?? ""),
  ).length;
  const scheduled = applications.filter(
    (a: DashboardApplication) => a.status === "INTERVIEW_SCHEDULED",
  ).length;
  const hireRate = total > 0 ? Math.round((hired / total) * 100) : 0;

  const male = applications.filter(
    (a: DashboardApplication) => a.gender === "Nam",
  ).length;
  const female = applications.filter(
    (a: DashboardApplication) => a.gender === "Nữ",
  ).length;

  const locationCounts = applications.reduce<Record<string, number>>(
    (counts, application: DashboardApplication) => {
      const location = application.preferredLocation || "Chưa xác định";
      counts[location] = (counts[location] || 0) + 1;
      return counts;
    },
    {},
  );
  const topLocations = Object.entries(locationCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 4);

  const shiftCounts = applications.reduce<Record<string, number>>(
    (counts, application: DashboardApplication) => {
      const shift = application.preferredShift || "Chưa xác định";
      counts[shift] = (counts[shift] || 0) + 1;
      return counts;
    },
    {},
  );
  const topShifts = Object.entries(shiftCounts).sort(
    ([, countA], [, countB]) => countB - countA,
  );

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cần xử lý</CardTitle>
            <Clock3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending}</div>
            <p className="mt-1 text-xs text-gray-500">
              Hồ sơ mới hoặc chưa liên hệ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lịch phỏng vấn
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduled}</div>
            <p className="mt-1 text-xs text-gray-500">
              Ứng viên đã được đặt lịch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỷ lệ trúng tuyển
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hireRate}%</div>
            <p className="mt-1 text-xs text-gray-500">
              {hired} trên {total} hồ sơ
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              Khu vực được quan tâm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topLocations.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có dữ liệu khu vực.</p>
            ) : (
              topLocations.map(([location, count]) => (
                <div key={location} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-4 text-gray-600">
                      {location}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-red-600"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
              Nhu cầu theo ca làm việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topShifts.length === 0 ? (
              <p className="text-sm text-gray-500">
                Chưa có dữ liệu ca làm việc.
              </p>
            ) : (
              topShifts.slice(0, 4).map(([shift, count]) => (
                <div key={shift} className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="w-40 truncate text-right text-sm text-gray-600">
                    {shift}
                  </span>
                  <span className="w-6 text-right text-sm font-semibold">
                    {count}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
