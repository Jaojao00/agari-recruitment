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

const incomeItems = [
  {
    stt: 1,
    name: "Lương cơ bản",
    amount: "5.310.000 đ",
    note: "Ký HĐLĐ chính thức, đóng BHXH đầy đủ",
    highlight: true,
  },
  {
    stt: 2,
    name: "Phụ cấp nhà ở & xăng xe",
    amount: "1.310.000 đ",
    note: "Hỗ trợ chi phí đi lại và sinh hoạt",
    highlight: true,
  },
  {
    stt: 3,
    name: "Phụ cấp tiền cơm",
    amount: "780.000 đ",
    note: "Hỗ trợ theo ngày công thực tế",
    highlight: true,
  },
  {
    stt: 4,
    name: "Phụ cấp KPI hiệu suất",
    amount: "2.500.000 đ",
    note: "Đánh giá theo năng suất và hiệu quả công việc",
    highlight: true,
  },
  {
    stt: 5,
    name: "Hỗ trợ nhận việc 2 tháng thử việc",
    amount: "500.000 đ",
    note: "500.000đ/tháng (áp dụng tối thiểu 23 công/tháng)",
    highlight: true,
  },
];

const shifts = [
  {
    name: "Ca sáng sớm (Ca 1)",
    time: "05:00 - 14:00",
    note: "Bao gồm giờ nghỉ giữa ca theo quy định",
    color: "blue",
  },
  {
    name: "Ca trưa - chiều (Ca 2 & 3)",
    time: "11:00 - 20:00 & 12:00 - 21:00",
    note: "Phù hợp điều phối cao điểm hàng về",
    color: "green",
  },
  {
    name: "Ca chiều - tối (Ca 4 & 5)",
    time: "14:00 - 23:00 & 15:00 - 24:00",
    note: "Hỗ trợ chốt tuyến và bàn giao kho",
    color: "purple",
  },
];

const mainLocations = [
  {
    stt: 1,
    district: "Quận Bình Tân",
    address: "754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
    quota: 5,
    jobKey: "hcm-binh-tan",
  },
  {
    stt: 2,
    district: "Quận Tân Phú",
    address: "549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
    quota: 1,
    jobKey: "hcm-tan-phu",
  },
];

const hcmHubs = [
  { stt: 1, code: "50-HCM", name: "Tan Phu/Tan Quy Hub", area: "Quận Tân Phú" },
  { stt: 2, code: "51-HCM", name: "DS/Phu Dinh Hub", area: "Phú Định (Quận 8)" },
  { stt: 3, code: "51-HCM", name: "Binh Chanh/Vinh Loc A Hub", area: "Huyện Bình Chánh" },
  { stt: 4, code: "52-HCM", name: "SDD-01 Hub", area: "Kho SDD-01" },
  { stt: 5, code: "51-HCM", name: "Tan Phu/Tan Son Nhi Hub", area: "Quận Tân Phú" },
  { stt: 6, code: "51-HCM", name: "Tan Binh/Tan Son Hoa Hub", area: "Quận Tân Bình" },
  { stt: 7, code: "51-HCM", name: "Tan Binh/Tan Son Nhat Hub", area: "Quận Tân Bình" },
  { stt: 8, code: "51-HCM", name: "Binh Thanh/Phuong 12 Hub", area: "Quận Bình Thạnh" },
  { stt: 9, code: "51-HCM", name: "D12/Le Van Khuong Hub", area: "Quận 12" },
  { stt: 10, code: "51-HCM", name: "Hoc Mon/Thoi Tam Thon Hub", area: "Huyện Hóc Môn" },
  { stt: 11, code: "51-HCM", name: "Nha Be/Phuoc Kien Hub", area: "Huyện Nhà Bè" },
  { stt: 12, code: "50-HCM", name: "Can Gio Hub", area: "Huyện Cần Giờ" },
  { stt: 13, code: "50-HCM", name: "Binh Chanh/Vinh Loc Hub", area: "Huyện Bình Chánh" },
  { stt: 14, code: "51-HCM", name: "Binh Tan Binh Hung Hoa B Hub", area: "Quận Bình Tân" },
  { stt: 15, code: "54-HCM", name: "FM 01 Hub", area: "Trạm FM 01" },
  { stt: 16, code: "51-HCM", name: "D8/Pham The Hien Hub", area: "Quận 8" },
  { stt: 17, code: "51-HCM", name: "Binh Tan Binh Hung Hoa B Hub", area: "Quận Bình Tân" },
  { stt: 18, code: "54-HCM", name: "FM 01 Hub", area: "Trạm FM 01" },
  { stt: 19, code: "50-HCM", name: "Phu Nhuan/Phuong 4 Hub", area: "Quận Phú Nhuận" },
];

