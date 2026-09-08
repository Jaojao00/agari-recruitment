"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const shifts = [
  ["06:00 - 15:00", "230.000 VNĐ/ca"],
  ["13:00 - 22:00", "230.000 VNĐ/ca"],
  ["22:00 - 06:00 · Ca đêm", "280.000 VNĐ/ca"],
  ["18:00 - 22:00 · 4 tiếng", "125.000 VNĐ/ca"],
  ["06:00 - 11:00 · 5 tiếng", "155.000 VNĐ/ca"],
];

export default function AgariPartTimePage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] pb-28 text-slate-900">
      <header className="border-b border-red-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700"
          >
            <ArrowLeft size={17} /> Về trang tuyển dụng
          </Link>
          <span className="text-right text-sm font-black uppercase tracking-tight text-[#d90012] md:text-base">
            AGARI - TUYỂN DỤNG KV MIỀN TÂY
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="relative overflow-hidden rounded-3xl bg-[#e32620] px-6 py-12 text-white shadow-xl md:px-12 md:py-16">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[26px] border-yellow-400/30" />
          <div className="relative max-w-3xl">
            <p className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-red-900">
              Ưu tiên người đi làm ngay
            </p>
            <h1 className="mt-5 text-4xl font-black uppercase leading-tight md:text-6xl">
              Lao động phổ thông{" "}
              <span className="block text-yellow-300">Part-time</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-red-50 md:text-lg">
              Đăng ký lịch làm việc linh hoạt theo tuần, công việc đơn giản và
              được quản lý hướng dẫn từ A-Z.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2">
                <MapPin size={16} /> KCN Bình Minh, Vĩnh Long
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2">
                <Clock3 size={16} /> Nhận lương vào thứ 6
              </span>
            </div>
          </div>
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thu nhập theo ca
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              125.000 - 280.000
            </p>
            <p className="text-sm text-slate-500">VNĐ / ca</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lịch làm việc
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Linh hoạt</p>
            <p className="text-sm text-slate-500">đăng ký theo tuần</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Trả lương
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Thứ 6</p>
            <p className="text-sm text-slate-500">của tuần kế tiếp</p>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-700">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Thời gian & mức lương
                  </p>
                  <h2 className="text-2xl font-bold">
                    Chọn lịch phù hợp mỗi tuần
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {shifts.map(([time, pay]) => (
                  <div
                    key={time}
                    className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      Ca {time}
                    </span>
                    <span className="whitespace-nowrap font-black text-red-700">
                      {pay}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                  <Gift size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Chế độ lương hàng tuần
                  </p>
                  <h2 className="text-2xl font-bold">Cực kỳ uy tín</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm leading-6 text-slate-600">
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Chốt công làm việc từ Thứ 2 đến Chủ nhật hằng tuần.
                </p>
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Nhận lương đều đặn vào Thứ 6 tuần kế tiếp.
                </p>
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Mô tả công việc
                  </p>
                  <h2 className="text-2xl font-bold">Công việc đơn giản</h2>
                </div>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Hỗ trợ lên/xuống hàng hóa.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Quét mã đơn hàng và phân loại bưu kiện tại kho.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Không yêu cầu kinh nghiệm, vào làm được quản lý hướng dẫn từ
                  A-Z.
                </li>
              </ul>
            </section>
          </div>
          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <UserRound className="text-yellow-400" />
                <h2 className="text-xl font-bold">Yêu cầu đơn giản</h2>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-200">
                <li>Nam/Nữ từ 18 - 35 tuổi, sức khỏe tốt.</li>
                <li>Bắt buộc có CCCD gốc và VNeID mức 2.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700" />
                <h2 className="text-xl font-bold">Địa điểm làm việc</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Lô 01, kho số A01, KCN Bình Minh, Ấp Mỹ Lợi, Xã Mỹ Hoà, Tỉnh
                Vĩnh Long.
              </p>
              <a
                className="mt-4 block text-sm font-semibold text-red-700 hover:underline"
                href="https://maps.google.com/?cid=88199021133819884"
                target="_blank"
                rel="noreferrer"
              >
                Mở bản đồ KCN Bình Minh
              </a>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-700">
                <Phone size={17} /> Zalo: 0586.482.344 (Gặp Tài)
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1 md:px-6">
          <div className="hidden text-sm md:block">
            <span className="font-bold">Lao động phổ thông Part-time</span>
            <span className="ml-2 text-slate-500">KCN Bình Minh</span>
          </div>
          <Link
            href="/ung-tuyen?job=agari-part-time"
            className="ml-auto w-full md:w-auto"
          >
            <Button className="h-12 w-full bg-[#d90012] px-8 font-bold text-white hover:bg-red-800 md:w-auto">
              ĐĂNG KÝ ĐI LÀM
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
