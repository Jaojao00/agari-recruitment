"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Users,
  CheckCircle2,
  Flame,
  TrendingUp,
  MapPin,
  X,
  Clock,
} from "lucide-react";

interface RecentApplicant {
  name: string;
  maskedPhone: string;
  jobTitle: string;
  location: string;
  timeAgo: string;
}

const FALLBACK_APPLICANTS: RecentApplicant[] = [
  {
    name: "Nguyễn Minh Tuấn",
    maskedPhone: "0938***412",
    jobTitle: "Nhân viên Chính thức Kho SPX - Quận Bình Tân",
    location: "TP.HCM • 754/8 Tân Kỳ Tân Quý",
    timeAgo: "Vừa xong",
  },
  {
    name: "Trần Thị Mỹ Tiên",
    maskedPhone: "0386***905",
    jobTitle: "Nhân viên Kho SPX Full-time (BPO Cố định)",
    location: "KCN Bình Minh, Vĩnh Long",
    timeAgo: "1 phút trước",
  },
  {
    name: "Lê Hoàng Phúc",
    maskedPhone: "0774***218",
    jobTitle: "Nhân viên Chính thức Kho SPX - Quận Tân Phú",
    location: "TP.HCM • 549/32 Tân Kỳ Tân Quý",
    timeAgo: "2 phút trước",
  },
  {
    name: "Phạm Quốc Huy",
    maskedPhone: "0909***631",
    jobTitle: "Nhân viên Kho Full-time (BPO) - Thốt Nốt",
    location: "78-CTO Co Do 02 Hub, Cần Thơ",
    timeAgo: "3 phút trước",
  },
  {
    name: "Võ Thị Ngọc Hân",
    maskedPhone: "0868***154",
    jobTitle: "Nhân viên Kho Part-time (Thời vụ)",
    location: "KCN Bình Minh, Vĩnh Long",
    timeAgo: "4 phút trước",
  },
  {
    name: "Đặng Văn Khoa",
    maskedPhone: "0917***529",
    jobTitle: "Nhân viên Kho Thời vụ - Khu vực Đồng Tháp",
    location: "71-DTP Lap Vo 02 Hub, Đồng Tháp",
    timeAgo: "5 phút trước",
  },
  {
    name: "Huỳnh Gia Bảo",
    maskedPhone: "0359***840",
    jobTitle: "Nhân viên Chính thức Kho SPX - Quận Bình Tân",
    location: "TP.HCM • Binh Tan Binh Hung Hoa B Hub",
    timeAgo: "6 phút trước",
  },
];

export function LiveRecruitmentStatsSection() {
  const [onlineVisitors, setOnlineVisitors] = useState(29);
  const [totalRegistered, setTotalRegistered] = useState(1586);
  const [todayRegistered, setTodayRegistered] = useState(34);
  const [recentList, setRecentList] =
    useState<RecentApplicant[]>(FALLBACK_APPLICANTS);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    fetch("/api/public-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.totalApplications) setTotalRegistered(data.totalApplications);
        if (data.todayApplications) setTodayRegistered(data.todayApplications);
        if (
          Array.isArray(data.recentApplicants) &&
          data.recentApplicants.length > 0
        ) {
          setRecentList([...data.recentApplicants, ...FALLBACK_APPLICANTS]);
        }
      })
      .catch(() => {
        // use fallback
      });
  }, []);

  // Gentle live fluctuation of online visitor counter
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.min(48, Math.max(19, prev + delta));
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Rotate live ticker inside the banner every 4s
  useEffect(() => {
    const ticker = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentList.length);
    }, 4000);
    return () => clearInterval(ticker);
  }, [recentList.length]);

  const currentTicker = recentList[tickerIndex] || FALLBACK_APPLICANTS[0];

  return (
    <div className="w-full mb-4">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-100 overflow-hidden">
          {/* Top live ticker bar */}
          <div className="bg-gradient-to-r from-[#990000] via-[#D90000] to-[#b80000] px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-300/40 text-emerald-200 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                TRỰC TUYẾN
              </span>
              <span className="font-semibold text-yellow-200">
                Đang có <strong>{onlineVisitors} ứng viên</strong> truy cập & xem tin tuyển dụng lúc này
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-red-100 truncate max-w-md">
              <Flame size={14} className="text-yellow-300 shrink-0" />
              <span className="truncate">
                Mới nhất: <strong className="text-white">{currentTicker.name}</strong> ({currentTicker.maskedPhone}) vừa đăng ký{" "}
                <span className="text-yellow-300 font-semibold">
                  {currentTicker.jobTitle}
                </span>
              </span>
            </div>
          </div>

          {/* 4 Key Social Proof Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-4 md:p-5 bg-white">
            {/* Metric 1: Online Visitors */}
            <div className="p-2.5 md:px-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 relative">
                <Users size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                  {onlineVisitors} <span className="text-xs font-bold text-emerald-600">online</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Ứng viên đang xem việc
                </p>
              </div>
            </div>

            {/* Metric 2: Total Registered */}
            <div className="p-2.5 md:px-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-[#D90000] flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-[#D90000] leading-none">
                  {totalRegistered.toLocaleString("vi-VN")}+
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Hồ sơ ứng viên đã đăng ký
                </p>
              </div>
            </div>

            {/* Metric 3: Registered Today */}
            <div className="p-2.5 md:px-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                  +{todayRegistered}{" "}
                  <span className="text-xs font-bold text-amber-600">hôm nay</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Ứng viên nộp đơn trong ngày
                </p>
              </div>
            </div>

            {/* Metric 4: Fast Interview & Placement */}
            <div className="p-2.5 md:px-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                  99.2%
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Hỗ trợ xếp lịch PV trong ngày
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingApplicantNotification() {
  const pathname = usePathname();
  const [applicants, setApplicants] =
    useState<RecentApplicant[]>(FALLBACK_APPLICANTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;
    fetch("/api/public-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (
          data &&
          Array.isArray(data.recentApplicants) &&
          data.recentApplicants.length > 0
        ) {
          setApplicants([...data.recentApplicants, ...FALLBACK_APPLICANTS]);
        }
      })
      .catch(() => {
        // ignore
      });
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute || dismissed) return;

    // Show first notification after 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Cycle notifications every 14 seconds (visible for 6s, hidden for 8s)
    const cycleInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % applicants.length);
        setVisible(true);
      }, 2500);
    }, 13000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [isAdminRoute, dismissed, applicants.length]);

  if (isAdminRoute || dismissed || !visible) return null;

  const current = applicants[currentIndex] || FALLBACK_APPLICANTS[0];

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[310px] sm:max-w-xs bg-white/95 backdrop-blur-xs rounded-2xl shadow-xl border border-red-200 p-3.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        title="Ẩn thông báo"
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3 pr-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D90000] to-[#FF3B30] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
          {current.name.trim().split(" ").pop()?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700 uppercase">
              Vừa đăng ký ứng tuyển
            </span>
          </div>
          <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">
            {current.name}{" "}
            <span className="font-mono font-normal text-gray-500 text-[11px]">
              ({current.maskedPhone})
            </span>
          </p>
          <p className="text-[11px] font-semibold text-[#D90000] truncate mt-0.5">
            {current.jobTitle}
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
            <span className="inline-flex items-center gap-0.5 truncate">
              <MapPin size={10} className="text-red-500 shrink-0" />
              {current.location}
            </span>
            <span className="shrink-0 ml-2 font-medium text-gray-400">
              {current.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
