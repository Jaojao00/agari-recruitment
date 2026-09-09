import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  CheckCircle,
  FileX,
  Calendar,
  Clock3,
  MapPin,
  TrendingUp,
  BriefcaseBusiness,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { getApplicationsFromSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

type DashboardApplication = {
  status?: string;
  gender?: string;
  preferredLocation?: string;
  preferredShift?: string;
};

// --- Custom Donut Component ---
function DonutChart({
  data,
  total,
  label
}: {
  data: { label: string; value: number; color: string }[];
  total: number;
  label: string;
}) {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;

  return (
    <div className="flex items-center gap-8">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, i) => {
            if (item.value === 0) return null;
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (item.value / total) * circumference;
            
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-slate-500">Tổng</span>
          <span className="text-3xl font-black text-slate-800">{total}</span>
          <span className="text-xs font-medium text-slate-500">{label}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 flex-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-900">{item.value}</span>
              {total > 0 && <span className="text-xs font-semibold text-slate-400 w-8 text-right">{Math.round((item.value/total)*100)}%</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ---------------------------------

export default async function AdminDashboard() {
  const applications = await getApplicationsFromSheet();

  const total = applications.length;
  const newApps = applications.filter(
    (a: DashboardApplication) => a.status === "NEW",
  ).length;
  const contacted = applications.filter(
    (a: DashboardApplication) => a.status === "CONTACTED",
  ).length;
  const interviewed = applications.filter(
    (a: DashboardApplication) => a.status === "INTERVIEWED",
  ).length;
  const passed = applications.filter(
    (a: DashboardApplication) => a.status === "PASSED",
  ).length;
  const hired = applications.filter(
    (a: DashboardApplication) => a.status === "HIRED",
  ).length;
  const expired = applications.filter(
    (a: DashboardApplication) => a.status === "EXPIRED",
  ).length;
  
  const scheduled = applications.filter(
    (a: DashboardApplication) => a.status === "INTERVIEW_SCHEDULED",
  ).length;

  const male = applications.filter(
    (a: DashboardApplication) => a.gender === "Nam",
  ).length;
  const female = applications.filter(
    (a: DashboardApplication) => a.gender === "Nữ",
  ).length;

  const locationCounts = applications.reduce<Record<string, number>>(
    (counts, application: DashboardApplication) => {
      const location = application.preferredLocation || "Chưa xác định";
      counts[location] = (counts[location] || 0) + 1;
      return counts;
    },
    {}
  );
  const topLocations = Object.entries(locationCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 4);

  const shiftCounts = applications.reduce<Record<string, number>>(
    (counts, application: DashboardApplication) => {
      const shift = application.preferredShift || "Chưa xác định";
      counts[shift] = (counts[shift] || 0) + 1;
      return counts;
    },
    {}
  );
  const topShifts = Object.entries(shiftCounts).sort(
    ([, countA], [, countB]) => countB - countA,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Tổng quan Dashboard
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Thống kê nhanh tình hình tuyển dụng
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 cursor-default">
            <Calendar className="mr-2 h-4 w-4 text-slate-400" />
            <span className="font-medium mr-2">Thời gian:</span> 
            <span className="font-bold text-slate-800">Tất cả thời gian</span>
          </div>
          <button className="flex items-center justify-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-red-600 transition-colors">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        
        {/* TOTAL */}
        <div className="bg-[#FFF4F4] rounded-2xl p-6 relative overflow-hidden border border-red-100 transition-transform hover:-translate-y-1 duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Users size={22} />
            </div>
            <span className="font-bold text-slate-800">Tổng ứng viên</span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2 relative z-10">{total}</div>
          <Users className="absolute -bottom-6 -right-6 w-32 h-32 text-red-500/10 pointer-events-none" strokeWidth={1} />
        </div>

        {/* NEW */}
        <div className="bg-[#F0F7FF] rounded-2xl p-6 relative overflow-hidden border border-blue-100 transition-transform hover:-translate-y-1 duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText size={22} />
            </div>
            <span className="font-bold text-slate-800">Hồ sơ mới</span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2 relative z-10">{newApps}</div>
          <FileText className="absolute -bottom-6 -right-6 w-32 h-32 text-blue-500/10 pointer-events-none" strokeWidth={1} />
        </div>

        {/* PASSED */}
        <div className="bg-[#F0FDF4] rounded-2xl p-6 relative overflow-hidden border border-green-100 transition-transform hover:-translate-y-1 duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md shadow-green-500/20">
              <CheckCircle size={22} />
            </div>
            <span className="font-bold text-slate-800">Đã trúng tuyển</span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2 relative z-10">{hired}</div>
          <CheckCircle className="absolute -bottom-6 -right-6 w-32 h-32 text-green-500/10 pointer-events-none" strokeWidth={1} />
        </div>

        {/* EXPIRED */}
        <div className="bg-[#FFF8F0] rounded-2xl p-6 relative overflow-hidden border border-orange-100 transition-transform hover:-translate-y-1 duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-400 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Clock3 size={22} />
            </div>
            <span className="font-bold text-slate-800">Hết hạn</span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2 relative z-10">{expired}</div>
          <Clock3 className="absolute -bottom-6 -right-6 w-32 h-32 text-orange-500/10 pointer-events-none" strokeWidth={1} />
        </div>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* TRẠNG THÁI */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-lg text-slate-800">Chi tiết trạng thái hồ sơ</h3>
          </div>
          <DonutChart 
            total={total}
            label="hồ sơ"
            data={[
              { label: "Mới", value: newApps, color: "#3B82F6" }, // Blue
              { label: "Đã liên hệ", value: contacted, color: "#F97316" }, // Orange
              { label: "Đã phỏng vấn", value: interviewed, color: "#8B5CF6" }, // Purple
              { label: "Đạt", value: passed, color: "#10B981" }, // Green
            ]}
          />
        </div>

        {/* GIỚI TÍNH */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-lg text-slate-800">Giới tính</h3>
          </div>
          <DonutChart 
            total={male + female}
            label="ứng viên"
            data={[
              { label: "Nam", value: male, color: "#3B82F6" }, // Blue
              { label: "Nữ", value: female, color: "#EC4899" }, // Pink
            ]}
          />
        </div>

        {/* CA LÀM VIỆC */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Clock3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-lg text-slate-800">Ca làm việc</h3>
          </div>
          
          <div className="space-y-5">
            {topShifts.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium">Chưa có dữ liệu ca làm việc.</p>
            ) : (
              topShifts.slice(0, 5).map(([shift, count]) => (
                <div key={shift} className="flex items-center gap-4">
                  <div className="w-32 text-xs font-bold text-slate-700 truncate" title={shift}>{shift}</div>
                  <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#3B82F6] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${total > 0 ? (count/total)*100 : 0}%` }} 
                    />
                  </div>
                  <div className="w-8 text-right font-black text-slate-800">{count}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. LOCATIONS & CALENDAR */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* KHU VỰC QUAN TÂM */}
        <div className="bg-[#FFF4F4] rounded-2xl border border-red-100 p-6 lg:col-span-2 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Khu vực được quan tâm</h3>
          </div>
          
          <div className="space-y-4">
            {topLocations.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">Chưa có dữ liệu khu vực.</p>
            ) : (
              topLocations.map(([location, count]) => (
                <div key={location} className="bg-white rounded-xl p-4 shadow-sm border border-red-50/50 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      <span className="font-bold text-sm text-slate-700">{location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">Tổng hồ sơ</span>
                      <span className="text-lg font-black text-slate-900">{count}</span>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-red-600 transition-colors" />
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${total > 0 ? (count/total)*100 : 0}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LỊCH PHỎNG VẤN */}
        <div className="bg-[#F0F7FF] rounded-2xl border border-blue-100 p-6 lg:col-span-1 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Lịch phỏng vấn</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center bg-white rounded-xl p-6 shadow-sm border border-blue-50/50">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                <Calendar size={32} />
             </div>
             <div className="text-5xl font-black text-slate-900 mb-2">{scheduled}</div>
             <p className="text-sm font-semibold text-slate-500 mb-6">ứng viên đã được đặt lịch</p>
             
             <div className="w-full mt-auto pt-4 border-t border-slate-100">
               <p className="text-sm font-bold italic text-blue-600">
                 "Chuẩn bị tốt để gặp ứng viên nhé!"
               </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}