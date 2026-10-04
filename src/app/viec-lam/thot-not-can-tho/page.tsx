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
  ["Ca ngày giờ hành chính", "09:00 - 18:00"],
];

export default function ThotNotCanThoPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      <main className="mx-auto max-w-6xl p-4 pt-6 md:p-8 md:pt-10 pb-32">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-semibold text-slate-500 hover:text-red-700"
        >
          <ArrowLeft size={16} className="mr-2" /> Quay lại
        </Link>

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#d90012] to-[#ff2a3a] p-8 text-white shadow-xl md:p-12">
          <div className="relative z-10">
            <span className="mb-4 inline-block rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-900">
              Việc nhẹ lương tốt - Nhận việc ngay
            </span>
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
              NHÂN VIÊN KHO FULL-TIME
              <br className="hidden md:block" />
              <span className="text-yellow-400"> THỐT NỐT, CẦN THƠ</span>
            </h1>
            <p className="max-w-2xl text-lg font-medium text-red-50 md:text-xl">
              Công việc đơn giản, thu nhập hấp dẫn, môi trường làm việc chuyên nghiệp.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10 blur-md"></div>
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-[48px] border-red-900/10 blur-2xl"></div>

          <div className="relative z-10 mt-10 flex flex-wrap gap-4 text-sm font-semibold">
            <span className="flex items-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <MapPin size={18} className="mr-2" /> Thốt Nốt, Cần Thơ
            </span>
            <span className="flex items-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Gift size={18} className="mr-2" /> Thưởng chuyên cần
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Mức lương
            </p>
            <p className="mt-2 text-3xl font-black text-red-700">
              250.000
            </p>
            <p className="text-sm text-slate-500">VNĐ / ngày</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thưởng chuyên cần
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">750.000</p>
            <p className="text-sm text-slate-500">VNĐ / tháng (áp dụng khi làm đủ 26 công)</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lịch làm việc
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Giờ hành chính</p>
            <p className="text-sm text-slate-500">Tháng làm 26 công, OFF 4 ngày</p>
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
                    Thời gian
                  </p>
                  <h2 className="text-2xl font-bold">
                    Thời gian làm việc (Cố định)
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-1">
                {shifts.map(([name, time]) => (
                  <div
                    key={time}
                    className="flex flex-col gap-2 rounded-xl border border-red-100 bg-red-50 p-4"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      {name}
                    </span>
                    <span className="whitespace-nowrap font-black text-red-700">
                      {time}
                    </span>
                    <span className="text-xs text-slate-600">(Có thời gian nghỉ ngơi giữa ca)</span>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Nhiệm vụ
                  </p>
                  <h2 className="text-2xl font-bold">Công việc chính</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm leading-6 text-slate-600">
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Hỗ trợ lên/xuống hàng hóa nhẹ nhàng khi xe tải về kho.
                </p>
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Quét mã vạch đơn hàng nhập kho.
                </p>
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Phân loại bưu kiện theo khu vực tuyến để bàn giao cho shipper.
                </p>
                <p className="mt-4 italic text-slate-500 border-l-4 border-slate-200 pl-4 py-1">
                  Đừng lo nếu chưa có kinh nghiệm, vào làm sẽ được quản lý hướng dẫn tận tình từ A-Z.
                </p>
              </div>
            </section>
            
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
                  <UserRound size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Tiêu chí
                  </p>
                  <h2 className="text-2xl font-bold">Yêu cầu đơn giản</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm leading-6 text-slate-600">
                <p className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={18} />
                  Nam/Nữ, độ tuổi từ 18 – 35 tuổi, sức khỏe tốt, siêng năng.
                </p>
                <p className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={18} />
                  Tìm kiếm công việc ổn định để làm lâu dài.
                </p>
                <p className="flex gap-3 font-bold text-red-700">
                  <CheckCircle2 className="mt-1 shrink-0 text-red-600" size={18} />
                  Bắt buộc: Có CCCD gốc - VNeID MỨC 2.
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-8">
              <h3 className="mb-6 text-lg font-bold">Thông tin liên hệ & Ứng tuyển</h3>
              <div className="mb-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-slate-400" size={18} />
                  <div>
                    <p className="font-semibold text-slate-900">78-CTO Co Do 02 Hub:</p>
                    <p className="text-slate-600">Ấp Tân Lợi 1, Xã Thuận Hưng, Huyện Thốt Nốt, Cần Thơ.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 shrink-0 text-slate-400" size={18} />
                  <div>
                    <p className="font-semibold text-slate-900">Zalo Liên hệ:</p>
                    <p className="font-bold text-red-600">0586.482.344 (Gặp Tài)</p>
                  </div>
                </div>
              </div>
              
              <Link href="/ung-tuyen?job=thot-not-can-tho" className="block w-full">
                <Button className="h-12 w-full bg-[#D90000] text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700">
                  Đăng ký ứng tuyển ngay
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}