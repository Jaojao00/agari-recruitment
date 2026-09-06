"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Application } from "@/lib/firebase/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [data, setData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [status, setStatus] = useState("");
  const [hiredAt, setHiredAt] = useState("");
  const [expiredAt, setExpiredAt] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const formatDateInput = (value: any) => {
    if (!value) return "";
    const date = value._seconds
      ? new Date(value._seconds * 1000)
      : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      if (res.ok) {
        const app = await res.json();
        setData(app);
        setStatus(app.status);
        setAdminNote(app.adminNote || "");
        setHiredAt(formatDateInput(app.hiredAt));
        setExpiredAt(formatDateInput(app.expiredAt));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        status,
        adminNote,
        hiredAt: hiredAt || null,
        expiredAt: expiredAt || null,
        adminId: user?.uid,
        adminName: user?.email,
      };
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Cập nhật thành công!");
        fetchApplication();
      } else {
        alert("Có lỗi xảy ra.");
      }
    } catch (error) {
      alert("Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">Không tìm thấy hồ sơ</div>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/applications">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          Chi tiết hồ sơ:{" "}
          <span className="text-red-700">{data.applicationId}</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin ứng viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Họ tên:</span>
              <span className="col-span-2 font-semibold">{data.fullName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Ngày sinh:</span>
              <span className="col-span-2">{data.dateOfBirth}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">CCCD:</span>
              <span className="col-span-2 font-mono">{data.cccd}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Số điện thoại:</span>
              <span className="col-span-2 font-bold">{data.phone}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Giới tính:</span>
              <span className="col-span-2">{data.gender}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Địa chỉ:</span>
              <span className="col-span-2">
                {data.preferredLocation || data.permanentAddress || "-"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Học vấn:</span>
              <span className="col-span-2">{data.education}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Ca mong muốn:</span>
              <span className="col-span-2">{data.preferredShift}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Ngày nhận việc:</span>
              <span className="col-span-2">{data.availableStartDate}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <span className="text-gray-500 font-medium">Ghi chú:</span>
              <span className="col-span-2 italic text-gray-600">
                {data.note || "Không có"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle>Quản lý tuyển dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Mới đăng ký</SelectItem>
                    <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
                    <SelectItem value="INTERVIEW_SCHEDULED">
                      Đã đặt lịch phỏng vấn
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

              {status === "HIRED" || hiredAt ? (
                <div className="space-y-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <Label className="text-green-800">Ngày trúng tuyển *</Label>
                  <Input
                    type="date"
                    value={hiredAt}
                    onChange={(e) => setHiredAt(e.target.value)}
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label>Ngày hết hạn (Tuỳ chọn)</Label>
                <Input
                  type="date"
                  value={expiredAt}
                  onChange={(e) => setExpiredAt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Ghi chú của Admin</Label>
                <Textarea
                  placeholder="Ghi chú nội bộ..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="h-24"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-red-700 hover:bg-red-800 text-white"
              >
                {saving ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                LƯU THAY ĐỔI
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Trạng thái đồng bộ Google Sheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-bold
                    ${
                      data.googleSheetSyncStatus === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : data.googleSheetSyncStatus === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                  >
                    {data.googleSheetSyncStatus}
                  </span>
                  {data.googleSheetSyncError && (
                    <p className="text-xs text-red-500 mt-2">
                      {data.googleSheetSyncError}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetch("/api/sync/process", { method: "POST" }).then(() =>
                      fetchApplication(),
                    );
                  }}
                >
                  <RefreshCw size={14} className="mr-1" /> Retry Sync
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
