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
  ["Sáng: 08:00 - 12:00", "140.000 VNĐ/ca"],
  ["Chiều: 15:00 - 19:00", "140.000 VNĐ/ca"],
];

export default function DongThapPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
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
              NHÂN SỰ KHO PHÂN LOẠI
              <br className="hidden md:block" />
              <span className="text-yellow-400"> ĐỒNG THÁP</span>
            </h1>
            <p className="max-w-2xl text-lg font-medium text-red-50 md:text-xl">
              Công việc đơn giản, xoay ca linh hoạt 4 tiếng tự do lựa chọn. Ưu tiên đăng ký sớm.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10 blur-md"></div>
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-[48px] border-red-900/10 blur-2xl"></div>

          <div className="relative z-10 mt-10 flex flex-wrap gap-4 text-sm font-semibold">
            <span className="flex items-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <MapPin size={18} className="mr-2" /> Lấp Vò, Đồng Tháp
            </span>
            <span className="flex items-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Clock3 size={18} className="mr-2" /> Lương tuần rất uy tín
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thu nhập theo ca
            </p>
            <p className="mt-2 text-3xl font-black text-red-700">
              140.000
            </p>
            <p className="text-sm text-slate-500">VNĐ / ca</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lịch làm việc
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Ca ngắn 4 tiếng</p>
            <p className="text-sm text-slate-500">Tự do lựa chọn ca sáng/chiều</p>
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
                    Các ca làm việc linh hoạt
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {shifts.map(([time, pay]) => (
                  <div
                    key={time}
                    className="flex flex-col gap-2 rounded-xl border border-red-100 bg-red-50 p-4"
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
                  <h2 className="text-2xl font-bold">Rất uy tín</h2>
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
                  Nhận lương đều đặn chuyển khoản vào Thứ 6 tuần kế tiếp.
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
                  <h2 className="text-2xl font-bold">Công việc chính</h2>
                </div>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Hỗ trợ bốc xếp, lên/xuống hàng hóa nhẹ nhàng.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Sử dụng máy quét mã vạch đơn hàng nhập kho.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Phân loại hàng hóa theo tuyến để bàn giao cho shipper.
                </li>
                <li className="flex gap-3 text-red-600 font-medium">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Công việc đơn giản, không yêu cầu kinh nghiệm, vào làm sẽ được hướng dẫn tận tình.
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
                <li>Nam/Nữ, độ tuổi từ 18 - 35 tuổi, sức khỏe tốt.</li>
                <li>Bắt buộc: Có CCCD gốc - VNeID MỨC 2.</li>
              </ul>
            </section>
            
            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700" />
                <h2 className="text-xl font-bold">Địa điểm làm việc</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600 font-semibold">
                71-DTP Lap Vo 02 Hub
              </p>
              <p className="text-sm leading-6 text-slate-600 mt-1">
                Ấp Tân Trong, Xã Tân Mỹ, Huyện Lấp Vò, Đồng Tháp.
              </p>
              <p className="text-sm leading-6 text-slate-500 mt-2">
                Tọa độ Map: 10.408401, 105.650308
              </p>
              <a
                className="mt-4 block text-sm font-semibold text-red-700 hover:underline"
                href="https://maps.google.com/?q=10.408401,105.650308"
                target="_blank"
                rel="noreferrer"
              >
                Mở Google Map tìm đường
              </a>
              <div className="mt-5 pt-5 border-t border-red-200 flex items-center gap-2 text-sm font-bold text-red-700">
                <Phone size={17} /> Nhắn tin Zalo: 0586.482.344 (Gặp Tài)
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1 md:px-6">
          <div className="hidden text-sm md:block">
            <span className="font-bold">Nhân sự kho phân loại</span>
            <span className="ml-2 text-slate-500">Lấp Vò, Đồng Tháp</span>
          </div>
          <Link
            href="/ung-tuyen?job=lap-vo-dong-thap"
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