export default function TpHoChiMinhJobPage() {
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
            AGARI - TUYỂN DỤNG KV TP.HCM
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
              <p className="mb-4 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-900 shadow-md">
                AGARI TUYỂN NHÂN VIÊN CHÍNH THỨC KHO SPX-EXPRESS
              </p>
              <h1 className="max-w-3xl text-4xl font-black uppercase leading-[1.05] tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)] md:text-6xl">
                Nhân viên chính thức kho SPX-Express
                <span className="mt-2 block text-yellow-300">
                  Khu vực TP. Hồ Chí Minh
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] md:text-lg">
                Ưu tiên phỏng vấn và nhận việc ngay tại Quận Bình Tân, Quận Tân Phú và hệ thống 19 Hub/Kho SPX Express phủ khắp các quận huyện TP.HCM.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 shadow-sm">
                  <MapPin size={16} /> Quận Bình Tân & Quận Tân Phú (TP.HCM)
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 shadow-sm">
                  <BriefcaseBusiness size={16} /> Tối thiểu 23 công/tháng, nghỉ xoay tuần
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thu nhập thực tế
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              10.5M - 12.5M
            </p>
            <p className="text-sm text-slate-500">VNĐ / tháng (tăng ca, thưởng)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Tổng thu nhập định mức
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">10.400.000</p>
            <p className="text-sm text-slate-500">VNĐ / tháng (chưa tăng ca)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Hỗ trợ nhận việc
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              500.000 VNĐ
            </p>
            <p className="text-sm text-slate-500">/ tháng (2 tháng thử việc)</p>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            {/* BẢNG THU NHẬP & PHỤ CẤP */}
            <section className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-lg">
              <div className="bg-[#d90012] px-6 py-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                  AGARI TUYỂN NHÂN VIÊN CHÍNH THỨC KHO SPX-EXPRESS
                </p>
                <h2 className="mt-1 text-xl font-black uppercase tracking-wide md:text-2xl">
                  MỨC THU NHẬP DỰ KIẾN: 10.500.000đ - 12.500.000đ / THÁNG
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-red-50 text-xs font-bold uppercase text-red-900 border-b border-red-100">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">STT</th>
                      <th className="px-4 py-3">Hạng mục thu nhập & Phụ cấp</th>
                      <th className="px-4 py-3 text-right">Mức tiền (VNĐ)</th>
                      <th className="px-4 py-3">Ghi chú / Điều kiện hưởng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incomeItems.map((item) => (
                      <tr key={item.stt} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5 text-center font-bold text-slate-500">
                          {item.stt}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">
                          {item.name}
                        </td>
                        <td className="px-4 py-3.5 text-right font-black text-red-700 bg-yellow-50/70 whitespace-nowrap">
                          {item.amount}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {item.note}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50/60 font-bold">
                      <td className="px-4 py-3.5 text-center"></td>
                      <td className="px-4 py-3.5 text-slate-900">
                        Tổng thu nhập định mức (chưa tăng ca)
                      </td>
                      <td className="px-4 py-3.5 text-right font-black text-blue-900 whitespace-nowrap">
                        10.400.000 đ
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        Thu nhập cơ bản cố định và các khoản phụ cấp
                      </td>
                    </tr>
                    <tr className="bg-red-50/90 font-bold border-t-2 border-red-200">
                      <td className="px-4 py-4 text-center"></td>
                      <td className="px-4 py-4 text-red-900">
                        Thu nhập thực tế (tăng ca, thưởng)
                      </td>
                      <td className="px-4 py-4 text-right text-base font-black text-red-700 whitespace-nowrap">
                        10.500.000đ - 12.500.000đ
                      </td>
                      <td className="px-4 py-4 text-slate-700 font-medium">
                        Tùy thuộc vào năng suất & ca làm việc phát sinh
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* MÔ TẢ CÔNG VIỆC VÀ THỜI GIAN XOAY CA */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-700">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Mô tả công việc & Thời gian xoay ca
                  </p>
                  <h2 className="text-2xl font-bold">
                    Chế độ xoay ca (Luân chuyển giữa 5 ca làm việc chính)
                  </h2>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {shifts.map((shift) => (
                  <div
                    key={shift.name}
                    className={`rounded-xl border p-4 ${
                      shift.color === "blue"
                        ? "border-blue-100 bg-blue-50"
                        : shift.color === "green"
                        ? "border-green-100 bg-green-50"
                        : "border-purple-100 bg-purple-50"
                    }`}
                  >
                    <p className="font-bold text-slate-900">{shift.name}</p>
                    <p className="mt-2 font-black text-red-700">{shift.time}</p>
                    <p className="mt-2 text-xs text-slate-600">{shift.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm">
                <p className="font-bold text-slate-900">
                  ⭐ Định mức ngày công: <span className="text-red-700">Tối thiểu 23 công/tháng, nghỉ xoay tuần</span>
                </p>
                <p className="mt-1 text-slate-700">
                  Được hưởng đầy đủ phụ cấp thử việc 500.000đ/tháng. Tuân thủ lịch phân công của quản lý.
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Nhiệm vụ & Hạng mục công việc
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-bold text-red-700">1. Phân loại & Sắp xếp</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Sắp xếp, phân loại hàng hóa vào các khu vực theo quy định.
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Yêu cầu: Cẩn thận, chính xác theo mã hàng.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-bold text-red-700">2. Vận hành & Đóng gói</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Đổ bao hàng, kéo hàng, scan mã vạch và chốt bao hàng.
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Yêu cầu: Nhanh nhẹn, có sức khỏe tốt.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* DANH SÁCH 19 HUB / KHO SPX EXPRESS TUYỂN DỤNG */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                      Phủ khắp các quận huyện TP.HCM
                    </p>
                    <h2 className="text-2xl font-bold">
                      Danh sách 19 Hub / Kho SPX Express tiếp nhận
                    </h2>
                  </div>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                  19 Hub / Kho nhận việc
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-700">
                    <tr>
                      <th className="px-3 py-3 text-center w-12">STT</th>
                      <th className="px-3 py-3">Mã vùng</th>
                      <th className="px-3 py-3">Tên Hub / Kho tiếp nhận</th>
                      <th className="px-3 py-3">Khu vực tương ứng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hcmHubs.map((hub) => (
                      <tr key={hub.stt} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-center font-medium text-slate-500">
                          {hub.stt}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs font-bold text-blue-700">
                          {hub.code}
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-slate-800">
                          {hub.name}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{hub.area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            {/* ĐỊA CHỈ PHỎNG VẤN & TUYỂN DỤNG CHÍNH */}
            <section className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-xl md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                    Ưu tiên phỏng vấn & nhận việc ngay
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    Địa chỉ phỏng vấn & Tuyển dụng chính
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {mainLocations.map((loc) => (
                  <div
                    key={loc.stt}
                    className="rounded-xl border border-red-100 bg-red-50/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-red-800">
                        {loc.stt}. {loc.district}
                      </span>
                      <span className="rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-bold text-white">
                        Chỉ tiêu: {loc.quota} SL
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700 font-medium">
                      {loc.address}
                    </p>
                    <Link
                      href={`/ung-tuyen?job=${loc.jobKey}`}
                      className="mt-3 block"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-[#d90012] font-bold text-white hover:bg-red-800"
                      >
                        Ứng tuyển {loc.district}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-3.5 text-xs leading-5 text-slate-700">
                <p className="font-bold text-slate-900">
                  📌 Tổng chỉ tiêu tuyển chính: <span className="text-red-700">06 nhân sự</span>
                </p>
                <p className="mt-1">
                  <strong>Lưu ý hồ sơ phỏng vấn:</strong> Mang theo CCCD gắn chip khi tham gia phỏng vấn trực tiếp.
                </p>
              </div>
            </section>

            <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <UserRound className="text-yellow-400" />
                <h2 className="text-xl font-bold">Yêu cầu & Quyền lợi</h2>
              </div>
              <ul className="space-y-3.5 text-sm leading-6 text-slate-200">
                <li className="flex gap-2.5">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-yellow-400" />
                  <span>Ký HĐLĐ chính thức, đóng BHXH đầy đủ theo quy định.</span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-yellow-400" />
                  <span>Nhanh nhẹn, có sức khỏe tốt, cẩn thận chính xác theo mã hàng.</span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-yellow-400" />
                  <span>Đáp ứng chế độ xoay ca (luân chuyển giữa 5 ca làm việc chính).</span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-yellow-400" />
                  <span>Bắt buộc mang theo CCCD gắn chip khi tham gia phỏng vấn trực tiếp.</span>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-slate-700 flex items-center gap-2 text-sm font-semibold text-yellow-300">
                <Phone size={16} /> Liên hệ Zalo: 0586.482.344 (AGARI Tuyển dụng)
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1 md:px-6">
          <div className="hidden text-sm md:block">
            <span className="font-bold text-slate-900">
              Nhân viên chính thức kho SPX-Express
            </span>
            <span className="ml-2 text-slate-500">
              Quận Bình Tân & Quận Tân Phú, TP.HCM
            </span>
          </div>
          <Link
            href="/ung-tuyen?job=hcm-fulltime"
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
