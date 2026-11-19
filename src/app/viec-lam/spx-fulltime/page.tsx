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
  { name: "Ca 1 (Sáng)", time: "06:00 - 15:00", note: "Xoay ca theo lịch công ty", color: "blue" },
  {
    name: "Ca 2 (Chiều)",
    time: "13:00 - 22:00",
    note: "Xoay ca theo lịch công ty",
    color: "green",
  },
  {
    name: "Ca 3 (Đêm)",
    time: "22:00 - 06:00",
    note: "Có phụ cấp đêm 30% (8.654đ/giờ)",
    color: "purple",
  },
];

const overtimeRates = [
  { label: "Phụ cấp đêm", rate: "30%", amount: "8.654 VNĐ/giờ" },
  { label: "Tăng ca ngày thường giờ ngày", rate: "150%", amount: "43.269 VNĐ/giờ" },
  { label: "Tăng ca ngày thường giờ đêm", rate: "210%", amount: "60.577 VNĐ/giờ" },
  { label: "Tăng ca ngày nghỉ giờ ngày", rate: "200%", amount: "57.692 VNĐ/giờ" },
  { label: "Tăng ca ngày nghỉ giờ đêm", rate: "270%", amount: "77.885 VNĐ/giờ" },
  { label: "Tăng ca lễ ngày", rate: "300%", amount: "86.538 VNĐ/giờ" },
  { label: "Tăng ca lễ đêm", rate: "390%", amount: "112.500 VNĐ/giờ" },
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
          <span className="text-right text-sm font-black uppercase tracking-tight text-[#d90012] md:text-base">
            AGARI - TUYỂN DỤNG KV MIỀN TÂY
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section
          className="relative min-h-[470px] overflow-hidden rounded-3xl bg-[#d90012] bg-cover bg-center text-white shadow-xl md:min-h-[540px]"
          style={{ backgroundImage: "url('/mid-autumn-bg.webp')" }}
        >
          <div className="relative flex min-h-[470px] items-center px-6 py-10 md:min-h-[540px] md:px-12 md:py-16">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-900 shadow-md">
                  Cơ hội việc làm Full-time · BPO Xoay Ca
                </span>
                <span className="inline-flex rounded-full bg-amber-200 border border-amber-400 px-3 py-1 text-xs font-black uppercase text-amber-950 shadow-md">
                  ⚠️ TẠM NGƯNG TUYỂN DỤNG (ĐÃ ĐỦ CHỈ TIÊU)
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-black uppercase leading-[1.05] tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)] md:text-6xl">
                Nhân viên kho SPX
                <span className="mt-2 block text-yellow-300">Full-time · BPO Xoay Ca</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-red-100 md:text-lg">
                ⚠️ Thông báo: Hiện tại vị trí Full-time BPO tại kho SW SOC Vĩnh Long đã tuyển đủ chỉ tiêu và đang tạm ngưng nhận hồ sơ mới. Bạn có thể tham khảo vị trí Part-time tại Vĩnh Long hoặc ứng tuyển kho SPX tại TP.HCM.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-lg">
                Làm việc ổn định tại SW SOC - KCN Bình Minh, xoay ca theo yêu cầu công ty, đầy đủ hợp đồng, bảo hiểm và chế độ lương phụ cấp rõ ràng.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 shadow-sm">
                  <MapPin size={16} /> SW SOC - KCN Bình Minh, Vĩnh Long
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 shadow-sm">
                  <BriefcaseBusiness size={16} /> Xoay ca theo yêu cầu công ty
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Tổng thu nhập định mức
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              9.280.000
            </p>
            <p className="text-sm text-slate-500">VNĐ / tháng (chưa tính tăng ca & PC đêm)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lương cơ bản
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">6.000.000</p>
            <p className="text-sm text-slate-500">VNĐ / tháng (theo ngày công thực tế)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Chế độ ca làm việc
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              Xoay ca
            </p>
            <p className="text-sm text-slate-500">Theo yêu cầu & phân công công ty</p>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            {/* BẢNG CHẾ ĐỘ LƯƠNG & PHỤ CẤP - SPX BPO (SW SOC) */}
            <section className="overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-yellow-400 px-6 py-4 text-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-black">
                      CHẾ ĐỘ LƯƠNG & PHỤ CẤP (SW SOC)
                    </h2>
                    <p className="text-xs font-bold text-red-900">
                      SPX - BPO • Khu vực Miền Nam (South)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-lg bg-black px-3.5 py-1.5 text-sm md:text-base font-black text-yellow-300">
                    Định mức: 9.280.000 VNĐ
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-sm md:text-base">
                <div className="bg-emerald-50/70 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                  A. Thu nhập cơ bản
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">1. Lương cơ bản</p>
                    <p className="text-xs text-slate-500 italic">Theo tỉ lệ ngày công thực tế hằng tháng</p>
                  </div>
                  <span className="font-extrabold text-red-700 text-lg whitespace-nowrap">
                    6.000.000 VNĐ/tháng
                  </span>
                </div>

                <div className="bg-emerald-50/70 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                  B. Chế độ và phúc lợi
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">2. Hỗ trợ tiền ăn (Phí hỗ trợ cơm)</p>
                    <p className="text-xs text-slate-500 italic">Theo tỉ lệ ngày công thực tế hằng tháng</p>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-lg whitespace-nowrap">
                    780.000 VNĐ/tháng
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">3. Thưởng hiệu suất công việc (KPI - Nếu có)</p>
                    <p className="text-xs text-slate-500 italic">Theo đánh giá thực tế phát sinh hằng tháng</p>
                  </div>
                  <span className="font-extrabold text-orange-600 text-lg whitespace-nowrap">
                    0 – 2.500.000 VNĐ/tháng
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-bold text-slate-900">4. Thưởng khác... (Nếu có)</p>
                    <p className="text-xs text-slate-500 italic">Theo thực tế phát sinh (nếu có)</p>
                  </div>
                  <span className="font-bold text-slate-600 text-sm whitespace-nowrap">
                    Theo thực tế phát sinh
                  </span>
                </div>

                <div className="bg-red-50/80 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-red-200">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                      Tổng định mức thu nhập (chưa tính tăng ca & PC đêm)
                    </p>
                    <p className="text-xs text-slate-600">
                      Lương cơ bản (6.000.000đ) + Hỗ trợ cơm (780.000đ) + Hiệu suất công việc (tối đa 2.500.000đ)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-black text-red-700 whitespace-nowrap">
                      9.280.000 <span className="text-sm font-bold text-slate-700">VNĐ</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* BẢNG TĂNG CA & PHỤ CẤP ĐÊM */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                    C. Tăng ca / Phụ cấp đêm
                  </p>
                  <h2 className="text-lg font-bold">Chi tiết đơn giá Tăng ca & Phụ cấp đêm (Theo giờ)</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {overtimeRates.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 px-6 py-3 text-sm hover:bg-slate-50 transition"
                  >
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-900">
                        {item.rate}
                      </span>
                      <span className="font-extrabold text-red-700 min-w-[115px] text-right">
                        {item.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

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
                    Xoay ca theo yêu cầu công ty
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
                    <p className="mt-2 text-base font-extrabold text-red-700">{shift.time}</p>
                    <p className="mt-2 text-xs text-slate-600">{shift.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-slate-600 font-medium">
                🔄 Áp dụng chế độ <strong>xoay ca luân chuyển theo yêu cầu và sự phân công của công ty</strong> (không cố định 1 ca). Làm 26 công/tháng, nghỉ 4 ngày theo lịch sắp xếp.
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
                  "Tổng thu nhập định mức lên đến 9.280.000 VNĐ/tháng (Lương cơ bản 6.000.000đ + Hỗ trợ tiền ăn 780.000đ + Thưởng hiệu suất đến 2.500.000đ).",
                  "Tính tăng ca và phụ cấp đêm minh bạch theo quy định (PC đêm 30%, tăng ca 150% - 390%).",
                  "Ký hợp đồng lao động, tham gia đầy đủ BHXH và BHYT theo quy định.",
                  "Có lương tháng 13 và thưởng khác (nếu có) theo chính sách công ty.",
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
              Nhân viên kho SPX Full-time · BPO Xoay Ca
            </span>
            <span className="ml-2 text-amber-700 font-semibold">
              [Đã đủ chỉ tiêu - Tạm ngưng tuyển]
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3 w-full md:w-auto">
            <Link href="/viec-lam/agari-part-time" className="w-full md:w-auto">
              <Button variant="outline" className="h-12 w-full border-red-300 font-bold text-red-700 hover:bg-red-50 md:w-auto">
                ỨNG TUYỂN PART-TIME
              </Button>
            </Link>
            <Link
              href="/viec-lam/tp-ho-chi-minh"
              className="w-full md:w-auto"
            >
              <Button className="h-12 w-full bg-[#d90012] px-6 font-bold text-white hover:bg-red-800 md:w-auto">
                ỨNG TUYỂN KHO TP.HCM
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
