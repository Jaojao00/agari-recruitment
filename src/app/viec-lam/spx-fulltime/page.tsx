import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const shifts = [
  { name: "Ca 1", time: "06:00 - 15:00", pay: "250.000 VNĐ/ca", color: "blue" },
  {
    name: "Ca 2",
    time: "13:00 - 22:00",
    pay: "250.000 VNĐ/ca",
    color: "green",
  },
  {
    name: "Ca 3",
    time: "22:00 - 06:00",
    pay: "300.000 VNĐ/ca",
    color: "purple",
  },
];

export default function SpxFulltimePage() {
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
          <span className="text-xl font-black italic tracking-tight text-[#d90012]">
            SPX{" "}
            <span className="text-xs not-italic text-slate-500">EXPRESS</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="relative overflow-hidden rounded-3xl bg-[#d90012] px-6 py-10 text-white shadow-xl md:px-12 md:py-16">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-yellow-400/30" />
          <div className="absolute -bottom-28 right-32 h-60 w-60 rounded-full border-[18px] border-white/10" />
          <div className="relative max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-900">
              Cơ hội việc làm chính thức
            </p>
            <h1 className="max-w-3xl text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">
              Nhân viên kho SPX
              <span className="mt-2 block text-yellow-300">Full-time</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-red-50 md:text-lg">
              Làm việc ổn định tại KCN Bình Minh, đầy đủ hợp đồng, bảo hiểm và
              chính sách đãi ngộ rõ ràng.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <MapPin size={16} /> KCN Bình Minh, Vĩnh Long
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <BriefcaseBusiness size={16} /> Làm 26 công/tháng
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
              250.000 - 300.000
            </p>
            <p className="text-sm text-slate-500">VNĐ / ca</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thưởng chuyên cần
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">750.000</p>
            <p className="text-sm text-slate-500">VNĐ / tháng</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lịch trả lương
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              Ngày 05 & 20
            </p>
            <p className="text-sm text-slate-500">hàng tháng</p>
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
                    Chọn ca cố định phù hợp
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
                    <p className="mt-3 font-black text-red-700">{shift.pay}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-slate-500">
                Làm 26 công/tháng, được công ty sắp xếp lịch nghỉ 4 ngày.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                  <Gift size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Quyền lợi
                  </p>
                  <h2 className="text-2xl font-bold">
                    Đãi ngộ rõ ràng, ổn định
                  </h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Lãnh lương đều đặn 2 tuần 1 lần, vào ngày 05 và 20 hàng tháng.",
                  "Ký hợp đồng lao động, tham gia đầy đủ BHXH và BHYT.",
                  "Có lương tháng 13 theo chính sách công ty.",
                  "Môi trường làm việc chuyên nghiệp, có đào tạo khi nhận việc.",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
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
                  Lên/xuống hàng, kéo hàng, đổ bao và xử lý hàng hóa.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Phân loại, sắp xếp, tiếp nhận, kiểm tra và đóng gói đơn hàng.
                </li>
                <li className="flex gap-3 md:col-span-2">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Được đào tạo sử dụng máy ASM để xử lý và scan hàng hóa theo sự
                  phân công.
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
                <li>
                  Nam/Nữ từ 18 - 35 tuổi, sức khỏe tốt, chăm chỉ và nhanh nhẹn.
                </li>
                <li>Bắt buộc có CCCD gốc và ứng dụng VNeID mức 2.</li>
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
              Nhân viên kho SPX Full-time
            </span>
            <span className="ml-2 text-slate-500">
              KCN Bình Minh, Vĩnh Long
            </span>
          </div>
          <Link
            href="/ung-tuyen?job=spx-fulltime"
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
