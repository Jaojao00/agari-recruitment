"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Search,
  Calendar,
  MapPin,
  UserCheck,
  FileText,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Plus,
  Sparkles,
  ExternalLink,
  Clock,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OnlineProfile {
  profileId: string;
  fullName: string;
  phone: string;
  cccd: string;
  dateOfBirth: string;
  gender: string;
  opsCode?: string;
  permanentAddress: string;
  preferredLocation: string;
  education: string;
  preferredShift: string;
  workSchedule?: string;
  availableStartDate: string;
  note?: string;
  updatedAt?: string;
}

interface CandidateApplication {
  id: string;
  applicationId: string;
  fullName?: string;
  jobId?: string;
  jobTitle?: string;
  workSchedule?: string;
  preferredLocation?: string;
  status: string;
  appliedAt?: string;
  adminNote?: string;
}

interface ChatMessageItem {
  id: string;
  roomId: string;
  candidateName: string;
  candidatePhone: string;
  sender: "candidate" | "admin" | "bot";
  senderName: string;
  content: string;
  type: "text" | "interview_invite" | "status_update" | "quick_apply";
  metadata?: {
    interviewDate?: string;
    interviewTime?: string;
    interviewLocation?: string;
    documents?: string;
    applicationId?: string;
    jobTitle?: string;
    status?: string;
    statusLabel?: string;
  };
  createdAt: string;
}

interface ChatThreadSummary {
  roomId: string;
  candidateName: string;
  candidatePhone: string;
  lastMessage: string;
  lastSender: "candidate" | "admin" | "bot";
  lastMessageAt: string;
  unreadByAdmin: number;
  unreadByCandidate: number;
  profile?: OnlineProfile | null;
  applicationsCount?: number;
  latestStatus?: string;
}

const INTERVIEW_LOCATIONS = [
  "Quận Bình Tân (TP.HCM): 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
  "Quận Tân Phú (TP.HCM): 549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
  "Vĩnh Long: Kho SPX Express - SW SOC KCN Bình Minh, Thị xã Bình Minh, Vĩnh Long",
  "Cần Thơ: 78-CTO Co Do 02 Hub - Ấp Tân Lợi 1, Xã Thuận Hưng, Huyện Thốt Nốt, Cần Thơ",
  "Đồng Tháp: Hệ thống Hub SPX Express Đồng Tháp (Cao Lãnh / Lấp Vò / Sa Đéc)",
];

const HR_QUICK_TEMPLATES = [
  "Chào bạn, HR AGARI đã nhận được thông tin ứng tuyển của bạn. Bạn có thể tham gia phỏng vấn trực tiếp vào ngày mai không?",
  "Khi đi phỏng vấn bạn lưu ý mang theo CCCD gắn chip bản gốc (hoặc VNeID mức 2) và mang giày/dép có quai hậu nhé!",
  "Chúc mừng bạn đã ĐẠT phỏng vấn tại kho SPX Express! Bộ phận nhân sự sẽ hướng dẫn thủ tục nhận việc cho bạn nhé.",
];

