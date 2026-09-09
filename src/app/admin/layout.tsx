"use client";

import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileX,
  FileSpreadsheet,
  LogOut,
  Menu,
  MapPin,
  ClipboardList,
  Bell,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "Hồ sơ ứng tuyển (Tất cả)",
      path: "/admin/applications",
      icon: <Users size={20} />,
    },
    {
      name: "Mục S-BPO",
      path: "/admin/applications?jobId=warehouse-rotating-shift",
      icon: <Users size={20} />,
      isSub: true,
    },
    {
      name: "Mục Full-time",
      path: "/admin/applications?jobId=spx-fulltime",
      icon: <Users size={20} />,
      isSub: true,
    },
    {
      name: "Mục Part-time",
      path: "/admin/applications?jobId=agari-part-time",
      icon: <Users size={20} />,
      isSub: true,
    },
    {
      name: "Đã trúng tuyển",
      path: "/admin/recruited",
      icon: <Users size={20} />,
    },
    { name: "Hết hạn", path: "/admin/expired", icon: <FileX size={20} /> },
    {
      name: "Báo cáo",
      path: "/admin/reports",
      icon: <FileSpreadsheet size={20} />,
    },
    {
      name: "Quản lý tin tuyển dụng",
      path: "/admin/jobs",
      icon: <ClipboardList size={20} />,
    },
    {
      name: "Khu vực tuyển dụng",
      path: "/admin/locations",
      icon: <MapPin size={20} />,
    },
  ];

  return (
    <div className="w-64 bg-[#0F172A] text-slate-300 min-h-screen flex flex-col hidden md:flex shrink-0 shadow-xl z-20 relative">
      <div className="h-16 flex items-center px-6 bg-[#D90000] text-white font-black text-xl tracking-wider uppercase shrink-0">
        AGARI <span className="font-light ml-2 text-sm tracking-widest">ADMIN</span>
      </div>

      <div className="flex-1 py-8 overflow-y-auto custom-scrollbar">
        <nav className="space-y-1.5 px-4">
          {navItems.map((item) => {
            const isApplicationsPage = pathname.startsWith("/admin/applications");
            if (item.isSub && !isApplicationsPage) {
              return null;
            }
            const isExactPath = item.path.includes("?") ? false : pathname === item.path;
            const isSubPath = item.path !== "/admin" && !item.path.includes("?") && pathname.startsWith(item.path);
            const isActive = isExactPath || isSubPath;
            
            return (
              <Link key={item.name} href={item.path}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${item.isSub ? "ml-8 text-sm py-2" : ""} ${isActive ? "bg-[#D90000] text-white shadow-lg shadow-red-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
                >
                  {!item.isSub && item.icon}
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-800/50 bg-[#0B1120]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-inner">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-slate-200 truncate" title={user?.email || ""}>
              {user?.email}
            </div>
            <div className="text-xs text-slate-500">Quản trị viên</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function AdminHeader() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const day = days[now.getDay()];
    const dateStr = now.toLocaleDateString("vi-VN");
    const timeStr = now.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    setCurrentDate(`${day}, ${dateStr} - ${timeStr}`);
  }, []);

  return (
    <header className="h-16 bg-gradient-to-r from-[#D90000] to-[#FF3B30] text-white flex items-center px-4 md:px-8 justify-between shrink-0 shadow-md relative z-10">
      <div className="flex items-center gap-3 md:gap-6">
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
          <Menu />
        </Button>
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-2">
            <Users size={18} className="opacity-90" />
            <h2 className="font-bold text-lg tracking-wide">Hệ thống tuyển dụng AGARI</h2>
          </div>
        </div>
        <div className="hidden lg:block h-6 w-px bg-white/30 mx-2"></div>
        <div className="hidden lg:block text-sm text-white/80 italic font-medium">
          Kết nối nhân tài - Kiến tạo tương lai
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/15 rounded-lg border border-white/10">
          <CalendarIcon size={16} className="text-white/80" />
          <span className="text-sm font-medium text-white/90">{currentDate}</span>
        </div>
        
        <div className="relative cursor-pointer hover:bg-white/10 p-2 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-yellow-400 border-2 border-[#E51E1A] rounded-full"></span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-white text-[#D90000] flex items-center justify-center font-bold shadow-md ring-2 ring-white/20">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (user && pathname === "/admin/login") {
        router.push("/admin");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#D90000] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") return null;
  if (user && pathname === "/admin/login") return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}