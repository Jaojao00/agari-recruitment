import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const shifts = [
  { name: "Ca 1", time: "08:00 - 17:00", note: "Giờ hành chính ban ngày", color: "blue" },
  { name: "Ca 2", time: "10:00 - 19:00", note: "Ca trưa - chiều tối", color: "green" },
];

export default function SocTrangPage() {
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
            AGARI - TUYỂN DỤNG SÓC TRĂNG (S-BPO)
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section
          className="relative min-h-[470px] overflow-hidden rounded-3xl bg-[#d90012] bg-cover bg-center text-white shadow-xl md:min-h-[540px]"
          style={{ backgroundImage: "url('/mid-autumn-bg.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/75 via-red-900/50 to-transparent" />
          <div className="relative flex min-h-[470px] items-center px-6 py-10 md:min-h-[540px] md:px-12 md:py-16">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-900 shadow-md">
                  Nhân viên chính thức (S-BPO) · SPX-Express
                </span>
                <span className="inline-flex rounded-full bg-emerald-400 border border-emerald-500 px-3 py-1 text-xs font-black uppercase text-emerald-950 shadow-md">
                  🔥 TUYỂN GẤP - ĐI LÀM NGAY
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-black uppercase leading-[1.05] tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)] md:text-6xl">
                Nhân viên kho SPX
                <span className="mt-2 block text-yellow-300">S-BPO · Sóc Trăng</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-lg">
                Ký hợp đồng lao động chính thức, đóng BHXH đầy đủ, tổng định mức thu nhập 8.300.000đ/tháng (thu nhập thực tế dự kiến 8.300.000 – 10.500.000 VNĐ/tháng). Không yêu cầu kinh nghiệm, được hướng dẫn bài bản từ đầu.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 shadow-sm">
                  <MapPin size={16} /> 06 Nam Kỳ Khởi Nghĩa, Phường Sóc Trăng
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 shadow-sm">
                  <Clock3 size={16} /> Ca 08:00 - 17:00 | 10:00 - 19:00
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Mức thu nhập dự kiến
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              8.3M - 10.5M
            </p>
            <p className="text-sm text-slate-500">VNĐ / tháng (Định mức 8.3M)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lương cơ bản
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">5.310.000</p>
            <p className="text-sm text-slate-500">VNĐ / tháng (Ký HĐLĐ, đủ BHXH)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thời gian làm việc
            </p>
            <p className="mt-2 text-xl font-black text-red-700">
              08:00-17:00 | 10:00-19:00
            </p>
            <p className="text-sm text-slate-500">2 khung ca ban ngày</p>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-yellow-400 px-6 py-4 text-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-black">
                      CHẾ ĐỘ THU NHẬP & PHỤ CẤP (S-BPO SÓC TRĂNG)
                    </h2>
                    <p className="text-xs font-bold text-red-900">
                      Tổng thu nhập định mức chưa tăng ca: 8.300.000đ / tháng
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-lg bg-black px-3.5 py-1.5 text-sm md:text-base font-black text-yellow-300">
                    8.3M - 10.5M VNĐ
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-sm md:text-base">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">1. Lương cơ bản</p>
                    <p className="text-xs text-slate-500 italic">Ký HĐLĐ chính thức, đóng BHXH đầy đủ</p>
                  </div>
                  <span className="font-extrabold text-red-700 text-lg whitespace-nowrap">
                    5.310.000 VNĐ
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">2. Phụ cấp nhà ở & xăng xe</p>
                    <p className="text-xs text-slate-500 italic">Hỗ trợ chi phí đi lại và sinh hoạt</p>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-lg whitespace-nowrap">
                    1.310.000 VNĐ
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">3. Phụ cấp tiền cơm</p>
                    <p className="text-xs text-slate-500 italic">Theo ngày công thực tế</p>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-lg whitespace-nowrap">
                    780.000 VNĐ
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">4. Phụ cấp KPI hiệu suất</p>
                    <p className="text-xs text-slate-500 italic">Đánh giá theo năng suất và hiệu quả công việc</p>
                  </div>
                  <span className="font-extrabold text-orange-600 text-lg whitespace-nowrap">
                    900.000 VNĐ
                  </span>
                </div>

                <div className="bg-red-50/80 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-red-200">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                      Thu nhập dự kiến thực tế
                    </p>
                    <p className="text-xs text-slate-600">
                      Tổng thu nhập định mức chưa tăng ca: 8.300.000đ/tháng
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-black text-red-700 whitespace-nowrap">
                      8.300.000 - 10.500.000 <span className="text-sm font-bold text-slate-700">VNĐ</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-700">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Thời gian làm việc
                  </p>
                  <h2 className="text-2xl font-bold">
                    2 khung ca làm việc ban ngày
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {shifts.map((shift) => (
                  <div
                    key={shift.name}
                    className={`rounded-xl border p-5 text-center ${
                      shift.color === "blue"
                        ? "border-blue-100 bg-blue-50"
                        : "border-green-100 bg-green-50"
                    }`}
                  >
                    <p className="font-bold text-slate-900">{shift.name}</p>
                    <p className="mt-2 text-xl font-black text-red-700">{shift.time}</p>
                    <p className="mt-2 text-xs text-slate-600">{shift.note}</p>
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
                    Mô tả công việc
                  </p>
                  <h2 className="text-2xl font-bold">Bạn sẽ làm gì?</h2>
                </div>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-red-600" size={18} />
                  Phân loại, sắp xếp hàng hóa vào các khu vực theo mã hàng quy định.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-red-600" size={18} />
                  Đổ bao hàng, kéo hàng, scan mã vạch và chốt bao hàng bàn giao.
                </li>
                <li className="flex gap-3 text-red-700 font-semibold">
                  <CheckCircle2 className="mt-1 shrink-0 text-red-600" size={18} />
                  Không yêu cầu kinh nghiệm, được hướng dẫn bài bản khi nhận việc.
                </li>
              </ul>
            </section>
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <UserRound className="text-yellow-400" />
                <h2 className="text-xl font-bold">Yêu cầu khi phỏng vấn</h2>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-200">
                <li className="font-bold text-yellow-300">
                  🪪 Mang theo CCCD gắn chip bản gốc khi tham gia phỏng vấn trực tiếp.
                </li>
                <li>Nam/Nữ sức khỏe tốt, trung thực, nhanh nhẹn, chăm chỉ.</li>
                <li>Không yêu cầu kinh nghiệm, nhận việc đi làm ngay (không mất phí).</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700" />
                <h2 className="text-xl font-bold">Địa chỉ phỏng vấn & làm việc</h2>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-red-200">
                <p className="font-bold text-red-700 text-sm">
                  📍 Kho SPX-Express Sóc Trăng
                </p>
                <p className="text-sm text-slate-700 mt-1 leading-6">
                  06 Nam Kỳ Khởi Nghĩa, Phường Sóc Trăng, Thành phố Cần Thơ, Sóc Trăng.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-700">
                <ShieldCheck size={17} /> Ký HĐLĐ chính thức & đóng BHXH đầy đủ
              </div>
              <div className="mt-4 pt-4 border-t border-red-200 flex items-center gap-2 text-sm font-bold text-red-700">
                <Phone size={17} /> Nhắn tin Zalo: 0586.482.344 (Gặp Tài)
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1 md:px-6">
          <div className="hidden text-sm md:block">
            <span className="font-bold text-slate-900">
              Nhân viên kho SPX-Express (S-BPO) – Sóc Trăng
            </span>
            <span className="ml-2 text-red-700 font-bold">
              8.3M - 10.5M VNĐ/tháng • 08:00-17:00 | 10:00-19:00
            </span>
          </div>
          <Link
            href="/ung-tuyen?job=soc-trang"
            className="ml-auto w-full md:w-auto"
          >
            <Button className="h-12 w-full bg-[#d90012] px-8 font-bold text-white hover:bg-red-800 md:w-auto">
              ỨNG TUYỂN NGAY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
