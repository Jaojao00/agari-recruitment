import React, { useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus } from "@/lib/firebase/models";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MeKongApplications() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [revealedCccd, setRevealedCccd] = useState<Record<string, boolean>>({});

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?jobId=lap-vo-dong-thap&limit=1000&status=ALL`);
      const json = res.ok ? await res.json() : { data: [] };
      if (json.data) {
        setData(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (application: Application, status: ApplicationStatus) => {
    setUpdatingStatus(application.id || null);
    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Không thể cập nhật trạng thái");
      setData((current) => current.map((item) => (item.id === application.id ? { ...item, status } : item)));
    } catch (error) {
      console.error(error);
      await fetchApplications();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const tabs = [
    { label: "TIẾP NHẬN/ ĐANG XỬ LÝ", statuses: ["NEW"] },
    { label: "ĐÃ LIÊN HỆ/ ĐÃ XỬ LÝ", statuses: ["CONTACTED", "INTERVIEW_SCHEDULED", "INTERVIEWED"] },
    { label: "CHƯA PHÙ HỢP", statuses: ["FAILED", "CANCELLED", "EXPIRED"] },
    { label: "ĐÃ NHẬN VIỆC", statuses: ["PASSED", "HIRED", "WORKING"] },
  ];

  const getFilteredData = (tabIndex: number) => {
    return data.filter((app) => tabs[tabIndex].statuses.includes(app.status || "NEW"));
  };

  const maskCCCD = (cccd: string) => {
    if (!cccd || cccd.length < 4) return "********";
    return `********${cccd.slice(-4)}`;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      NEW: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
      CONTACTED: { label: "Đã liên hệ", color: "bg-yellow-100 text-yellow-800" },
      INTERVIEW_SCHEDULED: { label: "Lịch phỏng vấn", color: "bg-orange-100 text-orange-800" },
      INTERVIEWED: { label: "Đã phỏng vấn", color: "bg-purple-100 text-purple-800" },
      PASSED: { label: "Đạt", color: "bg-emerald-100 text-emerald-800" },
      FAILED: { label: "Không đạt", color: "bg-red-100 text-red-800" },
      HIRED: { label: "Đã trúng tuyển", color: "bg-green-100 text-green-800" },
      WORKING: { label: "Đã nhận việc", color: "bg-teal-100 text-teal-800" },
      EXPIRED: { label: "Hết hạn", color: "bg-gray-100 text-gray-800" },
      CANCELLED: { label: "Đã hủy", color: "bg-gray-200 text-gray-700" },
    };
    const mapped = map[status] || { label: status, color: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mapped.color}`}>
        {mapped.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab, idx) => {
          const count = getFilteredData(idx).length;
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${isActive ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : getFilteredData(activeTab).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg">Không có dữ liệu.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Mã Ops</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Số CCCD</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredData(activeTab).map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium text-red-700">
                    {app.applicationId}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-semibold">
                        {(app.jobTitle === "Lao động phổ thông AGARI Part-time" ? "Nhân viên kho part-time" : app.jobTitle) || "Nhân viên kho - Ca xoay"}
                      </p>
                      {app.workSchedule ? (
                        <p className="text-xs text-gray-500">
                          {app.workSchedule}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {app.fullName}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-700">{app.opsCode || "-"}</TableCell>
                  <TableCell>{app.dateOfBirth || "-"}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      title={revealedCccd[app.id || ""] ? "Ẩn số CCCD" : "Hiện số CCCD"}
                      onClick={() =>
                        setRevealedCccd((current) => ({
                          ...current,
                          [app.id || ""]: !current[app.id || ""],
                        }))
                      }
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-red-700"
                    >
                      <span className="font-mono">
                        {revealedCccd[app.id || ""] ? app.cccd : maskCCCD(app.cccd)}
                      </span>
                      {revealedCccd[app.id || ""] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.gender || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={app.status || "NEW"}
                      onValueChange={(value) => updateStatus(app, value as ApplicationStatus)}
                      disabled={updatingStatus === app.id}
                    >
                      <SelectTrigger className="min-w-[150px]">
                        <SelectValue>{getStatusBadge(app.status || "NEW")}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">Đang xử lý</SelectItem>
                        <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
                        <SelectItem value="INTERVIEW_SCHEDULED">Lịch phỏng vấn</SelectItem>
                        <SelectItem value="INTERVIEWED">Đã phỏng vấn</SelectItem>
                        <SelectItem value="FAILED">Không đạt</SelectItem>
                        <SelectItem value="PASSED">Đạt</SelectItem>
                        <SelectItem value="HIRED">Đã trúng tuyển</SelectItem>
                        <SelectItem value="WORKING">Đã nhận việc</SelectItem>
                        <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/applications/${app.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        <Eye size={16} className="mr-1" /> Xem
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}