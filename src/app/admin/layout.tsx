"use client";

import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
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
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 bg-red-700 text-white font-bold text-xl tracking-wider">
        AGARI ADMIN
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            // We need to match query params if present, but since layout doesn't use useSearchParams easily,
            // we will use a simpler active logic
            const isExactPath = item.path.includes("?") ? false : pathname === item.path;
            const isSubPath = item.path !== "/admin" && !item.path.includes("?") && pathname.startsWith(item.path);
            const isActive = isExactPath || isSubPath;
            
            return (
              <Link key={item.name} href={item.path}>
                <span
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${item.isSub ? "ml-6 text-sm" : ""} ${isActive ? "bg-red-700 text-white" : "hover:bg-slate-800 hover:text-white"}`}
                >
                  {!item.isSub && item.icon}
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div className="text-sm truncate pr-2" title={user?.email || ""}>
          {user?.email}
        </div>
        <button
          onClick={logout}
          className="p-2 hover:bg-slate-800 rounded-md text-red-400 hover:text-red-300"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
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
      <div className="min-h-screen flex items-center justify-center">
        ĐANG TẢI...
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") return null;
  if (user && pathname === "/admin/login") return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 justify-between md:justify-end shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
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
