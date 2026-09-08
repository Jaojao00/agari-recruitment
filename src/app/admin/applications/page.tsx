"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Application, ApplicationStatus } from "@/lib/firebase/models";
import { useDebounce } from "@/lib/utils"; // I'll need to create this hook
import { Eye, EyeOff, Loader2, Search } from "lucide-react";

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [revealedCccd, setRevealedCccd] = useState<Record<string, boolean>>({});
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (debouncedSearch) query.append("search", debouncedSearch);
      if (jobIdFilter) query.append("jobId", jobIdFilter);
      if (statusFilter && statusFilter !== "ALL")
        query.append("status", statusFilter);
      query.append("page", page.toString());

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      const json = res.ok ? await res.json() : { data: [] };
      if (json.data) {
        setData(json.data);
        setTotalPages(json.totalPages);
        setTotal(json.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page, jobIdFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchApplications();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchApplications]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      NEW: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
      CONTACTED: {
        label: "Đã liên hệ",
        color: "bg-yellow-100 text-yellow-800",
      },
      INTERVIEW_SCHEDULED: {
        label: "Lịch phỏng vấn",
        color: "bg-orange-100 text-orange-800",
      },
      INTERVIEWED: {
        label: "Đã phỏng vấn",
        color: "bg-purple-100 text-purple-800",
      },
      PASSED: { label: "Đạt", color: "bg-emerald-100 text-emerald-800" },
      FAILED: { label: "Không đạt", color: "bg-red-100 text-red-800" },
      HIRED: { label: "Đã trúng tuyển", color: "bg-green-100 text-green-800" },
      WORKING: { label: "Đã nhận việc", color: "bg-teal-100 text-teal-800" },
      EXPIRED: { label: "Hết hạn", color: "bg-gray-100 text-gray-800" },
      CANCELLED: { label: "Đã hủy", color: "bg-gray-200 text-gray-700" },
    };
    const mapped = map[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${mapped.color}`}
      >
        {mapped.label}
      </span>
    );
  };

  const maskCCCD = (cccd: string) => {
    if (!cccd || cccd.length < 4) return "********";
    return `********${cccd.slice(-4)}`;
  };

  const updateStatus = async (
    application: Application,
    status: ApplicationStatus,
  ) => {
    setUpdatingStatus(application.id || null);
    try {
      const response = await fetch(
        `/api/admin/applications/${application.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!response.ok) throw new Error("Không thể cập nhật trạng thái");
      setData((current) =>
        current.map((item) =>
          item.id === application.id ? { ...item, status } : item,
        ),
      );
    } catch (error) {
      console.error(error);
      await fetchApplications();
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý hồ sơ ứng tuyển
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Tổng cộng: <span className="font-bold text-gray-900">{total}</span> hồ
          sơ
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Tìm theo tên, mã hồ sơ, CCCD, SĐT..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val || "");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="NEW">Đang xử lý</SelectItem>
              <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
              <SelectItem value="INTERVIEW_SCHEDULED">
                Lịch phỏng vấn
              </SelectItem>
              <SelectItem value="INTERVIEWED">Đã phỏng vấn</SelectItem>
              <SelectItem value="PASSED">Đạt</SelectItem>
              <SelectItem value="FAILED">Không đạt</SelectItem>
              <SelectItem value="HIRED">Đã trúng tuyển</SelectItem>
              <SelectItem value="WORKING">Đã nhận việc</SelectItem>
              <SelectItem value="EXPIRED">Hết hạn</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hồ sơ</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Số CCCD</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Giới tính</TableHead>
                <TableHead>Mã Ops</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center h-32 text-gray-500"
                >
                  Không tìm thấy ứng viên phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              data.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium text-red-700">
                    {app.applicationId}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48 text-sm">
                      <p className="font-semibold">
                        {app.jobTitle || "Nhân viên kho - Ca xoay"}
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
                  <TableCell>{app.dateOfBirth || "-"}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      title={
                        revealedCccd[app.id || ""]
                          ? "Ẩn số CCCD"
                          : "Hiện số CCCD"
                      }
                      onClick={() =>
                        setRevealedCccd((current) => ({
                          ...current,
                          [app.id || ""]: !current[app.id || ""],
                        }))
                      }
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-red-700"
                    >
                      <span className="font-mono">
                        {revealedCccd[app.id || ""]
                          ? app.cccd
                          : maskCCCD(app.cccd)}
                      </span>
                      {revealedCccd[app.id || ""] ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.gender || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onValueChange={(value) => {
                        if (value) {
                          updateStatus(app, value as ApplicationStatus);
                        }
                      }}
                      disabled={updatingStatus === app.id}
                    >
                      <SelectTrigger className="min-w-[150px]">
                        <SelectValue>{getStatusBadge(app.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">Đang xử lý</SelectItem>
                        <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
                        <SelectItem value="FAILED">Chưa phù hợp</SelectItem>
                        <SelectItem value="INTERVIEW_SCHEDULED">
                          Lịch phỏng vấn
                        </SelectItem>
                        <SelectItem value="INTERVIEWED">
                          Đã phỏng vấn
                        </SelectItem>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} className="mr-1" /> Xem
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Trước
          </Button>
          <span className="text-sm text-gray-500">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="animate-spin text-red-600" /></div>}>
      <ApplicationsContent />
    </Suspense>
  );
}