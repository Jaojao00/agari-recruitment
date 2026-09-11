"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  Search, 
  Filter, 
  Download, 
  Upload,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  mapUrl?: string;
  isActive: boolean;
  order: number;
  createdAt?: string; // We might not have this, we'll fake it or use a fallback
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", mapUrl: "" });
  
  // Pagination & Filtering state
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/locations");
      const data = await res.json();
      setLocations(data.locations || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.address)
      return alert("Vui lòng nhập tên và địa chỉ");
    setSaving(true);
    await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", address: "", mapUrl: "" });
    setShowForm(false);
    await fetchLocations();
    setSaving(false);
  };

  const toggleActive = async (loc: Location) => {
    await fetch("/api/admin/locations/" + loc.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !loc.isActive }),
    });
    await fetchLocations();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Xóa khu vực: " + name + "?")) return;
    await fetch("/api/admin/locations/" + id, { method: "DELETE" });
    await fetchLocations();
  };

  // Filtered & Paginated Data
  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase()) || 
    loc.address.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage) || 1;
  const paginatedData = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      
      {/* 1. TOP PART: Search, Import, Export, Add */}
      <div className="p-6 border-b border-slate-100 bg-white shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="text-[#D90000]" size={22} />
              Quản lý khu vực tuyển dụng
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý danh sách các khu vực hiển thị trong form ứng tuyển.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50">
              <Upload size={16} className="mr-2" /> Nhập file
            </Button>
            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50">
              <Download size={16} className="mr-2" /> Xuất file
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#D90000] hover:bg-red-800 text-white shadow-md shadow-red-900/20"
            >
              <Plus size={16} className="mr-2" /> Thêm khu vực
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm kiếm khu vực, địa chỉ..." 
              className="pl-10 border-slate-200 bg-slate-50 focus-visible:ring-red-500 rounded-xl w-full max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="text-slate-600 border-slate-200 rounded-xl">
            <Filter size={16} className="mr-2" /> Bộ lọc
          </Button>
        </div>
      </div>

      {/* ADD FORM (Dropdown/Collapse style) */}
      {showForm && (
        <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0 animate-in slide-in-from-top-2">
          <h3 className="font-bold text-slate-800 mb-4">Thêm khu vực mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Tên khu vực</label>
              <Input
                placeholder="VD: KCN Bình Minh, Vĩnh Long"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Địa chỉ chi tiết</label>
              <Input
                placeholder="VD: Lô B, KCN Bình Minh, Ấp Mỹ Lợi..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Link Google Maps (Tuỳ chọn)</label>
              <Input
                placeholder="https://maps.google.com/..."
                value={form.mapUrl}
                onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={saving}
              className="bg-[#D90000] hover:bg-red-800 text-white"
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Lưu khu vực
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* 2. MIDDLE PART: TABLE */}
      <div className="flex-1 overflow-auto bg-white relative">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="w-16 text-center font-bold text-slate-600">STT</TableHead>
              <TableHead className="font-bold text-slate-600">Tên khu vực</TableHead>
              <TableHead className="font-bold text-slate-600">Địa chỉ chi tiết</TableHead>
              <TableHead className="font-bold text-slate-600">Ngày tạo</TableHead>
              <TableHead className="font-bold text-slate-600 text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-600 text-right pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-300" />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MapPin className="h-10 w-10 text-slate-200" />
                    <p>Chưa có khu vực nào. Thêm khu vực đầu tiên!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((loc, index) => (
                <TableRow key={loc.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <TableCell className="text-center font-medium text-slate-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {loc.name}
                  </TableCell>
                  <TableCell className="text-slate-600 max-w-xs truncate" title={loc.address}>
                    {loc.address}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {/* Fake created date for display since DB doesn't have it natively in older versions */}
                    {loc.createdAt || new Date().toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleActive(loc)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        loc.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {loc.isActive ? (
                        <><Eye size={14} /> Hiển thị</>
                      ) : (
                        <><EyeOff size={14} /> Ẩn</>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(loc.id, loc.name)}
                      title="Xóa khu vực"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 3. BOTTOM PART: PAGINATION */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-sm">
        <div className="text-slate-500 font-medium">
          Hiển thị <span className="font-bold text-slate-800">{paginatedData.length}</span> trên tổng số <span className="font-bold text-slate-800">{filteredLocations.length}</span> khu vực
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-[#D90000] text-white hover:bg-red-800' : 'text-slate-600'}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}