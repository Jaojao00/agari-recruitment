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
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const shifts = [
  {
    name: "Ca 8 tiếng Ngày",
    time: "8 tiếng ban ngày",
    pay: "300.000 VNĐ / Ca",
    color: "bg-amber-50 border-amber-200",
  },
  {
    name: "Ca 8 tiếng Đêm",
    time: "8 tiếng ban đêm",
    pay: "350.000 VNĐ / Ca",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    name: "Ca 12 tiếng Ngày",
    time: "08:00 – 20:00",
    pay: "435.000 VNĐ / Ca",
    color: "bg-orange-50 border-orange-200",
  },
  {
    name: "Ca 12 tiếng Đêm",
    time: "20:00 – 08:00",
    pay: "500.000 VNĐ / Ca",
    color: "bg-red-50 border-red-200",
  },
];

export default function TechLinkQuan7Page() {
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
            AGARI × TECH-LINK • KCX TÂN THUẬN, Q.7
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section
          className="relative min-h-[480px] overflow-hidden rounded-3xl bg-slate-900 bg-cover bg-center text-white shadow-xl md:min-h-[540px]"
          style={{ backgroundImage: "url('/tech-link-factory.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/75 to-slate-950/60" />
          <div className="relative flex min-h-[480px] items-center px-6 py-10 md:min-h-[540px] md:px-12 md:py-16">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-950 shadow-md">
                  Dự án mới • AGARI × TECH-LINK
                </span>
                <span className="inline-flex rounded-full bg-emerald-400 border border-emerald-500 px-3 py-1 text-xs font-black uppercase text-emerald-950 shadow-md">
                  🔥 TUYỂN GẤP - BAO CƠM - ĐI LÀM NGAY
                </span>
              </div>
              <h1 className="max-w-3xl text-3xl font-black uppercase leading-[1.08] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] md:text-5xl">
                Nhân viên Sản xuất / Kho
                <span className="mt-2 block text-yellow-300">
                  TECH LINK – KCX Tân Thuận, Q.7
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-red-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-lg">
                Bao cơm theo ca • Nhận lương tuần uy tín vào Thứ 6 hàng tuần • Nghỉ 1 tiếng 30 phút/ca • Không yêu cầu kinh nghiệm, được hướng dẫn từ A–Z.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 shadow-sm">
                  <MapPin size={16} /> Số 05B-07A Đường Số 15, KCX Tân Thuận, Q.7, TP.HCM
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 shadow-sm">
                  <Clock3 size={16} /> 300.000 – 500.000 VNĐ / Ca
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thu nhập theo ca
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              300k – 500k
            </p>
            <p className="text-sm text-slate-500">VNĐ / Ca (Ca 8h & Ca 12h)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lịch trả lương
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Thứ 6 hàng tuần</p>
            <p className="text-sm text-slate-500">Thanh toán đều đặn, đúng hẹn</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Đãi ngộ nổi bật
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              Bao cơm theo ca
            </p>
            <p className="text-sm text-slate-500">Nghỉ 1h30p/ca (chia 2 lần)</p>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-8">
            {/* BẢNG LƯƠNG THEO CA */}
            <section className="overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-yellow-400 px-6 py-4 text-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-black">
                      MỨC LƯƠNG HẤP DẪN THEO CA
                    </h2>
                    <p className="text-xs font-bold text-red-900">
                      Nhận lương tuần uy tín vào Thứ 6 hàng tuần
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-black px-3.5 py-1.5 text-sm font-black text-yellow-300">
                  BAO CƠM THEO CA
                </span>
              </div>

              <div className="p-6 grid gap-4 sm:grid-cols-2">
                {shifts.map((s) => (
                  <div
                    key={s.name}
                    className={`rounded-xl border p-5 flex flex-col justify-between ${s.color}`}
                  >
                    <div>
                      <p className="font-extrabold text-slate-900 text-base">{s.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{s.time}</p>
                    </div>
                    <p className="mt-3 text-xl font-black text-red-700">{s.pay}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CHẾ ĐỘ ĐÃI NGỘ */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                  <Gift size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Chế độ đãi ngộ cực tốt
                  </p>
                  <h2 className="text-2xl font-bold">Quyền lợi khi đi làm</h2>
                </div>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-700">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={18} />
                  <span><strong>BAO CƠM</strong> theo ca làm việc.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={18} />
                  <span>Thời gian nghỉ ngơi thoải mái: Mỗi ca được nghỉ tổng cộng <strong>1 tiếng 30 phút</strong> (chia làm 2 lần nghỉ).</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={18} />
                  <span>Thanh toán lương đều đặn, đúng hẹn vào <strong>Thứ 6 hàng tuần</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={18} />
                  <span>Hồ sơ đơn giản: Chỉ cần CCCD photo (chi phí photo được công ty hoàn trả lại vào kỳ lương).</span>
                </li>
              </ul>
            </section>

            {/* MÔ TẢ CÔNG VIỆC */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <BriefcaseBusiness size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Mô tả công việc
                  </p>
                  <h2 className="text-2xl font-bold">Công việc tại kho Tech Link</h2>
                </div>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-700">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-red-600" size={18} />
                  Làm việc tại kho linh kiện ô tô, nhựa gia dụng: đóng gói, đổ khuôn, kiểm tra sản phẩm...
                </li>
                <li className="flex gap-3 font-semibold text-red-700">
                  <CheckCircle2 className="mt-1 shrink-0 text-red-600" size={18} />
                  Không yêu cầu kinh nghiệm, vào làm sẽ được hướng dẫn cụ thể từ A–Z.
                </li>
              </ul>
            </section>

            {/* YÊU CẦU & NỘI QUY */}
            <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <AlertTriangle className="text-yellow-400" />
                <h2 className="text-xl font-bold">Yêu cầu & Nội quy làm việc</h2>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-200">
                <li>
                  <strong className="text-yellow-300">Sức khỏe & Tác phong:</strong> Biết đọc, biết viết, không cận thị, chịu được môi trường nóng, đứng làm việc và đáp ứng được việc xoay ca.
                </li>
                <li>
                  <strong className="text-yellow-300">Trang phục & Kỷ luật:</strong> Mặc quần dài khi đi làm; không hút thuốc trong công ty; không mang điện thoại vào khu vực làm việc.
                </li>
                <li>
                  <strong className="text-yellow-300">Hồ sơ đi làm:</strong> Chỉ cần CCCD photo (Chi phí photo sẽ được công ty hoàn trả lại vào kỳ lương).
                </li>
                <li>
                  <strong className="text-yellow-300">Điều kiện nhận lương:</strong> Có tài khoản VNeID mức 2 và SMS chính chủ.
                </li>
              </ul>
            </section>
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            {/* POSTER TUYỂN DỤNG CHÍNH THỨC */}
            <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-md">
              <img
                src="/tech-link-poster.jpg"
                alt="Poster tuyển dụng AGARI Tech Link KCX Tân Thuận Quận 7"
                className="w-full h-auto object-cover"
              />
            </section>

            {/* ĐỊA ĐIỂM LÀM VIỆC */}
            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700" />
                <h2 className="text-xl font-bold">Địa điểm làm việc</h2>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-red-200">
                <p className="font-bold text-red-700 text-sm">
                  📍 Công ty Tech Link (TECH-LINK SILICONES VN)
                </p>
                <p className="text-sm text-slate-700 mt-1 leading-6">
                  Số 05B-07A Đường Số 15, Khu Chế Xuất Tân Thuận, Quận 7, TP.HCM.
                </p>
                <a
                  href="https://maps.app.goo.gl/ZnSUhrRePnwTKrEH8?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline"
                >
                  <MapPin size={14} /> Mở Google Maps chỉ đường →
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-700">
                <ShieldCheck size={17} /> Bao cơm theo ca • Lương tuần Thứ 6
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
              Nhân viên Sản xuất / Kho Tech Link – KCX Tân Thuận, Q.7
            </span>
            <span className="ml-2 text-red-700 font-bold">
              300k – 500k/Ca • Bao cơm • Lương tuần Thứ 6
            </span>
          </div>
          <Link
            href="/ung-tuyen?job=tech-link-quan-7"
            className="ml-auto w-full md:w-auto"
          >
            <Button className="h-12 w-full bg-[#d90012] px-8 font-bold text-white hover:bg-red-800 md:w-auto">
              ỨNG TUYỂN NGAY (ĐI LÀM NGAY)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
