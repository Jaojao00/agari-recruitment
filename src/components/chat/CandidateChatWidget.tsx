"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Calendar,
  MapPin,
  FileCheck2,
  UserCheck,
  FileText,
  Loader2,
  ChevronRight,
  LogOut,
} from "lucide-react";

export const CANDIDATE_STORAGE_KEY = "agari_candidate_profile";

interface StoredCandidateInfo {
  fullName: string;
  phone: string;
  cccd?: string;
  dateOfBirth?: string;
  gender?: string;
  opsCode?: string;
  permanentAddress?: string;
  preferredLocation?: string;
  education?: string;
  preferredShift?: string;
  workSchedule?: string;
  availableStartDate?: string;
  note?: string;
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

const QUICK_QUESTIONS = [
  { label: "💰 Mức lương & Phụ cấp", text: "Cho mình hỏi mức lương và phụ cấp các khu vực hiện tại?" },
  { label: "⏰ Ca làm việc", text: "Cho mình hỏi thời gian các ca làm việc tại kho SPX Express?" },
  { label: "📍 Địa chỉ phỏng vấn", text: "Cho mình xin địa chỉ phỏng vấn và làm việc tại các khu vực?" },
  { label: "🪪 Giấy tờ cần mang", text: "Đi phỏng vấn cần mang theo giấy tờ hồ sơ gì ạ?" },
  { label: "📋 Kiểm tra hồ sơ", text: "Kiểm tra trạng thái hồ sơ ứng tuyển của tôi" },
];

export default function CandidateChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [candidate, setCandidate] = useState<StoredCandidateInfo | null>(null);
  const [tempName, setTempName] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [startError, setStartError] = useState("");

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdminRoute = pathname?.startsWith("/admin");

