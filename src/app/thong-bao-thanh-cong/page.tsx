"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, FileText } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");

  const handleOpenChat = () => {
    window.dispatchEvent(
      new CustomEvent("open-agari-chat", {
        detail: {
          prefill: applicationId
            ? `Chào HR AGARI, mình vừa đăng ký ứng tuyển thành công với mã hồ sơ ${applicationId}, nhờ HR kiểm tra và xếp lịch phỏng vấn giúp mình nhé!`
            : "",
        },
      }),
    );
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle size={48} />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase mb-4">
        Đăng ký ứng tuyển
        <br />
        <span className="text-red-700">thành công</span>
      </h1>

      {applicationId && (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Mã hồ sơ của bạn:</p>
          <p className="text-xl font-bold text-gray-900 tracking-wider">
            {applicationId}
          </p>
        </div>
      )}

      <p className="text-gray-600 mb-2">
        Hồ sơ của bạn đã được lưu trực tuyến trên hệ thống AGARI.
      </p>
      <p className="text-gray-600 mb-6 font-medium">
        Bạn có thể nhắn tin trực tiếp với Nhà tuyển dụng ngay trên web để nhận lịch phỏng vấn sớm nhất!
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleOpenChat}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#D90000] text-sm md:text-base font-bold text-white transition hover:bg-red-800 shadow-md"
        >
          <MessageCircle size={18} />
          CHAT NGAY VỚI NHÀ TUYỂN DỤNG
        </button>

        <Link
          href="/ho-so-online"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-sm md:text-base font-bold transition hover:bg-amber-200"
        >
          <FileText size={18} />
          QUẢN LÝ HỒ SƠ ONLINE & TRA CỨU
        </Link>

        <a
          href="https://zalo.me/g/sqjgbx906"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
        >
          THAM GIA GROUP ZALO
        </a>

        <Link href="/" className="block pt-1">
          <Button
            variant="outline"
            className="w-full h-12 text-base font-bold rounded-full"
          >
            VỀ TRANG CHỦ
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ThongBaoThanhCongPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center p-8">Đang tải...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
