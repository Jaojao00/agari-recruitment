"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Save,
  Zap,
  CheckCircle2,
  MessageCircle,
  FileText,
  MapPin,
  Clock,
  UserCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { CANDIDATE_STORAGE_KEY } from "@/components/chat/CandidateChatWidget";
import { LiveRecruitmentStatsSection } from "@/components/social-proof/LiveRecruitmentProof";

interface CandidateProfileForm {
  profileId?: string;
  fullName: string;
  phone: string;
  email: string;
  cccd: string;
  dateOfBirth: string;
  gender: string;
  opsCode: string;
  permanentAddress: string;
  preferredLocation: string;
  education: string;
  preferredShift: string;
  workSchedule: string;
  availableStartDate: string;
  note: string;
}

interface SubmittedApplication {
  id: string;
  applicationId: string;
  jobId?: string;
  jobTitle?: string;
  workSchedule?: string;
  preferredLocation?: string;
  status: string;
  appliedAt?: string;
  adminNote?: string;
}

const QUICK_APPLY_JOBS = [
  {
    jobId: "hcm-binh-tan",
    title: "Nhân viên chính thức Kho SPX - Quận Bình Tân (TP.HCM)",
    salary: "10.500.000 - 12.500.000 VNĐ/tháng",
    location:
      "Quận Bình Tân (Tuyển chính): 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
    schedule: "Xoay ca luân chuyển (5 ca làm việc chính)",
    badge: "TP.HCM • Tuyển chính (SL: 5)",
  },
  {
    jobId: "hcm-tan-phu",
    title: "Nhân viên chính thức Kho SPX - Quận Tân Phú (TP.HCM)",
    salary: "10.500.000 - 12.500.000 VNĐ/tháng",
    location:
      "Quận Tân Phú (Tuyển chính): 549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
    schedule: "Xoay ca luân chuyển (5 ca làm việc chính)",
    badge: "TP.HCM • Tuyển chính (SL: 1)",
  },
  {
    jobId: "spx-fulltime",
    title: "Nhân viên kho SPX Full-time (BPO Cố định)",
    salary: "8.400.000 - 11.300.000 VNĐ/tháng",
    location: "SW SOC - KCN BÌNH MINH VINH LONG",
    schedule: "Ca 1: 06:00 - 15:00",
    badge: "Vĩnh Long • BPO Cố định",
  },
  {
    jobId: "agari-part-time",
    title: "Nhân viên kho Part-time (Thời vụ)",
    salary: "125.000 - 300.000 VNĐ/ca",
    location: "SW SOC - KCN BÌNH MINH VINH LONG",
    schedule: "Ca 1: 06:00 - 15:00",
    badge: "Vĩnh Long • Part-time",
  },
  {
    jobId: "thot-not-can-tho",
    title: "Nhân viên kho Full-time (BPO) - Thốt Nốt, Cần Thơ",
    salary: "250.000 VNĐ/ngày + Thưởng 750.000đ/tháng",
    location:
      "78-CTO Co Do 02 Hub: Ấp Tân Lợi 1, Xã Thuận Hưng, Huyện Thốt Nốt, Cần Thơ.",
    schedule: "09:00 - 18:00 (Giờ hành chính)",
    badge: "KV Mekong • Cần Thơ",
  },
  {
    jobId: "lap-vo-dong-thap",
    title: "Nhân viên kho Thời vụ - Khu vực Đồng Tháp",
    salary: "140.000 VNĐ/ca (4h) - 280.000 VNĐ/ngày",
    location: "71-DTP Lap Vo 02 Hub",
    schedule: "Làm cả 2 ca (Sáng & Chiều)",
    badge: "KV Mekong • Đồng Tháp",
  },
];

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  NEW: { label: "Đang xử lý", className: "bg-blue-100 text-blue-800 border-blue-200" },
  CONTACTED: { label: "Đã liên hệ", className: "bg-amber-100 text-amber-800 border-amber-200" },
  INTERVIEW_SCHEDULED: {
    label: "Lịch phỏng vấn",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  INTERVIEWED: { label: "Đã phỏng vấn", className: "bg-purple-100 text-purple-800 border-purple-200" },
  PASSED: { label: "Đạt phỏng vấn", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  HIRED: { label: "Đã trúng tuyển", className: "bg-green-100 text-green-800 border-green-200" },
  WORKING: { label: "Đã nhận việc", className: "bg-teal-100 text-teal-800 border-teal-200" },
  FAILED: { label: "Chưa phù hợp", className: "bg-red-100 text-red-800 border-red-200" },
  EXPIRED: { label: "Hết hạn", className: "bg-gray-100 text-gray-700 border-gray-200" },
  CANCELLED: { label: "Đã hủy", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function OnlineProfilePage() {
  const [lookupInput, setLookupInput] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [applications, setApplications] = useState<SubmittedApplication[]>([]);
  const [form, setForm] = useState<CandidateProfileForm>({
    fullName: "",
    phone: "",
    email: "",
    cccd: "",
    dateOfBirth: "",
    gender: "Nam",
    opsCode: "",
    permanentAddress: "",
    preferredLocation:
      "Quận Bình Tân (Tuyển chính): 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
    education: "12/12",
    preferredShift: "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
    workSchedule: "Xoay ca luân chuyển (5 ca làm việc chính)",
    availableStartDate: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const performLookup = useCallback(
    async (phoneOrCccd: string, silent = false) => {
      const clean = phoneOrCccd.replace(/\D/g, "");
      if (!clean) return;
      if (!silent) setLookingUp(true);
      try {
        const isCccd = clean.length === 12;
        const query = isCccd
          ? `cccd=${encodeURIComponent(clean)}`
          : `phone=${encodeURIComponent(clean)}`;
        const res = await fetch(`/api/candidate/profile?${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = data.profile;
            const nextForm: CandidateProfileForm = {
              profileId: p.profileId,
              fullName: p.fullName || "",
              phone: p.phone || "",
              email: p.email || "",
              cccd: p.cccd || "",
              dateOfBirth: p.dateOfBirth || "",
              gender: p.gender || "Nam",
              opsCode: p.opsCode || "",
              permanentAddress: p.permanentAddress || "",
              preferredLocation:
                p.preferredLocation ||
                "Quận Bình Tân (Tuyển chính): 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
              education: p.education || "12/12",
              preferredShift:
                p.preferredShift ||
                "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
              workSchedule:
                p.workSchedule || "Xoay ca luân chuyển (5 ca làm việc chính)",
              availableStartDate:
                p.availableStartDate || new Date().toISOString().slice(0, 10),
              note: p.note || "",
            };
            setForm(nextForm);
            localStorage.setItem(
              CANDIDATE_STORAGE_KEY,
              JSON.stringify(nextForm),
            );
            window.dispatchEvent(new Event("agari-profile-updated"));
          }
          setApplications(data.applications || []);
          if (!silent) {
            if (data.profile || (data.applications && data.applications.length > 0)) {
              setFeedback({
                type: "success",
                text: `Đã tải thông tin hồ sơ trực tuyến và ${data.applications?.length || 0} đơn ứng tuyển của bạn!`,
              });
            } else {
              setFeedback({
                type: "error",
                text: "Chưa tìm thấy hồ sơ với số này. Bạn có thể điền thông tin bên dưới để tạo Hồ sơ Online mới nhé!",
              });
            }
          }
        }
      } catch {
        if (!silent) {
          setFeedback({
            type: "error",
            text: "Không thể kết nối máy chủ khi tra cứu. Vui lòng thử lại.",
          });
        }
      } finally {
        if (!silent) setLookingUp(false);
      }
    },
    [],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CANDIDATE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          setForm((prev) => ({ ...prev, ...parsed }));
          if (parsed.phone) {
            setLookupInput(parsed.phone);
            performLookup(parsed.phone, true);
          }
        }
      }
    } catch {
      // ignore
    }
  }, [performLookup]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim()) {
      setFeedback({
        type: "error",
        text: "Vui lòng nhập đầy đủ Họ và tên cùng Số điện thoại Zalo.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu hồ sơ.");
      }

      const savedProfile = { ...form, ...(data.profile || {}) };
      setForm(savedProfile);
      if (data.applications) setApplications(data.applications);
      localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(savedProfile));
      window.dispatchEvent(new Event("agari-profile-updated"));

      setFeedback({
        type: "success",
        text: "Đã lưu Hồ sơ Online thành công! Từ giờ bạn có thể Ứng tuyển nhanh 1 chạm hoặc Chat trực tiếp với Nhà tuyển dụng.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Lỗi khi lưu hồ sơ.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickApply = async (job: (typeof QUICK_APPLY_JOBS)[number]) => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.cccd.trim()) {
      setFeedback({
        type: "error",
        text: "Vui lòng điền Họ tên, Số điện thoại Zalo và Số CCCD (12 số) trong Hồ sơ Online trước khi bấm Ứng tuyển 1 chạm!",
      });
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    setApplyingJobId(job.jobId);
    setFeedback(null);
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applyJobId: job.jobId,
          applyJobTitle: job.title,
          applyLocation: job.location,
          applySchedule: job.schedule,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể ứng tuyển nhanh.");
      }

      if (data.alreadyApplied) {
        setFeedback({
          type: "error",
          text: data.message || "Bạn đã nộp hồ sơ cho vị trí này trước đó.",
        });
      } else {
        if (data.applications) setApplications(data.applications);
        setFeedback({
          type: "success",
          text: `🎉 Ứng tuyển 1 chạm thành công vị trí "${job.title}"! Mã hồ sơ của bạn là: ${data.applicationId}.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Lỗi khi ứng tuyển.",
      });
    } finally {
      setApplyingJobId(null);
    }
  };

  const openChatWithPrefill = (prefillText?: string) => {
    window.dispatchEvent(
      new CustomEvent("open-agari-chat", {
        detail: { prefill: prefillText || "" },
      }),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-red-700 hover:underline font-semibold text-sm"
          >
            <ArrowLeft size={16} /> Về trang chủ tuyển dụng
          </Link>
          <button
            type="button"
            onClick={() => openChatWithPrefill()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D90000] hover:bg-red-800 text-white text-xs font-bold shadow-sm transition"
          >
            <MessageCircle size={15} /> Mở khung Chat với Nhà tuyển dụng
          </button>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#990000] via-[#D90000] to-[#FF3B30] rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-red-950 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles size={13} /> Hệ thống Hồ sơ & Chat Online AGARI
              </span>
              <h1 className="text-2xl md:text-3xl font-black uppercase mt-2">
                Hồ Sơ Ứng Viên Online & Tra Cứu Trạng Thái
              </h1>
              <p className="text-red-100 text-sm mt-1 max-w-2xl">
                Lưu thông tin cá nhân 1 lần duy nhất để ứng tuyển nhanh 1 chạm vào mọi Kho/Hub SPX Express (TP.HCM, Vĩnh Long, Cần Thơ, Đồng Tháp), theo dõi kết quả duyệt hồ sơ và chat trực tiếp với HR.
              </p>
            </div>

            {/* Quick Lookup Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                performLookup(lookupInput);
              }}
              className="bg-white/15 backdrop-blur-xs p-3.5 rounded-xl border border-white/25 w-full md:w-80 shrink-0"
            >
              <label className="block text-xs font-bold uppercase text-yellow-200 mb-1.5">
                Tra cứu hồ sơ đã nộp (SĐT hoặc CCCD)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lookupInput}
                  onChange={(e) => setLookupInput(e.target.value)}
                  placeholder="Nhập SĐT hoặc 12 số CCCD..."
                  className="flex-1 h-10 px-3 rounded-lg bg-white text-gray-900 text-xs font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={lookingUp}
                  className="h-10 px-3.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-red-950 font-extrabold text-xs flex items-center gap-1 shrink-0 transition"
                >
                  {lookingUp ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Search size={14} />
                  )}
                  Tra cứu
                </button>
              </div>
            </form>
          </div>
        </div>

        <LiveRecruitmentStatsSection />

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between gap-3 ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <span>{feedback.text}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs underline opacity-75 hover:opacity-100 shrink-0"
            >
              Đóng
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Online Profile Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck size={19} className="text-yellow-400" />
                <h2 className="font-bold text-base uppercase">
                  Thông tin Hồ sơ Online của tôi
                </h2>
              </div>
              {form.profileId && (
                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-mono text-yellow-300">
                  {form.profileId}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Họ và tên đầy đủ *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="Nhập họ và tên có dấu"
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Số điện thoại Zalo *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Nhập 10 số điện thoại"
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Địa chỉ Gmail (để nhận thông báo kết quả & lịch phỏng vấn) *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Ví dụ: tenban@gmail.com"
                  className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Số CCCD (12 số) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={form.cccd}
                    onChange={(e) => setForm({ ...form, cccd: e.target.value })}
                    placeholder="Nhập 12 số CCCD"
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Giới tính *
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Địa chỉ nơi ở hiện tại *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.permanentAddress}
                    onChange={(e) =>
                      setForm({ ...form, permanentAddress: e.target.value })
                    }
                    placeholder="Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mã Ops nhân viên{" "}
                    <span className="font-normal text-gray-400">
                      (Không bắt buộc)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.opsCode}
                    onChange={(e) =>
                      setForm({ ...form, opsCode: e.target.value })
                    }
                    placeholder="Điền nếu đã từng có mã Ops"
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Trình độ học vấn
                  </label>
                  <select
                    value={form.education}
                    onChange={(e) =>
                      setForm({ ...form, education: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="9/12">9/12</option>
                    <option value="12/12">12/12</option>
                    <option value="Đã Tốt Nghiệp">Đã Tốt Nghiệp</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ngày có thể bắt đầu nhận việc
                  </label>
                  <input
                    type="date"
                    value={form.availableStartDate}
                    onChange={(e) =>
                      setForm({ ...form, availableStartDate: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kinh nghiệm làm kho
                </label>
                <select
                  value={form.preferredShift}
                  onChange={(e) =>
                    setForm({ ...form, preferredShift: e.target.value })
                  }
                  className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển">
                    Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển
                  </option>
                  <option value="Tôi Đã Từng làm việc dưới 1 tháng">
                    Tôi Đã Từng làm việc dưới 1 tháng
                  </option>
                  <option value="Tôi Đã Từng làm việc từ 1 tháng trở lên">
                    Tôi Đã Từng làm việc từ 1 tháng trở lên
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ghi chú thêm cho Nhà tuyển dụng
                </label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Ghi chú khu vực/Hub mong muốn hoặc câu hỏi thêm..."
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-xl bg-[#D90000] hover:bg-red-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                LƯU HỒ SƠ ONLINE TRÊN HỆ THỐNG
              </button>
            </form>
          </div>

          {/* Right Column: Submitted Applications + 1-Click Apply (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Submitted Applications Status */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 bg-red-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <h3 className="font-bold text-sm uppercase">
                    Trạng thái Hồ sơ đã nộp ({applications.length})
                  </h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {applications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-500">
                    Chưa có đơn ứng tuyển nào. Hãy lưu Hồ sơ Online bên trái và bấm <strong>&ldquo;Ứng tuyển 1 chạm&rdquo;</strong> ở danh sách vị trí bên dưới!
                  </div>
                ) : (
                  applications.map((app) => {
                    const st = STATUS_MAP[app.status] || {
                      label: app.status,
                      className: "bg-gray-100 text-gray-800 border-gray-200",
                    };
                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/70 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-xs text-red-700">
                            {app.applicationId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${st.className}`}
                          >
                            {st.label}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-gray-900">
                          {app.jobTitle || "Nhân viên kho SPX"}
                        </p>
                        {app.preferredLocation && (
                          <p className="text-xs text-gray-600 flex items-start gap-1">
                            <MapPin
                              size={13}
                              className="text-red-600 shrink-0 mt-0.5"
                            />
                            <span>{app.preferredLocation}</span>
                          </p>
                        )}
                        {app.workSchedule && (
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock size={13} className="text-gray-500" />
                            <span>{app.workSchedule}</span>
                          </p>
                        )}
                        {app.adminNote && (
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                            📌 <strong>Thông báo từ HR:</strong> {app.adminNote}
                          </div>
                        )}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              openChatWithPrefill(
                                `Chào HR, mình muốn hỏi thêm về hồ sơ mã ${app.applicationId} (${app.jobTitle}) ạ!`,
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:underline"
                          >
                            <MessageCircle size={13} /> Chat với HR về hồ sơ này
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 1-Click Quick Apply List */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-2">
                <Zap size={18} className="fill-white" />
                <div>
                  <h3 className="font-bold text-sm uppercase leading-tight">
                    Ứng tuyển nhanh 1 chạm
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    Sử dụng trực tiếp Hồ sơ Online của bạn mà không cần nhập lại
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {QUICK_APPLY_JOBS.map((job) => {
                  const already = applications.find(
                    (a) => a.jobId === job.jobId,
                  );
                  return (
                    <div
                      key={job.jobId}
                      className="p-3.5 rounded-xl border border-gray-200 hover:border-red-300 transition space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700">
                          {job.badge}
                        </span>
                        <span className="text-xs font-bold text-red-700">
                          {job.salary}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-500">{job.location}</p>
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <Link
                          href={`/ung-tuyen?job=${job.jobId}`}
                          className="text-xs text-gray-500 hover:text-gray-800 underline"
                        >
                          Tùy chỉnh ca/Hub khác
                        </Link>
                        {already ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 size={14} /> Đã nộp ({already.applicationId})
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={applyingJobId === job.jobId}
                            onClick={() => handleQuickApply(job)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D90000] hover:bg-red-800 text-white font-bold text-xs shadow-xs transition"
                          >
                            {applyingJobId === job.jobId ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Zap size={13} className="fill-yellow-300 text-yellow-300" />
                            )}
                            Ứng tuyển 1 chạm
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
