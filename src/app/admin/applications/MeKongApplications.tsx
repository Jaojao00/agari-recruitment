import React, { useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus } from "@/lib/firebase/models";
import { Loader2, Search, Edit } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function MeKongApplications() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 5) return phone;
    return phone.substring(0, 6) + "***";
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")} ${d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, "-")}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, idx) => {
          const count = getFilteredData(idx).length;
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-4 text-sm font-semibold transition-colors ${isActive ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : getFilteredData(activeTab).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg">Không có dữ liệu.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[300px] text-xs font-bold text-gray-500">ỨNG VIÊN</TableHead>
                <TableHead className="text-center text-xs font-bold text-gray-500">CÁCH LIÊN HỆ</TableHead>
                <TableHead className="text-center text-xs font-bold text-gray-500">THỜI GIAN</TableHead>
                <TableHead className="text-center text-xs font-bold text-gray-500">TRẠNG THÁI</TableHead>
                <TableHead className="text-center text-xs font-bold text-gray-500">GHI CHÚ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredData(activeTab).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 uppercase">
                        {item.fullName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{item.fullName}</div>
                        <div className="text-xs text-blue-600 flex items-center gap-1">
                          {maskPhone(item.phone)} <span className="font-medium">Nhấn để hiện</span>
                        </div>
                      </div>
                      <Link href={"/admin/applications/" + item.id}><Button variant="outline" size="sm" className="ml-auto text-xs h-7 px-2">Xem CV</Button></Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm">CV</TableCell>
                  <TableCell className="text-center text-sm text-gray-600">{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    {updatingStatus === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      <Select value={item.status || "NEW"} onValueChange={(val) => updateStatus(item, val as ApplicationStatus)}>
                        <SelectTrigger className="w-[160px] mx-auto h-8 text-xs bg-white rounded-full">
                          <SelectValue />
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
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={"/admin/applications/" + item.id}><Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={16} className="text-gray-500" /></Button></Link>
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