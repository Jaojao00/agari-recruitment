import Link from "next/link";
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">AGARI</div>
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
          <Link href="/ung-tuyen">
            <Button
              variant="secondary"
              className="bg-white text-red-700 hover:bg-gray-100 font-bold"
            >
              Ứng tuyển ngay
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative min-h-[650px] overflow-hidden bg-red-900 bg-cover bg-center bg-no-repeat text-white md:min-h-[720px]"
        style={{ backgroundImage: "url('/mid-autumn-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-4 drop-shadow-md">
            Tuyển Dụng{" "}
            <span className="text-yellow-300 block md:inline mt-2 md:mt-0">
              Nhân Viên Kho
            </span>{" "}
            Chính Thức
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 text-red-50">
            Đãi ngộ tốt - Thu nhập hấp dẫn - Môi trường ổn định
          </p>

          <div className="bg-white text-red-700 rounded-full px-6 py-3 md:px-8 md:py-4 mb-10 shadow-lg border-4 border-yellow-300 transform -rotate-1">
            <p className="text-2xl md:text-4xl font-black">
              7.400.000 - 11.000.000{" "}
              <span className="text-lg md:text-2xl text-gray-600">
                VNĐ / THÁNG
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
            <Link href="/ung-tuyen" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold text-lg h-14 px-8 rounded-full shadow-xl transition-transform hover:scale-105"
              >
                ỨNG TUYỂN NGAY
              </Button>
            </Link>
            <Link href="#chi-tiet" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent border-white text-white hover:bg-white/10 hover:text-white font-semibold text-lg h-14 px-8 rounded-full transition"
              >
                XEM CHI TIẾT
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

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="grid md:grid-cols-[150px_1fr] md:items-stretch">
                <div className="flex min-h-44 items-center justify-center bg-[#d90012] p-6 text-center text-white">
                  <div>
                    <p className="text-4xl font-black italic tracking-tight">
                      SPX
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                      Express
                    </p>
                    <div className="mx-auto mt-5 h-1 w-12 bg-yellow-400" />
                  </div>
                </div>
                <div className="space-y-4 p-6 md:p-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                      Full-time · Chính thức
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl">
                      Nhân viên kho SPX
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      KCN Bình Minh, Vĩnh Long
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-md bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                      250.000 - 300.000 VNĐ/ca
                    </span>
                    <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                      3 ca cố định
                    </span>
                    <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                      Đủ BHXH, BHYT
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 p-6 md:col-span-2 md:p-7">
                  <Link
                    href="/viec-lam/spx-fulltime"
                    className="w-full md:w-auto"
                  >
                    <Button className="w-full bg-red-700 font-bold text-white hover:bg-red-800 md:min-w-40">
                      XEM CHI TIẾT
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="grid md:grid-cols-[150px_1fr] md:items-stretch">
                <div className="flex min-h-44 items-center justify-center bg-[#e32620] p-6 text-center text-white">
                  <div>
                    <p className="text-3xl font-black italic tracking-tight">
                      AGARI
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-yellow-300">
                      Part-time
                    </p>
                    <div className="mx-auto mt-5 h-1 w-12 bg-yellow-400" />
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                      Part-time · Linh hoạt
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900">
                      Lao động phổ thông
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      KCN Bình Minh, Vĩnh Long
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-md bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                      125.000 - 280.000 VNĐ/ca
                    </span>
                    <span className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">
                      Đăng ký lịch tuần
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 p-6 md:col-span-2">
                  <Link
                    href="/viec-lam/agari-part-time"
                    className="block w-full"
                  >
                    <Button className="w-full bg-red-700 font-bold text-white hover:bg-red-800">
                      XEM CHI TIẾT
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 flex-1" id="chi-tiet">
        {/* LƯƠNG & THƯỞNG SECTION */}
        <section id="luong" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">
              Thông tin thu nhập
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-t-4 border-t-red-600 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase font-semibold">
                  Lương cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  5.310.000
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    VNĐ
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase font-semibold">
                  Phụ cấp nơi ở
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  1.310.000
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    VNĐ
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-yellow-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase font-semibold">
                  Phụ cấp ăn uống
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  780.000
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    VNĐ
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-700 bg-red-50 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700 uppercase font-black">
                  Tổng lương cố định
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">
                  7.400.000
                  <span className="text-sm font-normal text-red-600 ml-1">
                    VNĐ
                  </span>
                </div>
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
                  Thưởng tháng đầu
                </h4>
                <p className="text-gray-600 text-sm">
                  500.000 VNĐ nếu đủ 26 công.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Thưởng hiệu suất
                </h4>
                <p className="text-gray-600 text-sm">
                  Lên đến 1.500.000 VNĐ/tháng.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Tăng ca</h4>
                <p className="text-gray-600 text-sm">
                  Trung bình khoảng 919.000 VNĐ, tùy thời gian thực tế.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* QUYỀN LỢI SECTION */}
          <section id="quyen-loi">
            <h2 className="text-2xl font-bold text-gray-900 uppercase mb-6 flex items-center gap-2">
              <ShieldCheck className="text-red-600" />
              Quyền lợi được hưởng
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <ul className="space-y-4">
                {[
                  "Hợp đồng lao động chính thức.",
                  "Tham gia đầy đủ BHXH, BHYT.",
                  "12 ngày phép năm.",
                  "Thưởng các ngày Lễ/Tết trong năm.",
                  "Lương tháng 13.",
                  "Cơ hội tăng thu nhập và thăng tiến.",
                  "Môi trường làm việc ổn định, chuyên nghiệp.",
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

          {/* YÊU CẦU SECTION */}
          <section id="yeu-cau">
            <h2 className="text-2xl font-bold text-gray-900 uppercase mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-red-600" />
              Yêu cầu công việc
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="space-y-3">
                {[
                  "Nam từ 18 đến 35 tuổi.",
                  "Trình độ Học vấn 9/12.",
                  "Có thể Xoay Ca được và sẵn sàng tăng ca khi cần.",
                  "Biết sử dụng điện thoại/Laptop/PDA để quét mã, xử lý đơn hàng.",
                  "Xoay ca được theo lịch công ty sắp xếp.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🕐 Thời gian làm việc – Xoay ca mỗi tuần:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm py-1">
                    Ca 1: 06:00 – 15:00
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    Ca 2: 13:00 – 22:00
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    Ca 3: 22:00 – 06:00
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">
                  * Xoay ca mỗi tuần theo lịch công ty sắp xếp.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* MÔ TẢ CÔNG VIỆC SECTION */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">
              🧰 Mô tả công việc
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <ul className="space-y-4">
              {[
                "Phân loại, sắp xếp hàng hóa trong kho.",
                "Tiếp nhận, kiểm tra, đóng gói đơn hàng.",
                "Kéo hàng, đổ bao, xử lý hàng hóa.",
                "Lên xuống hàng.",
                "Được đào tạo vào máy ASM để xử lý hàng hóa, scan hàng theo công việc được phân công.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-red-500 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ĐỊA ĐIỂM SECTION */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-16 flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-gray-900 text-white">
            <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
              <MapPin className="text-red-500" />
              Địa điểm làm việc
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Lô 01, kho số A01,
              <br />
              KCN Bình Minh,
              <br />
              Ấp Mỹ Lợi, Xã Mỹ Hoà,
              <br />
              Tỉnh Vĩnh Long.
            </p>
          </div>
          <div className="md:w-1/2 h-72 md:h-auto relative min-h-[300px]">
            <iframe
              src="https://maps.google.com/maps?q=L%C3%B4+01+kho+A01+KCN+B%C3%ACnh+Minh+V%C4%A9nh+Long&output=embed&z=15"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "300px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
            <a
              href="https://maps.app.goo.gl/xsjgyDtWg45hPfzD7"
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
        <Link href="/ung-tuyen">
          <Button
            size="lg"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-lg h-14 rounded-full"
          >
            ỨNG TUYỂN NGAY
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
