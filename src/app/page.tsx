import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, CheckCircle2, DollarSign, Clock, ShieldCheck, ChevronDown } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-red-700 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">AGARI</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#luong" className="hover:text-yellow-300 transition">Thu nhập</Link>
            <Link href="#quyen-loi" className="hover:text-yellow-300 transition">Quyền lợi</Link>
            <Link href="#yeu-cau" className="hover:text-yellow-300 transition">Yêu cầu</Link>
          </nav>
          <Link href="/ung-tuyen">
            <Button variant="secondary" className="bg-white text-red-700 hover:bg-gray-100 font-bold">
              Ứng tuyển ngay
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-4 drop-shadow-md">
            Tuyển Dụng <span className="text-yellow-300 block md:inline mt-2 md:mt-0">Nhân Viên Kho</span> Chính Thức
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 text-red-50">
            Đãi ngộ tốt - Thu nhập hấp dẫn - Môi trường ổn định
          </p>
          
          <div className="bg-white text-red-700 rounded-full px-6 py-3 md:px-8 md:py-4 mb-10 shadow-lg border-4 border-yellow-300 transform -rotate-1">
            <p className="text-2xl md:text-4xl font-black">
              7.400.000 - 11.000.000 <span className="text-lg md:text-2xl text-gray-600">VNĐ / THÁNG</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
            <Link href="/ung-tuyen" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold text-lg h-14 px-8 rounded-full shadow-xl transition-transform hover:scale-105">
                ỨNG TUYỂN NGAY
              </Button>
            </Link>
            <Link href="#chi-tiet" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white/10 hover:text-white font-semibold text-lg h-14 px-8 rounded-full transition">
                XEM CHI TIẾT
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,201.3,113.67,242.83,110.51,283.9,98.81,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 flex-1" id="chi-tiet">
        
        {/* LƯƠNG & THƯỞNG SECTION */}
        <section id="luong" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">Thông tin thu nhập</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-t-4 border-t-red-600 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase font-semibold">Lương cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">5.310.000<span className="text-sm font-normal text-gray-500 ml-1">VNĐ</span></div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase font-semibold">Phụ cấp nơi ở</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">1.310.000<span className="text-sm font-normal text-gray-500 ml-1">VNĐ</span></div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-yellow-500 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase font-semibold">Phụ cấp ăn uống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">780.000<span className="text-sm font-normal text-gray-500 ml-1">VNĐ</span></div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-700 bg-red-50 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700 uppercase font-black">Tổng lương cố định</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">7.400.000<span className="text-sm font-normal text-red-600 ml-1">VNĐ</span></div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Thưởng tháng đầu</h4>
                  <p className="text-gray-600 text-sm">500.000 VNĐ nếu đủ 26 công.</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Thưởng hiệu suất</h4>
                  <p className="text-gray-600 text-sm">Lên đến 1.500.000 VNĐ/tháng.</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Tăng ca</h4>
                  <p className="text-gray-600 text-sm">Trung bình khoảng 919.000 VNĐ, tùy thời gian thực tế.</p>
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
                  'Hợp đồng lao động chính thức.',
                  'Tham gia đầy đủ BHXH, BHYT.',
                  '12 ngày phép năm.',
                  'Thưởng các ngày Lễ/Tết trong năm.',
                  'Lương tháng 13.',
                  'Cơ hội tăng thu nhập và thăng tiến.',
                  'Môi trường làm việc ổn định, chuyên nghiệp.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Nam/Nữ từ 18 - 35 tuổi.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Sức khỏe tốt.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Chăm chỉ, thật thà.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Trình độ học vấn: 9/12.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Có CCCD.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Có VNeID mức 2.</span>
                </div>
                <div className="flex items-start gap-2 sm:col-span-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Có khả năng làm việc xoay ca & có thể tăng ca khi cần.</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Các ca làm việc (Xoay ca):</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm py-1">Ca 1: 06:00 - 15:00</Badge>
                  <Badge variant="outline" className="text-sm py-1">Ca 2: 15:00 - 22:00</Badge>
                  <Badge variant="outline" className="text-sm py-1">Ca 3: 18:00 - 22:00</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">* Không có ca 22:00 - 06:00.</p>
              </div>
            </div>
          </section>
        </div>

        {/* ĐỊA ĐIỂM SECTION */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-16 flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-gray-900 text-white">
            <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
              <MapPin className="text-red-500" />
              Địa điểm làm việc
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Lô 01, kho số A01,<br/>
              KCN Bình Minh,<br/>
              Ấp Mỹ Lợi, Xã Mỹ Hoà,<br/>
              Tỉnh Vĩnh Long.
            </p>
          </div>
          <div className="bg-gray-200 md:w-1/2 h-64 md:h-auto relative flex items-center justify-center">
            {/* Placeholder for map - could embed an iframe here later */}
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <MapPin size={48} />
              <span className="font-medium">Bản đồ</span>
            </div>
          </div>
        </section>

      </main>

      {/* STICKY BOTTOM CTA FOR MOBILE */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] md:hidden z-50">
        <Link href="/ung-tuyen">
          <Button size="lg" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-lg h-14 rounded-full">
            ỨNG TUYỂN NGAY
          </Button>
        </Link>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 pb-24 md:pb-12 text-center text-sm">
        <div className="container mx-auto px-4">
          <div className="font-bold text-xl text-white mb-4">AGARI</div>
          <p>© {new Date().getFullYear()} AGARI. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}

// Temporary inline Badge component until we generate it or if it wasn't added properly
function Badge({ className, variant, ...props }: any) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props} />
}
