import Link from "next/link";
import { LiveRecruitmentStatsSection } from "@/components/social-proof/LiveRecruitmentProof";
import type { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  CheckCircle2,
  DollarSign,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-red-700 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="text-lg sm:text-2xl font-black tracking-tight shrink-0">AGARI</div>
            <Link
              href="/ho-so-online"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 hover:bg-yellow-300 text-red-950 font-extrabold text-[11px] sm:text-xs transition shadow-xs whitespace-nowrap"
            >
              ⚡ Hồ sơ Online
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#luong" className="hover:text-yellow-300 transition">
              Thu nhập
            </Link>
            <Link
              href="#quyen-loi"
              className="hover:text-yellow-300 transition"
            >
              Quyền lợi
            </Link>
            <Link href="#yeu-cau" className="hover:text-yellow-300 transition">
              Yêu cầu
            </Link>
            <Link
              href="#vi-tri-khac"
              className="hover:text-yellow-300 transition"
            >
              Vị trí khác
            </Link>
          </nav>
          <Link href="/ung-tuyen?job=tech-link-quan-7" className="shrink-0">
            <Button
              variant="secondary"
              className="bg-white text-red-700 hover:bg-gray-100 font-bold text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4 whitespace-nowrap"
            >
              Ứng tuyển ngay
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION - DỰ ÁN MỚI AGARI × TECH-LINK */}
      <section
        className="relative min-h-[540px] sm:min-h-[650px] overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat text-white md:min-h-[700px]"
        style={{ backgroundImage: "url('/tech-link-factory.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/88 via-red-900/75 to-slate-950/88"></div>
        <div className="container mx-auto px-4 py-10 sm:py-16 md:py-24 relative z-10 text-center flex flex-col items-center">
          <div className="mb-4 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-yellow-400/95 px-3.5 py-1 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wide text-red-950 shadow-lg">
            <span>🔥 DỰ ÁN MỚI • AGARI × TECH-LINK</span>
            <span className="hidden sm:inline">•</span>
            <span>KCX TÂN THUẬN, Q.7</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-3 sm:mb-4 drop-shadow-md leading-tight">
            Tuyển Gấp{" "}
            <span className="text-yellow-300 block md:inline mt-1 md:mt-0">
              Nhân Viên Sản Xuất / Kho
            </span>{" "}
            TECH LINK
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl font-medium mb-6 sm:mb-8 text-red-50 max-w-3xl leading-relaxed">
            Bao cơm theo ca • Nhận lương tuần uy tín vào Thứ 6 • Nghỉ 1h30p/ca • Đi làm ngay
          </p>

          <div className="bg-white text-red-700 rounded-full px-5 py-2.5 sm:px-8 sm:py-3.5 md:px-10 md:py-4 mb-7 sm:mb-10 shadow-xl border-4 border-yellow-300 transform -rotate-1 max-w-full">
            <p className="text-xl sm:text-3xl md:text-4xl font-black whitespace-nowrap">
              300.000 – 500.000{" "}
              <span className="text-sm sm:text-xl md:text-2xl text-gray-600">
                VNĐ / CA
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-4">
            <Link href="/ung-tuyen?job=tech-link-quan-7" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-red-900 font-black text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 rounded-full shadow-xl transition-transform hover:scale-105"
              >
                ỨNG TUYỂN TECH LINK NGAY
              </Button>
            </Link>
            <Link href="#chi-tiet" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-black/25 border-white text-white hover:bg-white/15 hover:text-white font-semibold text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 rounded-full transition"
              >
                XEM CHI TIẾT DỰ ÁN
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="vi-tri-khac"
        className="border-y border-red-100 bg-white py-12"
      >
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
                Vị trí đang tuyển
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                Cơ hội việc làm mới
              </h2>
            </div>
            <span className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 sm:block">
              Đang nhận hồ sơ
            </span>
          </div>

          <div className="grid gap-4 grid-cols-1">
          <LiveRecruitmentStatsSection />
            {/* Card DỰ ÁN MỚI: TECH LINK - KCX TÂN THUẬN, QUẬN 7 */}
            <article className="overflow-hidden rounded-2xl border-2 border-red-500 bg-gradient-to-r from-red-50/40 via-white to-amber-50/40 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl">
              <div className="grid md:grid-cols-[200px_1fr] md:items-stretch">
                <div
                  className="relative flex min-h-36 md:min-h-full items-center justify-center bg-slate-900 bg-cover bg-center p-6 text-center text-white"
                  style={{ backgroundImage: "url('/tech-link-factory.jpg')" }}
                >
                  <div className="absolute inset-0 bg-red-900/70" />
                  <div className="relative z-10">
                    <p className="text-2xl font-black italic tracking-tight">TECH-LINK</p>
                    <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">
                      KCX Tân Thuận · Q.7
                    </p>
                    <div className="mx-auto mt-3 h-1 w-12 bg-yellow-400" />
                  </div>
                </div>
                <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                          Dự án mới · Sản xuất / Kho · Quận 7, TP.HCM
                        </p>
                        <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-black uppercase text-white animate-pulse">
                          🔥 TUYỂN GẤP - BAO CƠM - LƯƠNG TUẦN THỨ 6
                        </span>
                      </div>
                      <h3 className="mt-1 text-xl font-bold text-gray-900">
                        Nhân viên Sản xuất / Kho TECH LINK (KCX Tân Thuận, Quận 7)
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        ⚡ Ca 8h: 300k–350k | Ca 12h: 435k–500k • Bao cơm theo ca • Nghỉ 1h30p/ca • Đi làm ngay
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Số 05B-07A Đường Số 15, Khu Chế Xuất Tân Thuận, Quận 7, TP.HCM
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-md bg-red-100 px-3 py-1.5 font-bold text-red-800">
                        300k – 500k VNĐ/Ca
                      </span>
                      <span className="rounded-md bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800">
                        Bao cơm theo ca
                      </span>
                      <span className="rounded-md bg-yellow-100 px-3 py-1.5 font-semibold text-yellow-900">
                        Lương tuần Thứ 6
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Chỉ cần CCCD photo
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:shrink-0 md:border-l md:border-red-100 md:pl-6 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-center">
                    <Link href="/viec-lam/tech-link-quan-7" className="w-full">
                      <Button variant="outline" className="w-full border-gray-300 font-bold text-gray-700 hover:bg-gray-50 md:min-w-[130px]">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                    <Link href="/ung-tuyen?job=tech-link-quan-7" className="w-full">
                      <Button className="w-full bg-red-700 font-bold text-white hover:bg-red-800 md:min-w-[130px]">
                        ỨNG TUYỂN
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card HCM 1: Quận Bình Tân, TP.HCM */}
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="grid md:grid-cols-[200px_1fr] md:items-stretch">
                <div className="flex min-h-32 md:min-h-full items-center justify-center bg-[#d90012] p-6 text-center text-white">
                  <div>
                    <p className="text-3xl font-black italic tracking-tight">SPX</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Express</p>
                    <div className="mx-auto mt-4 h-1 w-12 bg-yellow-400" />
                  </div>
                </div>
                <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                        Nhân viên chính thức · Khu vực TP.HCM
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-gray-900">
                        Nhân viên chính thức kho SPX-Express (Quận Bình Tân)
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        🔥 Đã có 186+ ứng viên đăng ký • Đang ưu tiên phỏng vấn nhận việc ngay
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM (Cùng 19 Hub TP.HCM)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-md bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                        10.5M - 12.5M VNĐ/tháng
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Xoay 5 ca linh hoạt
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Đóng BHXH đầy đủ
                      </span>
                      <span className="rounded-md bg-yellow-100 px-3 py-1.5 font-semibold text-yellow-800">
                        Hỗ trợ thử việc 500k/tháng
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:shrink-0 md:border-l md:border-gray-100 md:pl-6 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-center">
                    <Link href="/viec-lam/tp-ho-chi-minh" className="w-full">
                      <Button variant="outline" className="w-full border-gray-300 font-bold text-gray-700 hover:bg-gray-50 md:min-w-[130px]">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                    <Link href="/ung-tuyen?job=hcm-binh-tan" className="w-full">
                      <Button className="w-full bg-red-700 font-bold text-white hover:bg-red-800 md:min-w-[130px]">
                        ỨNG TUYỂN
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card HCM 2: Quận Tân Phú, TP.HCM */}
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="grid md:grid-cols-[200px_1fr] md:items-stretch">
                <div className="flex min-h-32 md:min-h-full items-center justify-center bg-[#d90012] p-6 text-center text-white">
                  <div>
                    <p className="text-3xl font-black italic tracking-tight">SPX</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Express</p>
                    <div className="mx-auto mt-4 h-1 w-12 bg-yellow-400" />
                  </div>
                </div>
                <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                        Nhân viên chính thức · Khu vực TP.HCM
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-gray-900">
                        Nhân viên chính thức kho SPX-Express (Quận Tân Phú)
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        🔥 Đã có 134+ ứng viên đăng ký • Đang ưu tiên phỏng vấn nhận việc ngay
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân / Quận Tân Phú, TP.HCM
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-md bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                        10.5M - 12.5M VNĐ/tháng
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Xoay 5 ca linh hoạt
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Đóng BHXH đầy đủ
                      </span>
                      <span className="rounded-md bg-yellow-100 px-3 py-1.5 font-semibold text-yellow-800">
                        Hỗ trợ thử việc 500k/tháng
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:shrink-0 md:border-l md:border-gray-100 md:pl-6 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-center">
                    <Link href="/viec-lam/tp-ho-chi-minh" className="w-full">
                      <Button variant="outline" className="w-full border-gray-300 font-bold text-gray-700 hover:bg-gray-50 md:min-w-[130px]">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                    <Link href="/ung-tuyen?job=hcm-tan-phu" className="w-full">
                      <Button className="w-full bg-red-700 font-bold text-white hover:bg-red-800 md:min-w-[130px]">
                        ỨNG TUYỂN
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3: Part-time Vĩnh Long (Bổ sung đầy đủ thông tin) */}
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="grid md:grid-cols-[200px_1fr] md:items-stretch">
                <div className="flex min-h-28 md:min-h-full items-center justify-center bg-[#d90012] p-5 md:p-6 text-center text-white">
                  <div>
                    <p className="text-3xl font-black italic tracking-tight">SPX</p>
                    <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Express</p>
                    <div className="mx-auto mt-3 h-1 w-12 bg-yellow-400" />
                  </div>
                </div>
                <div className="p-5 md:p-7 flex flex-col md:flex-row md:items-center gap-5 justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                          Part-time · Thời vụ linh hoạt · Vĩnh Long
                        </p>
                        <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-black uppercase text-emerald-900">
                          🔥 Đang mở tuyển • Lương tuần Thứ 6
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">
                        Lao động phổ thông / Nhân viên kho Part-time (SW SOC)
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        ⚡ 5 khung ca linh hoạt (Ca 4h–5h: 125k–155k | Ca 8h–9h: 250k–300k) • Tự do đăng ký lịch tuần • Không cần kinh nghiệm
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Lô 01, kho số A01, KCN Bình Minh, Ấp Mỹ Lợi, Xã Mỹ Hòa, Tỉnh Vĩnh Long
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                      <span className="rounded-md bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                        125.000 – 300.000 VNĐ/ca
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Đăng ký lịch tuần
                      </span>
                      <span className="rounded-md bg-yellow-100 px-3 py-1.5 font-semibold text-yellow-800">
                        Nhận lương Thứ 6
                      </span>
                      <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                        Hợp sinh viên & làm thêm
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 md:shrink-0 md:border-l md:border-gray-100 md:pl-6 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2.5 items-center">
                    <Link href="/viec-lam/agari-part-time" className="w-full">
                      <Button variant="outline" className="w-full border-gray-300 font-bold text-gray-700 hover:bg-gray-50 md:min-w-[130px]">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                    <Link href="/ung-tuyen?job=agari-part-time" className="w-full">
                      <Button className="w-full bg-red-700 font-bold text-white hover:bg-red-800 md:min-w-[130px]">
                        ỨNG TUYỂN
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Các vị trí tạm ngưng tuyển đã ẩn: Vĩnh Long Full-time BPO, Sóc Trăng S-BPO, Long Thới Cần Thơ, Đồng Tháp, Thốt Nốt */}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 flex-1" id="chi-tiet">
        {/* LƯƠNG & THƯỞNG SECTION - DỰ ÁN MỚI TECH LINK */}
        <section id="luong" className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-red-700 mb-3">
              Dự án trọng điểm • AGARI × TECH-LINK (KCX Tân Thuận, Q.7)
            </span>
            <h2 className="text-3xl font-bold text-gray-900 uppercase">
              Mức lương hấp dẫn theo ca (Lương tuần Thứ 6)
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 uppercase font-bold">
                  ☀️ Ca 8 tiếng Ngày
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-gray-900">
                  300.000
                  <span className="text-sm font-semibold text-gray-500 ml-1">
                    VNĐ / Ca
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Bao cơm theo ca • Nghỉ 1h30p</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-indigo-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 uppercase font-bold">
                  🌙 Ca 8 tiếng Đêm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-gray-900">
                  350.000
                  <span className="text-sm font-semibold text-gray-500 ml-1">
                    VNĐ / Ca
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Bao cơm theo ca • Nghỉ 1h30p</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 uppercase font-bold">
                  ☀️ Ca 12 tiếng Ngày (08:00–20:00)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-gray-900">
                  435.000
                  <span className="text-sm font-semibold text-gray-500 ml-1">
                    VNĐ / Ca
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Bao cơm theo ca • Nghỉ 1h30p</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-700 bg-red-50 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700 uppercase font-black">
                  🌙 Ca 12 tiếng Đêm (20:00–08:00)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-red-700">
                  500.000
                  <span className="text-sm font-semibold text-red-600 ml-1">
                    VNĐ / Ca
                  </span>
                </div>
                <p className="text-xs text-red-700/80 mt-1 font-medium">Thu nhập cao nhất • Lương tuần Thứ 6</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <DollarSign size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Nhận lương tuần Thứ 6
                </h4>
                <p className="text-gray-600 text-sm">
                  Thanh toán lương đều đặn, đúng hẹn vào Thứ 6 hàng tuần.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Bao cơm theo ca làm việc
                </h4>
                <p className="text-gray-600 text-sm">
                  Hỗ trợ bữa ăn đầy đủ tại công ty giúp tiết kiệm chi phí sinh hoạt.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Nghỉ 1 tiếng 30 phút / ca</h4>
                <p className="text-gray-600 text-sm">
                  Thời gian nghỉ ngơi thoải mái, chia làm 2 lần nghỉ trong mỗi ca.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-8 mb-16 items-start">
          {/* CỘT TRÁI: QUYỀN LỢI + YÊU CẦU & NỘI QUY + MÔ TẢ CÔNG VIỆC */}
          <div className="lg:col-span-7 space-y-8">
            <section id="quyen-loi">
              <h2 className="text-2xl font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                <ShieldCheck className="text-red-600" />
                Chế độ đãi ngộ & Mô tả công việc
              </h2>
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
                <ul className="space-y-3.5">
                  {[
                    "Làm việc tại kho linh kiện ô tô, nhựa gia dụng: đóng gói, đổ khuôn, kiểm tra sản phẩm...",
                    "Không yêu cầu kinh nghiệm, vào làm sẽ được hướng dẫn cụ thể từ A–Z.",
                    "BAO CƠM theo ca làm việc, nghỉ tổng cộng 1 tiếng 30 phút/ca (chia làm 2 lần nghỉ).",
                    "Thanh toán lương tuần uy tín, đều đặn vào Thứ 6 hàng tuần.",
                    "Hồ sơ đơn giản: Chỉ cần CCCD photo (chi phí photo được công ty hoàn trả vào kỳ lương).",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className="text-green-500 shrink-0 mt-0.5"
                        size={20}
                      />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="yeu-cau">
              <h2 className="text-2xl font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-red-600" />
                Yêu cầu & Nội quy làm việc
              </h2>
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="space-y-3.5">
                  {[
                    "Sức khỏe & Tác phong: Biết đọc, biết viết, không cận thị, chịu được môi trường nóng, đứng làm việc và đáp ứng được việc xoay ca.",
                    "Trang phục & Kỷ luật: Mặc quần dài khi đi làm; không hút thuốc trong công ty; không mang điện thoại vào khu vực làm việc.",
                    "Hồ sơ đi làm: Chỉ cần CCCD photo (Chi phí photo sẽ được công ty hoàn trả lại vào kỳ lương).",
                    "Điều kiện nhận lương: Có tài khoản VNeID mức 2 và SMS chính chủ.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    🕐 Khung ca làm việc tại Tech Link (Xoay ca):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-sm py-1 border-amber-300 bg-amber-50 text-amber-900">
                      Ca 8h Ngày: 300k
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1 border-indigo-300 bg-indigo-50 text-indigo-900">
                      Ca 8h Đêm: 350k
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1 border-orange-300 bg-orange-50 text-orange-900">
                      Ca 12h Ngày (08:00–20:00): 435k
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1 border-red-300 bg-red-50 text-red-900">
                      Ca 12h Đêm (20:00–08:00): 500k
                    </Badge>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* CỘT PHẢI: POSTER CHÍNH THỨC AGARI × TECH-LINK */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-red-100">
              <img
                src="/tech-link-poster.jpg"
                alt="Poster tuyển gấp Nhân viên Sản xuất / Kho Tech Link - KCX Tân Thuận Quận 7"
                className="w-full h-auto object-cover"
              />
              <div className="p-4 bg-red-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-bold text-red-900">
                  📞 Zalo hỗ trợ đi làm ngay: 0586.482.344 (Gặp Tài)
                </span>
                <Link href="/ung-tuyen?job=tech-link-quan-7">
                  <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white font-bold">
                    Đăng ký ngay →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ĐỊA ĐIỂM SECTION - TECH LINK KCX TÂN THUẬN, QUẬN 7 */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-16 flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-gray-900 text-white">
            <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
              <MapPin className="text-red-500" />
              Địa điểm làm việc (Tech Link)
            </h2>
            <p className="text-lg font-bold text-yellow-300 mb-2">
              Công ty Tech Link (TECH-LINK SILICONES VN)
            </p>
            <p className="text-base text-gray-300 leading-relaxed">
              Số 05B-07A Đường Số 15,
              <br />
              Khu Chế Xuất Tân Thuận,
              <br />
              Quận 7, TP. Hồ Chí Minh.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://maps.app.goo.gl/ZnSUhrRePnwTKrEH8?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-full transition"
              >
                <MapPin size={15} />
                Mở Google Maps chỉ đường
              </a>
              <Link href="/ung-tuyen?job=tech-link-quan-7">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-red-950 font-black rounded-full px-5">
                  Ứng tuyển ngay
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 h-72 md:h-auto relative min-h-[320px]">
            <iframe
              src="https://maps.google.com/maps?q=Tech+Link+Silicones+Khu+Che+Xuat+Tan+Thuan+Quan+7&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
            <a
              href="https://maps.app.goo.gl/ZnSUhrRePnwTKrEH8?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-full shadow-md hover:bg-gray-100 transition flex items-center gap-1 z-10"
            >
              <MapPin size={12} className="text-red-600" />
              Mở Google Maps
            </a>
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM CTA FOR MOBILE */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] md:hidden z-50">
        <Link href="/ung-tuyen?job=tech-link-quan-7">
          <Button
            size="lg"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-lg h-14 rounded-full"
          >
            ỨNG TUYỂN TECH LINK NGAY
          </Button>
        </Link>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 pb-24 md:pb-12 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-left">
            {/* Col 1: Brand */}
            <div>
              <div className="font-bold text-2xl text-white mb-3">AGARI</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hệ thống tuyển dụng nhân viên kho chuyên nghiệp.
                <br />
                KCN Bình Minh, Vĩnh Long.
              </p>
            </div>
            {/* Col 2: Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wide">
                Liên hệ ứng tuyển
              </h4>
              <div className="space-y-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61582154261026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm">Facebook AGARI</span>
                </a>
                <a
                  href="https://zalo.me/0586482344"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-300 transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.252 4.5c1.07 0 2.1.203 3.06.578a7.47 7.47 0 0 1 2.49 1.628 7.48 7.48 0 0 1 1.63 2.49c.374.96.578 1.99.578 3.06 0 1.07-.204 2.1-.578 3.06a7.48 7.48 0 0 1-1.63 2.49 7.47 7.47 0 0 1-2.49 1.628c-.96.375-1.99.578-3.06.578a7.56 7.56 0 0 1-3.298-.75l-3.432.906.92-3.36a7.47 7.47 0 0 1-.822-3.552c0-4.14 3.36-7.5 7.5-7.5l.132-.056z" />
                  </svg>
                  <span className="text-sm">Zalo: 0586 482 344</span>
                </a>
                <a
                  href="https://www.tiktok.com/@teamleader.project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                  <span className="text-sm">TikTok AGARI</span>
                </a>
                <a
                  href="mailto:em.nguyen@agari.com.vn"
                  className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M0 3v18h24V3H0zm21.518 2L12 13.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z" />
                  </svg>
                  <span className="text-sm">em.nguyen@agari.com.vn</span>
                </a>
              </div>
            </div>
            {/* Col 3: Quick links */}
            <div>
              <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wide">
                Nhanh tay ứng tuyển
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Điền form ứng tuyển online, chúng tôi sẽ liên hệ bạn sớm nhất!
              </p>
              <Link href="/ung-tuyen">
                <Button className="bg-red-700 hover:bg-red-600 text-white font-bold w-full">
                  ỨNG TUYỂN NGAY →
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p>
              © {new Date().getFullYear()} AGARI. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Temporary inline Badge component until we generate it or if it wasn't added properly
function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full ${variant === "outline" ? "border" : ""} px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
}
