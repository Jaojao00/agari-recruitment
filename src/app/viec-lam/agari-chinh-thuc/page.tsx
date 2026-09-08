"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function AgariChinhThucPage() {
  const shifts = [
    { name: "Ca 1", time: "06:00 - 15:00", color: "blue" },
    { name: "Ca 2", time: "13:00 - 22:00", color: "green" },
    { name: "Ca 3", time: "22:00 - 06:00", color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5] pb-28 text-slate-900">
      <header className="border-b border-red-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-700"
          >
            <ArrowLeft size={17} />
            Về trang tuyển dụng
          </Link>
          <span className="text-right text-sm font-black uppercase tracking-tight text-[#d90012] md:text-base">
            AGARI - TUYỂN DỤNG KV MIỀN TÂY
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section
          className="relative min-h-[250px] sm:min-h-[350px] md:min-h-[470px] lg:min-h-[540px] overflow-hidden rounded-3xl bg-[#d90012] bg-contain bg-center bg-no-repeat text-white shadow-xl"
          style={{ backgroundImage: "url('/banner-chinh-thuc.png')" }}
        >
          {/* Using bg-contain instead of bg-cover to ensure the text in the banner isn't cropped, 
              but it might look weird if the aspect ratio doesn't match. 
              Usually banners like this are 16:9 or similar. Let's use bg-cover and center so it fills the box. */}
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thu nhập hấp dẫn
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              8.5M - 10.5M
            </p>
            <p className="text-sm font-medium text-slate-500">VNĐ / tháng</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lương cơ bản & Phụ cấp
            </p>
            <p className="mt-2 text-xl font-bold text-red-700">7.400.000đ</p>
            <p className="text-sm font-medium text-slate-500">LCB + Cơm + Nhà ở</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Phúc lợi
            </p>
            <p className="mt-2 text-xl font-bold text-red-700">
              Đầy đủ BHXH
            </p>
            <p className="text-sm font-medium text-slate-500">Lương tháng 13 & Quà Lễ Tết</p>
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
                    Ca làm việc
                  </p>
                  <h2 className="text-2xl font-bold">
                    Xoay ca luân phiên mỗi tuần
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {shifts.map((shift) => (
                  <div
                    key={shift.name}
                    className={`rounded-xl border p-4 text-center ${shift.color === "blue" ? "border-blue-100 bg-blue-50" : shift.color === "green" ? "border-green-100 bg-green-50" : "border-purple-100 bg-purple-50"}`}
                  >
                    <p className="font-bold text-slate-900">{shift.name}</p>
                    <p className="mt-2 text-sm text-slate-600">{shift.time}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-700">
                Lưu ý: Bắt buộc xoay ca theo sự sắp xếp của công ty và sẵn sàng tăng ca khi cần.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                  <Gift size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Quyền lợi chi tiết
                  </p>
                  <h2 className="text-2xl font-bold">
                    Đãi ngộ rõ ràng, ổn định
                  </h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Lương cơ bản: 4.960.000đ",
                  "Phụ cấp nhà ở & xăng: 1.660.000đ",
                  "Phụ cấp cơm: 780.000đ",
                  "Lương tháng 13 & quà Lễ, Tết đầy đủ",
                  "Đóng Bảo Hiểm Xã Hội (BHXH) đầy đủ theo quy định",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex gap-3 text-sm leading-6 text-slate-600 font-medium"
                  >
                    <CheckCircle2
                      className="mt-1 shrink-0 text-green-600"
                      size={18}
                    />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <BriefcaseBusiness size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Công việc
                  </p>
                  <h2 className="text-2xl font-bold">Bạn sẽ làm gì?</h2>
                </div>
              </div>
              <ul className="grid gap-4 text-sm leading-6 text-slate-600 md:grid-cols-2">
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Phân loại, sắp xếp hàng hóa trong kho.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Tiếp nhận, kiểm tra, đóng gói đơn hàng.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Lên/xuống hàng, kéo hàng, đổ bao và xử lý hàng hóa.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Được đào tạo vào máy ASM để xử lý hàng hóa, scan hàng theo sự phân công.
                </li>
              </ul>
            </section>
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <UserRound className="text-yellow-400" />
                <h2 className="text-xl font-bold">Yêu cầu ứng tuyển</h2>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-200">
                <li>Nam từ 18 đến 35 tuổi.</li>
                <li>Trình độ Học vấn: 9/12 trở lên.</li>
                <li>Biết sử dụng điện thoại/Laptop/PDA để quét mã, xử lý đơn hàng.</li>
                <li>Có thể Xoay Ca được và sẵn sàng tăng ca khi cần.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700" />
                <h2 className="text-xl font-bold">Địa điểm làm việc</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Lô B, KCN Bình Minh, Ấp Mỹ Lợi, Xã Mỹ Hòa, TX Bình Minh, Vĩnh Long (Ngay dưới chân cầu Cần Thơ).
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-700">
                <ShieldCheck size={17} /> Hợp đồng và bảo hiểm đầy đủ
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1 md:px-6">
          <div className="hidden text-sm md:block">
            <span className="font-bold text-slate-900">
              Nhân viên kho SPX Express - Chính thức
            </span>
            <span className="ml-2 text-slate-500">
              KCN Bình Minh, Vĩnh Long
            </span>
          </div>
          <Link
            href="/ung-tuyen?job=warehouse-rotating-shift"
            className="ml-auto w-full md:w-auto"
          >
            <Button className="h-12 w-full bg-[#d90012] px-8 font-bold text-white hover:bg-red-800 md:w-auto rounded-full text-lg md:text-base">
              ỨNG TUYỂN NGAY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}