const STATUS_OPTIONS = [
  { value: "NEW", label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
  { value: "CONTACTED", label: "Đã liên hệ", color: "bg-amber-100 text-amber-800" },
  {
    value: "INTERVIEW_SCHEDULED",
    label: "Lịch phỏng vấn",
    color: "bg-orange-100 text-orange-800",
  },
  { value: "INTERVIEWED", label: "Đã phỏng vấn", color: "bg-purple-100 text-purple-800" },
  { value: "PASSED", label: "Đạt phỏng vấn", color: "bg-emerald-100 text-emerald-800" },
  { value: "HIRED", label: "Đã trúng tuyển", color: "bg-green-100 text-green-800" },
  { value: "WORKING", label: "Đã nhận việc", color: "bg-teal-100 text-teal-800" },
  { value: "FAILED", label: "Không đạt", color: "bg-red-100 text-red-800" },
];

export default function AdminChatPage() {
  const [threads, setThreads] = useState<ChatThreadSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "UNREAD">("ALL");

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [activeProfile, setActiveProfile] = useState<OnlineProfile | null>(null);
  const [activeApps, setActiveApps] = useState<CandidateApplication[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState("");

  // Interview invite drawer state
  const [showInviteBox, setShowInviteBox] = useState(false);
  const [inviteDate, setInviteDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [inviteTime, setInviteTime] = useState("09:00");
  const [inviteLocation, setInviteLocation] = useState(INTERVIEW_LOCATIONS[0]);
  const [inviteDocs, setInviteDocs] = useState(
    "CCCD gắn chip bản gốc (và VNeID Mức 2)",
  );

  // New conversation modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatPhone, setNewChatPhone] = useState("");

  // Right column profile editing state
  const [showCccd, setShowCccd] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<Partial<OnlineProfile>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatData = useCallback(
    async (roomToLoad?: string, isSilent = false) => {
      if (!isSilent) setLoadingInitial(true);
      try {
        const targetRoom = roomToLoad ?? selectedRoomId;
        const url = targetRoom
          ? `/api/admin/chat?roomId=${encodeURIComponent(targetRoom)}`
          : `/api/admin/chat`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const fetchedThreads: ChatThreadSummary[] = data.threads || [];
          setThreads(fetchedThreads);

          if (!targetRoom && fetchedThreads.length > 0) {
            const firstRoom = fetchedThreads[0].roomId;
            setSelectedRoomId(firstRoom);
          } else if (data.activeRoom) {
            const incomingMsgs: ChatMessageItem[] =
              data.activeRoom.messages || [];
            setMessages((prev) => {
              if (!isSilent || prev.length === 0) return incomingMsgs;
              const map = new Map<string, ChatMessageItem>();
              for (const m of prev) {
                if (m.roomId === data.activeRoom.roomId) map.set(m.id, m);
              }
              for (const m of incomingMsgs) {
                map.set(m.id, m);
              }
              return Array.from(map.values()).sort((a, b) =>
                String(a.createdAt).localeCompare(String(b.createdAt)),
              );
            });
            setActiveProfile(data.activeRoom.profile || null);
            setActiveApps(data.activeRoom.applications || []);
            if (!editingProfile && data.activeRoom.profile) {
              setProfileDraft(data.activeRoom.profile);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching admin chat:", err);
      } finally {
        if (!isSilent) setLoadingInitial(false);
      }
    },
    [selectedRoomId, editingProfile],
  );

  useEffect(() => {
    fetchChatData(selectedRoomId, false);
  }, [selectedRoomId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatData(selectedRoomId, true);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedRoomId, fetchChatData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedRoomId]);

  const handleSelectRoom = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowInviteBox(false);
    setEditingProfile(false);
    // Mark room as read
    try {
      await fetch("/api/admin/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      window.dispatchEvent(new Event("admin-chat-read"));
    } catch {
      // ignore
    }
  };

  const currentThread = threads.find((t) => t.roomId === selectedRoomId);
  const activeCandidateName =
    activeProfile?.fullName ||
    currentThread?.candidateName ||
    activeApps[0]?.fullName ||
    "Ứng viên";

  const handleSendText = async (overrideText?: string) => {
    const content = (overrideText ?? inputText).trim();
    if (!content || !selectedRoomId || sending) return;
    if (!overrideText) setInputText("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoomId,
          candidateName: activeCandidateName,
          senderName: "Nhà tuyển dụng AGARI",
          type: "text",
          content,
        }),
      });
      if (res.ok) {
        await fetchChatData(selectedRoomId, true);
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendInterviewInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoomId,
          candidateName: activeCandidateName,
          senderName: "Nhà tuyển dụng AGARI",
          type: "interview_invite",
          metadata: {
            interviewDate: inviteDate,
            interviewTime: inviteTime,
            interviewLocation: inviteLocation,
            documents: inviteDocs,
            applicationId: activeApps[0]?.applicationId,
            jobTitle: activeApps[0]?.jobTitle,
          },
        }),
      });
      if (res.ok) {
        setShowInviteBox(false);
        await fetchChatData(selectedRoomId, true);
      }
    } finally {
      setSending(false);
    }
  };

  const handleQuickStatusChange = async (
    newStatus: string,
    applicationId?: string,
  ) => {
    if (!selectedRoomId || sending) return;
    setSending(true);
    try {
      await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoomId,
          candidateName: activeCandidateName,
          senderName: "Nhà tuyển dụng AGARI",
          type: "status_update",
          metadata: {
            status: newStatus,
            applicationId: applicationId || activeApps[0]?.applicationId,
          },
        }),
      });
      await fetchChatData(selectedRoomId, true);
    } finally {
      setSending(false);
    }
  };

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newChatPhone.replace(/\D/g, "");
    if (!cleanPhone || !newChatName.trim()) return;
    setShowNewChatModal(false);
    setSelectedRoomId(cleanPhone);

    await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: cleanPhone,
        candidateName: newChatName.trim(),
        senderName: "Nhà tuyển dụng AGARI",
        type: "text",
        content: `Chào ${newChatName.trim()}, Bộ phận Tuyển dụng AGARI liên hệ hỗ trợ hồ sơ ứng tuyển của bạn ạ!`,
      }),
    });
    setNewChatName("");
    setNewChatPhone("");
    await fetchChatData(cleanPhone, false);
  };

  const handleSaveOnlineProfileFromAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    setSavingProfile(true);
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activeProfile,
          ...profileDraft,
          fullName: profileDraft.fullName || activeCandidateName,
          phone: selectedRoomId,
        }),
      });
      if (res.ok) {
        setEditingProfile(false);
        await fetchChatData(selectedRoomId, true);
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (filterTab === "UNREAD" && t.unreadByAdmin === 0) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.candidateName.toLowerCase().includes(q) ||
      t.candidatePhone.includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const found = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          found?.color || "bg-gray-100 text-gray-700"
        }`}
      >
        {found?.label || status}
      </span>
    );
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
      {/* COLUMN 1: THREAD LIST */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-[#D90000]" size={20} />
              <h1 className="font-extrabold text-slate-900 text-base">
                Chat & Hồ sơ Online
              </h1>
            </div>
            <Button
              size="sm"
              onClick={() => setShowNewChatModal(true)}
              className="h-8 px-2.5 bg-[#D90000] hover:bg-red-800 text-white text-xs font-bold gap-1"
            >
              <Plus size={14} /> Tạo Chat
            </Button>
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, SĐT ứng viên..."
              className="pl-9 h-9 text-xs bg-slate-50"
            />
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setFilterTab("ALL")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                filterTab === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({threads.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("UNREAD")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                filterTab === "UNREAD"
                  ? "bg-[#D90000] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Chưa đọc (
              {threads.reduce((acc, t) => acc + (t.unreadByAdmin > 0 ? 1 : 0), 0)}
              )
            </button>
          </div>
        </div>

        {/* Thread Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingInitial && threads.length === 0 ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Chưa có cuộc trò chuyện nào.
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isSelected = thread.roomId === selectedRoomId;
              return (
                <button
                  key={thread.roomId}
                  type="button"
                  onClick={() => handleSelectRoom(thread.roomId)}
                  className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                    isSelected
                      ? "bg-red-50/90 border-l-4 border-l-[#D90000]"
                      : "hover:bg-white"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? "bg-[#D90000] text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {thread.candidateName.charAt(0).toUpperCase()}
                    </div>
                    {thread.unreadByAdmin > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#D90000] text-white font-black text-[10px] flex items-center justify-center shadow">
                        {thread.unreadByAdmin}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-xs text-slate-900 truncate">
                        {thread.candidateName}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(thread.lastMessageAt).toLocaleTimeString(
                          "vi-VN",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-mono text-slate-500">
                        {thread.candidatePhone}
                      </span>
                      {getStatusBadge(thread.latestStatus)}
                    </div>
                    <p
                      className={`text-xs mt-1 truncate ${
                        thread.unreadByAdmin > 0
                          ? "font-bold text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {thread.lastSender === "admin"
                        ? "Bạn: "
                        : thread.lastSender === "bot"
                          ? "🤖 Tự động: "
                          : ""}
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMN 2: ACTIVE CHAT WINDOW */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {!selectedRoomId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <MessageSquare size={42} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">
              Chọn một ứng viên bên trái để bắt đầu trò chuyện & xem Hồ sơ Online
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D90000] text-white font-bold flex items-center justify-center">
                  {activeCandidateName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      {activeCandidateName}
                    </h2>
                    {activeApps[0] && getStatusBadge(activeApps[0].status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Phone size={12} /> {selectedRoomId}
                    </span>
                    <a
                      href={`https://zalo.me/${selectedRoomId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5"
                    >
                      Mở Zalo <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons right in Chat Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  size="sm"
                  variant={showInviteBox ? "default" : "outline"}
                  onClick={() => setShowInviteBox((prev) => !prev)}
                  className={`h-8 text-xs font-bold gap-1.5 ${
                    showInviteBox
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  <Calendar size={14} />
                  Gửi lịch phỏng vấn
                </Button>

                <select
                  value={activeApps[0]?.status || ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleQuickStatusChange(e.target.value);
                    }
                  }}
                  className="h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">⚡ Đổi trạng thái hồ sơ nhanh...</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st.value} value={st.value}>
                      Chuyển sang: {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collapsible Interview Invite Sender */}
            {showInviteBox && (
              <form
                onSubmit={handleSendInterviewInvite}
                className="p-4 bg-amber-50 border-b border-amber-200 space-y-3 shrink-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-amber-950 flex items-center gap-1.5">
                    <Calendar size={14} className="text-red-600" />
                    Đặt lịch hẹn phỏng vấn & Gửi thông báo vào khung Chat
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowInviteBox(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Đóng
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Ngày phỏng vấn
                    </label>
                    <input
                      type="date"
                      required
                      value={inviteDate}
                      onChange={(e) => setInviteDate(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-amber-300 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Giờ phỏng vấn
                    </label>
                    <input
                      type="time"
                      required
                      value={inviteTime}
                      onChange={(e) => setInviteTime(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-amber-300 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Giấy tờ cần mang
                    </label>
                    <input
                      type="text"
                      value={inviteDocs}
                      onChange={(e) => setInviteDocs(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-amber-300 bg-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Địa điểm phỏng vấn (Chọn nhanh hoặc tự nhập)
                  </label>
                  <select
                    value={inviteLocation}
                    onChange={(e) => setInviteLocation(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-amber-300 bg-white text-xs mb-1.5"
                  >
                    {INTERVIEW_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={inviteLocation}
                    onChange={(e) => setInviteLocation(e.target.value)}
                    placeholder="Hoặc nhập địa chỉ phỏng vấn tùy chỉnh..."
                    className="w-full h-9 px-2.5 rounded-lg border border-amber-300 bg-white text-xs"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={sending}
                    size="sm"
                    className="bg-[#D90000] hover:bg-red-800 text-white text-xs font-bold"
                  >
                    Gửi Thư mời Phỏng vấn & Chuyển trạng thái
                  </Button>
                </div>
              </form>
            )}

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                const isBot = msg.sender === "bot";

                if (msg.type === "interview_invite" && msg.metadata) {
                  return (
                    <div
                      key={msg.id}
                      className="max-w-md ml-auto bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 text-xs space-y-1.5 shadow-xs"
                    >
                      <div className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Calendar size={15} className="text-red-600" />
                        THƯ MỜI PHỎNG VẤN ĐÃ GỬI ỨNG VIÊN
                      </div>
                      <p>
                        <strong>Thời gian:</strong> {msg.metadata.interviewTime}{" "}
                        ngày {msg.metadata.interviewDate}
                      </p>
                      <p>
                        <strong>Địa điểm:</strong>{" "}
                        {msg.metadata.interviewLocation}
                      </p>
                      <p>
                        <strong>Giấy tờ:</strong> {msg.metadata.documents}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isAdmin || isBot ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                      {isAdmin
                        ? `👩‍💼 ${msg.senderName}`
                        : isBot
                          ? "🤖 Trợ lý tự động AGARI"
                          : `👤 ${msg.candidateName} (${msg.candidatePhone})`}{" "}
                      •{" "}
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                        isAdmin
                          ? "bg-[#D90000] text-white rounded-br-xs"
                          : isBot
                            ? "bg-amber-50 text-slate-800 border border-amber-200 rounded-br-xs"
                            : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* HR Quick Templates */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {HR_QUICK_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendText(tpl)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-[11px] font-medium whitespace-nowrap transition shrink-0"
                >
                  💬 Mẫu {idx + 1}: {tpl.slice(0, 42)}...
                </button>
              ))}
            </div>

            {/* Message Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendText();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Nhắn tin trực tiếp cho ${activeCandidateName}...`}
                className="flex-1 h-10 text-xs"
              />
              <Button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="h-10 px-4 bg-[#D90000] hover:bg-red-800 text-white font-bold text-xs gap-1.5"
              >
                {sending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Gửi
              </Button>
            </form>
          </>
        )}
      </div>

      {/* COLUMN 3: ATTACHED CANDIDATE ONLINE PROFILE & APPLICATIONS */}
      {selectedRoomId && (
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-yellow-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                Hồ sơ Ứng viên đính kèm
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setProfileDraft(
                  activeProfile || {
                    fullName: activeCandidateName,
                    phone: selectedRoomId,
                  },
                );
                setEditingProfile((prev) => !prev);
              }}
              className="text-xs text-yellow-300 hover:underline font-semibold"
            >
              {editingProfile ? "Hủy sửa" : "Sửa / Lưu Hồ sơ"}
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Online Profile Details or Edit Form */}
            {editingProfile ? (
              <form
                onSubmit={handleSaveOnlineProfileFromAdmin}
                className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Họ và tên
                  </label>
                  <Input
                    value={profileDraft.fullName || ""}
                    onChange={(e) =>
                      setProfileDraft({
                        ...profileDraft,
                        fullName: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Số CCCD
                    </label>
                    <Input
                      value={profileDraft.cccd || ""}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          cccd: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Ngày sinh
                    </label>
                    <Input
                      type="date"
                      value={profileDraft.dateOfBirth || ""}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Giới tính
                    </label>
                    <select
                      value={profileDraft.gender || "Nam"}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          gender: e.target.value,
                        })
                      }
                      className="w-full h-8 px-2 rounded border border-slate-300 bg-white text-xs"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Mã Ops
                    </label>
                    <Input
                      value={profileDraft.opsCode || ""}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          opsCode: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Địa chỉ
                  </label>
                  <Input
                    value={profileDraft.permanentAddress || ""}
                    onChange={(e) =>
                      setProfileDraft({
                        ...profileDraft,
                        permanentAddress: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Khu vực mong muốn
                  </label>
                  <Input
                    value={profileDraft.preferredLocation || ""}
                    onChange={(e) =>
                      setProfileDraft({
                        ...profileDraft,
                        preferredLocation: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={savingProfile}
                  size="sm"
                  className="w-full bg-[#D90000] hover:bg-red-800 text-white text-xs font-bold gap-1"
                >
                  {savingProfile ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Lưu Hồ sơ Online
                </Button>
              </form>
            ) : activeProfile ? (
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {activeProfile.fullName}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold">
                    {activeProfile.profileId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Số điện thoại Zalo
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {activeProfile.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Số CCCD
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCccd((prev) => !prev)}
                      className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 hover:text-red-700"
                    >
                      {activeProfile.cccd
                        ? showCccd
                          ? activeProfile.cccd
                          : `********${activeProfile.cccd.slice(-4)}`
                        : "Chưa cập nhật"}
                      {activeProfile.cccd &&
                        (showCccd ? <EyeOff size={12} /> : <Eye size={12} />)}
                    </button>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Ngày sinh / Giới tính
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeProfile.dateOfBirth || "-"} •{" "}
                      {activeProfile.gender || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Mã Ops / Học vấn
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeProfile.opsCode || "Mới"} •{" "}
                      {activeProfile.education || "-"}
                    </span>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-200/70 space-y-1">
                  <p>
                    <span className="text-slate-400">Địa chỉ: </span>
                    <span className="font-medium text-slate-800">
                      {activeProfile.permanentAddress || "Chưa cập nhật"}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Khu vực mong muốn: </span>
                    <span className="font-medium text-slate-800">
                      {activeProfile.preferredLocation || "Chưa cập nhật"}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Kinh nghiệm: </span>
                    <span className="font-medium text-slate-800">
                      {activeProfile.preferredShift || "Chưa cập nhật"}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">Ngày nhận việc: </span>
                    <span className="font-medium text-slate-800">
                      {activeProfile.availableStartDate || "Sẵn sàng đi làm ngay"}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                <p className="font-bold">
                  Ứng viên này mới nhắn tin, chưa điền biểu mẫu Hồ sơ Online.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setProfileDraft({
                      fullName: activeCandidateName,
                      phone: selectedRoomId,
                      gender: "Nam",
                      education: "12/12",
                    });
                    setEditingProfile(true);
                  }}
                  className="w-full bg-[#D90000] hover:bg-red-800 text-white text-xs font-bold"
                >
                  + Tạo nhanh Hồ sơ Online cho ứng viên
                </Button>
              </div>
            )}

            {/* Submitted Job Applications List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
                  <FileText size={14} className="text-red-600" />
                  Đơn ứng tuyển đã nộp ({activeApps.length})
                </h4>
              </div>

              {activeApps.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Chưa có đơn ứng tuyển trong các Sheet khu vực.
                </p>
              ) : (
                activeApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-red-700">
                        {app.applicationId}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="font-bold text-slate-900">{app.jobTitle}</p>
                    {app.preferredLocation && (
                      <p className="text-slate-600 flex items-start gap-1">
                        <MapPin
                          size={12}
                          className="text-red-600 shrink-0 mt-0.5"
                        />
                        <span>{app.preferredLocation}</span>
                      </p>
                    )}
                    {app.workSchedule && (
                      <p className="text-slate-600 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{app.workSchedule}</span>
                      </p>
                    )}
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-200/80">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            e.target.value,
                            app.applicationId,
                          )
                        }
                        className="h-7 px-2 rounded border border-slate-300 bg-white text-[11px] font-semibold"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                      <Link
                        href={`/admin/applications/${encodeURIComponent(app.id)}`}
                        className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-0.5"
                      >
                        Chi tiết <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Start New Chat */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Sparkles size={16} className="text-red-600" />
                Bắt đầu cuộc trò chuyện với ứng viên
              </h3>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Đóng
              </button>
            </div>
            <form onSubmit={handleStartNewChat} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Họ và tên ứng viên *
                </label>
                <Input
                  required
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số điện thoại Zalo *
                </label>
                <Input
                  required
                  value={newChatPhone}
                  onChange={(e) => setNewChatPhone(e.target.value)}
                  placeholder="VD: 0901234567"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewChatModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#D90000] hover:bg-red-800 text-white font-bold"
                >
                  Mở phòng Chat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