  const loadStoredCandidate = useCallback(() => {
    try {
      const raw = localStorage.getItem(CANDIDATE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredCandidateInfo;
        if (parsed?.fullName && parsed?.phone) {
          setCandidate(parsed);
          setTempName(parsed.fullName);
          setTempPhone(parsed.phone);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadStoredCandidate();
    const handleStorageUpdate = () => loadStoredCandidate();
    const handleOpenChat = (event: Event) => {
      loadStoredCandidate();
      setIsOpen(true);
      const customEvent = event as CustomEvent<{ prefill?: string }>;
      if (customEvent.detail?.prefill) {
        setInputText(customEvent.detail.prefill);
      }
    };

    window.addEventListener("agari-profile-updated", handleStorageUpdate);
    window.addEventListener("open-agari-chat", handleOpenChat);
    return () => {
      window.removeEventListener("agari-profile-updated", handleStorageUpdate);
      window.removeEventListener("open-agari-chat", handleOpenChat);
    };
  }, [loadStoredCandidate]);

  const fetchMessages = useCallback(
    async (showLoader = false) => {
      if (!candidate?.phone || isAdminRoute) return;
      if (showLoader) setLoadingMessages(true);
      try {
        const res = await fetch(
          `/api/chat?roomId=${encodeURIComponent(candidate.phone)}&markRead=${isOpen ? "true" : "false"}`,
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setUnreadCount(isOpen ? 0 : data.unreadCount || 0);
        }
      } catch {
        // ignore network hiccup
      } finally {
        if (showLoader) setLoadingMessages(false);
      }
    },
    [candidate?.phone, isOpen, isAdminRoute],
  );

  useEffect(() => {
    if (!candidate?.phone || isAdminRoute) return;
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, isOpen ? 3500 : 8000);
    return () => clearInterval(interval);
  }, [candidate?.phone, isOpen, isAdminRoute, fetchMessages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isOpen]);

  if (isAdminRoute) {
    return null;
  }

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = tempName.trim();
    const cleanPhone = tempPhone.replace(/\D/g, "");
    if (cleanName.length < 2) {
      setStartError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!/^(0\d{9}|84\d{9})$/.test(cleanPhone)) {
      setStartError("Vui lòng nhập số điện thoại Zalo hợp lệ (10 số).");
      return;
    }
    setStartError("");

    const normalizedPhone = cleanPhone.startsWith("84")
      ? "0" + cleanPhone.slice(2)
      : cleanPhone;

    // Check if candidate already has an online profile or application in Google Sheets
    let mergedInfo: StoredCandidateInfo = {
      fullName: cleanName,
      phone: normalizedPhone,
    };

    try {
      const existingRaw = localStorage.getItem(CANDIDATE_STORAGE_KEY);
      if (existingRaw) {
        mergedInfo = { ...JSON.parse(existingRaw), ...mergedInfo };
      }
      const res = await fetch(
        `/api/candidate/profile?phone=${encodeURIComponent(normalizedPhone)}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          mergedInfo = {
            ...data.profile,
            fullName: cleanName || data.profile.fullName,
            phone: normalizedPhone,
          };
        }
      }
    } catch {
      // ignore
    }

    localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(mergedInfo));
    setCandidate(mergedInfo);
    window.dispatchEvent(new Event("agari-profile-updated"));
  };

  const handleSendMessage = async (textOverride?: string) => {
    const content = (textOverride ?? inputText).trim();
    if (!content || !candidate || sending) return;
    if (!textOverride) setInputText("");
    setSending(true);

    // Optimistic message
    const tempId = `TEMP-${Date.now()}`;
    const optimisticMsg: ChatMessageItem = {
      id: tempId,
      roomId: candidate.phone,
      candidateName: candidate.fullName,
      candidatePhone: candidate.phone,
      sender: "candidate",
      senderName: candidate.fullName,
      content,
      type: "text",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: candidate.fullName,
          candidatePhone: candidate.phone,
          content,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempId);
          const next = [...withoutTemp];
          if (data.message) next.push(data.message);
          if (data.botReply) next.push(data.botReply);
          return next;
        });
      }
    } catch {
      // fallback refresh
      await fetchMessages(false);
    } finally {
      setSending(false);
    }
  };

  const handleSwitchAccount = () => {
    setCandidate(null);
    setMessages([]);
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-red-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#D90000] to-[#FF3B30] px-4 py-3.5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-[#D90000] font-black flex items-center justify-center text-sm shadow">
                  AGARI
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#D90000] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  Chat Tuyển Dụng AGARI
                </h3>
                <p className="text-[11px] text-red-100 flex items-center gap-1">
                  <Sparkles size={11} /> Hỗ trợ trực tuyến 24/7 • Phản hồi nhanh
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {candidate && (
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  title="Đổi số điện thoại"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition"
                >
                  <LogOut size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Sub-banner linking to Online Profile */}
          <div className="bg-amber-50 border-b border-amber-200/70 px-3.5 py-2 flex items-center justify-between text-xs text-amber-950 shrink-0">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <FileText size={14} className="text-red-600 shrink-0" />
              <span className="truncate">
                {candidate
                  ? `Xin chào, ${candidate.fullName} (${candidate.phone})`
                  : "Lưu Hồ sơ Online để ứng tuyển 1 chạm!"}
              </span>
            </div>
            <Link
              href="/ho-so-online"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-0.5 font-bold text-red-700 hover:underline shrink-0 ml-2"
            >
              Hồ sơ Online <ChevronRight size={13} />
            </Link>
          </div>

          {/* Body */}
          {!candidate ? (
            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-center bg-slate-50/60">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 mx-auto">
                  <UserCheck size={26} />
                </div>
                <h4 className="font-bold text-gray-900 text-center text-base">
                  Bắt đầu trò chuyện cùng HR AGARI
                </h4>
                <p className="text-xs text-gray-500 text-center mt-1 mb-4">
                  Nhập Họ tên & SĐT Zalo để kết nối trực tiếp với Nhà tuyển dụng và tự động liên kết hồ sơ ứng tuyển của bạn.
                </p>

                {startError && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    {startError}
                  </div>
                )}

                <form onSubmit={handleStartChat} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Họ và tên của bạn *
                    </label>
                    <input
                      type="text"
                      required
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      placeholder="VD: 0901234567"
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#D90000] hover:bg-red-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} />
                    Bắt đầu Chat ngay
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Messages List */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50">
                {/* Welcome system card */}
                <div className="bg-white border border-red-100 rounded-xl p-3 text-xs text-gray-700 shadow-xs">
                  <p className="font-bold text-red-700 mb-1">
                    👋 Chào mừng {candidate.fullName} đến với kênh hỗ trợ trực tuyến AGARI!
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Bạn có thể nhắn tin trực tiếp cho Nhà tuyển dụng hoặc chọn các câu hỏi nhanh bên dưới để được giải đáp ngay lập tức.
                  </p>
                </div>

                {loadingMessages && messages.length === 0 ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === "candidate";
                    const isBot = msg.sender === "bot";

                    if (msg.type === "interview_invite" && msg.metadata) {
                      return (
                        <div
                          key={msg.id}
                          className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-3.5 shadow-sm text-xs space-y-2"
                        >
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                            <Calendar size={16} className="text-red-600 shrink-0" />
                            <span>THƯ MỜI PHỎNG VẤN TRỰC TIẾP</span>
                          </div>
                          {msg.metadata.jobTitle && (
                            <p className="font-semibold text-gray-800">
                              Vị trí: {msg.metadata.jobTitle}
                            </p>
                          )}
                          <div className="bg-white/90 rounded-lg p-2.5 space-y-1.5 border border-amber-200 text-gray-700">
                            <p>
                              ⏰ <strong>Thời gian:</strong>{" "}
                              <span className="text-red-700 font-bold">
                                {msg.metadata.interviewTime || "09:00"} - Ngày{" "}
                                {msg.metadata.interviewDate}
                              </span>
                            </p>
                            <p className="flex items-start gap-1">
                              <MapPin size={13} className="text-red-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>Địa điểm:</strong>{" "}
                                {msg.metadata.interviewLocation}
                              </span>
                            </p>
                            <p>
                              🪪 <strong>Cần mang theo:</strong>{" "}
                              {msg.metadata.documents || "CCCD gắn chip bản gốc"}
                            </p>
                          </div>
                          <div className="text-[10px] text-gray-500 text-right">
                            {msg.senderName} • {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      );
                    }

                    if (msg.type === "status_update" && msg.metadata) {
                      return (
                        <div
                          key={msg.id}
                          className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 shadow-xs"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                            <FileCheck2 size={15} className="text-emerald-600" />
                            <span>CẬP NHẬT TRẠNG THÁI HỒ SƠ</span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">
                            {msg.content}
                          </p>
                          <div className="text-[10px] text-gray-500 text-right">
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] text-gray-400 mb-0.5 px-1">
                          {isMe
                            ? "Bạn"
                            : isBot
                              ? "🤖 Trợ lý AGARI"
                              : `👩‍💼 ${msg.senderName || "Nhà tuyển dụng AGARI"}`}{" "}
                          • {formatTime(msg.createdAt)}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                            isMe
                              ? "bg-[#D90000] text-white rounded-br-xs"
                              : isBot
                                ? "bg-white text-gray-800 border border-amber-200 rounded-bl-xs"
                                : "bg-white text-gray-900 border border-gray-200 rounded-bl-xs"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Question Chips */}
              <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    disabled={sending}
                    onClick={() => handleSendMessage(q.text)}
                    className="px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-medium whitespace-nowrap transition shrink-0"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn hỏi nhà tuyển dụng..."
                  className="flex-1 h-10 px-3.5 rounded-full bg-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="w-10 h-10 rounded-full bg-[#D90000] hover:bg-red-800 disabled:opacity-50 text-white flex items-center justify-center shrink-0 transition shadow-sm"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#D90000] to-[#FF3B30] hover:from-red-700 hover:to-red-600 text-white px-4 py-3 shadow-xl shadow-red-900/30 border-2 border-yellow-300 transition-all duration-200 hover:scale-105"
      >
        <div className="relative">
          <MessageCircle size={22} className="fill-white/20" />
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-yellow-400 text-red-950 font-black text-[11px] flex items-center justify-center shadow">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="text-left pr-1">
          <div className="text-xs font-extrabold uppercase tracking-wide leading-none">
            {isOpen ? "Đóng khung chat" : "Chat với Nhà tuyển dụng"}
          </div>
          <div className="text-[10px] text-yellow-200 font-medium leading-tight mt-0.5">
            Hỏi đáp & Nhận lịch phỏng vấn ngay
          </div>
        </div>
      </button>
    </div>
  );
}
