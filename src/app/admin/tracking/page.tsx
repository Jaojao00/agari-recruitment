"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCheck, Edit, Trash2, Loader2, Search, Download, Plus } from "lucide-react";

type CandidateTracking = {
  rowNumber: number;
  stt: string;
  fullName: string;
  phone: string;
  source: string;
  cvDate: string;
  screeningResult: string;
  interviewDate: string;
  interviewResult: string;
  offerDate: string;
  offerConfirmed: string;
  joinDate: string;
  team: string;
  status: string;
  note: string;
};

const DEFAULT_TRACKING: CandidateTracking = {
  rowNumber: 0,
  stt: "",
  fullName: "",
  phone: "",
  source: "",
  cvDate: "",
  screeningResult: "",
  interviewDate: "",
  interviewResult: "",
  offerDate: "",
  offerConfirmed: "",
  joinDate: "",
  team: "",
  status: "",
  note: "",
};

export default function AdminTrackingPage() {
  const [data, setData] = useState<CandidateTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingRow, setEditingRow] = useState<CandidateTracking | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTrackings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tracking");
      const json = await res.json();
      if (json.data) setData(json.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrackings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    setSaving(true);
    try {
      if (isAdding) {
        await fetch("/api/admin/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRow),
        });
      } else {
        await fetch(`/api/admin/tracking/${editingRow.rowNumber}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRow),
        });
      }
      await fetchTrackings();
      setEditingRow(null);
      setIsAdding(false);
    } catch (e) {
      console.error(e);
      alert("Lỗi khi lưu dữ liệu");
    }
    setSaving(false);
  };

  const handleDelete = async (rowNumber: number) => {
    if (!confirm("Bạn có chắc muốn xóa bản ghi này khỏi Theo dõi?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/tracking/${rowNumber}`, { method: "DELETE" });
      await fetchTrackings();
    } catch (e) {
      console.error(e);
      alert("Lỗi khi xóa dữ liệu");
    }
    setLoading(false);
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search);
    const matchStatus =
      statusFilter === "ALL" ||
      (item.status || "Chưa rõ") === statusFilter;
    return matchSearch && matchStatus;
  });

  const uniqueStatuses = Array.from(new Set(data.map(d => d.status || "Chưa rõ"))).filter(Boolean);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-white shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="text-[#D90000]" size={22} />
              Theo dõi ứng viên
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi kết quả phỏng vấn và nhận việc của ứng viên.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Tìm tên, SĐT..."
                className="pl-10 w-48 border-slate-200 focus-visible:ring-red-500 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger className="w-[140px] border-slate-200 rounded-xl">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {uniqueStatuses.map(st => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={() => { setEditingRow(DEFAULT_TRACKING); setIsAdding(true); }}
              className="bg-[#D90000] hover:bg-red-800 text-white rounded-xl"
            >
              <Plus size={16} className="mr-2" /> Thêm mới
            </Button>

            <a 
              href="https://docs.google.com/spreadsheets/d/1Y1yxepri5X6CTUFbgERo8fuACwhbd7nsA68MaNOASvs/edit?gid=363771716#gid=363771716" 
              target="_blank" 
              rel="noreferrer"
            >
              <Button variant="outline" className="text-slate-600 border-slate-200 rounded-xl hover:bg-slate-50 hidden md:flex">
                <Download size={16} className="mr-2" /> Google Sheet
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto bg-white relative">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <TableRow className="border-b border-slate-100">
              <TableHead className="font-bold text-slate-600 w-12">STT</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-40">Họ tên</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-32">SĐT</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-28">Nguồn</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-28">Ngày nhận CV</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-36">Kết quả sàng lọc</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-28">Ngày PV</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-28">Kết quả PV</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-32">Ngày gửi offer</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-40">Xác nhận nhận việc</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-32">Ngày nhận việc</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-36">Ca/Team</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-28">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-600 min-w-40">Ghi chú</TableHead>
              <TableHead className="font-bold text-slate-600 text-center sticky right-0 bg-slate-50 w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={15} className="h-64 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-300" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="h-64 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserCheck className="h-10 w-10 text-slate-200" />
                    <p>Chưa có dữ liệu theo dõi.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, idx) => (
                <TableRow key={item.rowNumber} className="border-b border-slate-50 hover:bg-slate-50 whitespace-nowrap">
                  <TableCell className="text-center font-medium text-slate-500">{item.stt || idx + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-800">{item.fullName}</TableCell>
                  <TableCell className="text-slate-600">{item.phone}</TableCell>
                  <TableCell className="text-slate-600">{item.source}</TableCell>
                  <TableCell className="text-slate-600">{item.cvDate}</TableCell>
                  <TableCell className="text-slate-600">{item.screeningResult}</TableCell>
                  <TableCell className="text-slate-600">{item.interviewDate}</TableCell>
                  <TableCell className="text-slate-600">{item.interviewResult}</TableCell>
                  <TableCell className="text-slate-600">{item.offerDate}</TableCell>
                  <TableCell className="text-slate-600">{item.offerConfirmed}</TableCell>
                  <TableCell className="text-slate-600">{item.joinDate}</TableCell>
                  <TableCell className="text-slate-600 max-w-40 truncate" title={item.team}>{item.team}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold">{item.status || "Chưa rõ"}</span>
                  </TableCell>
                  <TableCell className="text-slate-600 max-w-40 truncate" title={item.note}>{item.note}</TableCell>
                  <TableCell className="text-center sticky right-0 bg-white shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingRow(item); setIsAdding(false); }}>
                        <Edit size={16} className="text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.rowNumber)}>
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* EDIT MODAL */}
      {editingRow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg">{isAdding ? "Thêm mới hồ sơ theo dõi" : "Cập nhật thông tin theo dõi"}</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditingRow(null)}>Đóng</Button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Họ tên *</label>
                  <Input required value={editingRow.fullName} onChange={e => setEditingRow({...editingRow, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">SĐT *</label>
                  <Input required value={editingRow.phone} onChange={e => setEditingRow({...editingRow, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">STT</label>
                  <Input value={editingRow.stt} onChange={e => setEditingRow({...editingRow, stt: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Nguồn</label>
                  <Input value={editingRow.source} onChange={e => setEditingRow({...editingRow, source: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày nhận CV</label>
                  <Input value={editingRow.cvDate} onChange={e => setEditingRow({...editingRow, cvDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Kết quả sàng lọc</label>
                  <Input value={editingRow.screeningResult} onChange={e => setEditingRow({...editingRow, screeningResult: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày PV</label>
                  <Input value={editingRow.interviewDate} onChange={e => setEditingRow({...editingRow, interviewDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Kết quả PV</label>
                  <Input value={editingRow.interviewResult} onChange={e => setEditingRow({...editingRow, interviewResult: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày gửi offer</label>
                  <Input value={editingRow.offerDate} onChange={e => setEditingRow({...editingRow, offerDate: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Xác nhận nhận việc</label>
                  <Input value={editingRow.offerConfirmed} onChange={e => setEditingRow({...editingRow, offerConfirmed: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ngày nhận việc</label>
                  <Input value={editingRow.joinDate} onChange={e => setEditingRow({...editingRow, joinDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ca/Team</label>
                  <Input value={editingRow.team} onChange={e => setEditingRow({...editingRow, team: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Trạng thái</label>
                  <Input value={editingRow.status} onChange={e => setEditingRow({...editingRow, status: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ghi chú</label>
                  <Input value={editingRow.note} onChange={e => setEditingRow({...editingRow, note: e.target.value})} />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingRow(null)}>Hủy</Button>
                <Button type="submit" disabled={saving} className="bg-[#D90000] text-white hover:bg-red-800">
                  {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  {isAdding ? "Thêm mới" : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}