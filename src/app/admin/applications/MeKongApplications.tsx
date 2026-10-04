import React, { useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus } from "@/lib/firebase/models";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";

type TrackingRow = {
  rowNumber: number;
  stt: string;
  fullName: string;
  phone: string;
  opsCode: string;
  cvDate: string;
  screeningResult: string;
  interviewDate: string;
  interviewResult: string;
  offerDate: string;
  offerConfirmed: string;
  joinDate: string;
  team: string; // the tracking sheet uses "team" not "caTeam" according to UI
  status: string;
  note: string;
};

export default function MeKongApplications() {
  const [data, setData] = useState<Application[]>([]);
  const [trackings, setTrackings] = useState<TrackingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [revealedCccd, setRevealedCccd] = useState<Record<string, boolean>>({});
  
  const [editingRow, setEditingRow] = useState<TrackingRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?jobId=lap-vo-dong-thap,thot-not-can-tho&limit=1000&status=ALL`);
      const json = res.ok ? await res.json() : { data: [] };
      if (json.data) {
        setData(json.data);
      }
      
      const trackRes = await fetch(`/api/admin/tracking`);
      const trackJson = trackRes.ok ? await trackRes.json() : { data: [] };
      if (trackJson.data) {
        setTrackings(trackJson.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrackingsOnly = async () => {
    const trackRes = await fetch(`/api/admin/tracking`);
    const trackJson = trackRes.ok ? await trackRes.json() : { data: [] };
    if (trackJson.data) {
      setTrackings(trackJson.data);
    }
  };

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
      if (status === "PASSED") {
        await fetchTrackingsOnly();
      }
    } catch (error) {
      console.error(error);
      await fetchApplications();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openTrackingUpdate = (app: Application) => {
    const existing = trackings.find(t => t.phone === app.phone);
    if (existing) {
      setEditingRow(existing);
    } else {
      const today = new Date();
      const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
      setEditingRow({
        rowNumber: -1,
        stt: "",
        fullName: app.fullName || "",
        phone: app.phone || "",
        opsCode: app.opsCode || "",
        cvDate: todayStr,
        screeningResult: "",
        interviewDate: "",
        interviewResult: "",
        offerDate: "",
        offerConfirmed: "",
        joinDate: "",
        team: app.workSchedule || app.jobTitle || "",
        status: "Mới",
        note: "",
      });
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    setIsSaving(true);
    try {
      if (editingRow.rowNumber === -1) {
        await fetch("/api/admin/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRow),
        });
      } else {
        await fetch(`/api/admin/tracking/${editingRow.rowNumber}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRow),
        });
      }
      await fetchTrackingsOnly();
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu thông tin");
    } finally {
      setIsSaving(false);
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
    <>
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
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => openTrackingUpdate(app)}>
                        <Eye size={16} className="mr-1" /> Cập nhật
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {editingRow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg">{editingRow.rowNumber === -1 ? "Thêm mới hồ sơ theo dõi" : "Cập nhật thông tin theo dõi"}</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditingRow(null)}>Đóng</Button>
            </div>
            <form onSubmit={handleSaveTracking} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Họ tên *</label>
                  <Input required value={editingRow.fullName} onChange={e => setEditingRow({...editingRow, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">SĐT *</label>
                  <Input required value={editingRow.phone} onChange={e => setEditingRow({...editingRow, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">STT</label>
                  <Input value={editingRow.stt} onChange={e => setEditingRow({...editingRow, stt: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Mã Ops</label>
                  <Input value={editingRow.opsCode} onChange={e => setEditingRow({...editingRow, opsCode: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày nhận CV</label>
                  <DatePicker value={editingRow.cvDate || ""} onChange={(val) => setEditingRow({...editingRow, cvDate: val})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Kết quả sàng lọc</label>
                  <Input value={editingRow.screeningResult} onChange={e => setEditingRow({...editingRow, screeningResult: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày PV</label>
                  <DatePicker value={editingRow.interviewDate || ""} onChange={(val) => setEditingRow({...editingRow, interviewDate: val})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Kết quả PV</label>
                  <Input value={editingRow.interviewResult} onChange={e => setEditingRow({...editingRow, interviewResult: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày gửi offer</label>
                  <DatePicker value={editingRow.offerDate || ""} onChange={(val) => setEditingRow({...editingRow, offerDate: val})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Xác nhận nhận việc</label>
                  <DatePicker value={editingRow.offerConfirmed || ""} onChange={(val) => setEditingRow({...editingRow, offerConfirmed: val})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày nhận việc</label>
                  <DatePicker value={editingRow.joinDate || ""} onChange={(val) => setEditingRow({...editingRow, joinDate: val})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ca/Team</label>
                  <Input value={editingRow.team} onChange={e => setEditingRow({...editingRow, team: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Trạng thái</label>
                  <Select value={editingRow.status || "Chưa rõ"} onValueChange={val => setEditingRow({...editingRow, status: val || ""})}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mới">Mới</SelectItem>
                      <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                      <SelectItem value="Đã liên hệ">Đã liên hệ</SelectItem>
                      <SelectItem value="Chưa phù hợp">Chưa phù hợp</SelectItem>
                      <SelectItem value="Từ chối Offer">Từ chối Offer</SelectItem>
                      <SelectItem value="Đồng ý Offer">Đồng ý Offer</SelectItem>
                      <SelectItem value="Đã nhận việc">Đã nhận việc</SelectItem>
                      <SelectItem value="Đã nghỉ việc">Đã nghỉ việc</SelectItem>
                      <SelectItem value="Chưa rõ">Chưa rõ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ghi chú</label>
                  <Input value={editingRow.note} onChange={e => setEditingRow({...editingRow, note: e.target.value})} />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setEditingRow(null)} disabled={isSaving}>Hủy</Button>
                <Button type="submit" className="bg-[#D90000] hover:bg-red-700 text-white min-w-[120px]" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}