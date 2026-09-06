'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/lib/firebase/models';
import { useDebounce } from '@/lib/utils'; // I'll need to create this hook
import { Loader2, Search, Eye } from 'lucide-react';

export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [debouncedSearch, statusFilter, page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (debouncedSearch) query.append('search', debouncedSearch);
      if (statusFilter && statusFilter !== 'ALL') query.append('status', statusFilter);
      query.append('page', page.toString());

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setTotalPages(json.totalPages);
        setTotal(json.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string, color: string }> = {
      'NEW': { label: 'Mới đăng ký', color: 'bg-blue-100 text-blue-800' },
      'CONTACTED': { label: 'Đã liên hệ', color: 'bg-yellow-100 text-yellow-800' },
      'INTERVIEW_SCHEDULED': { label: 'Lịch phỏng vấn', color: 'bg-orange-100 text-orange-800' },
      'INTERVIEWED': { label: 'Đã phỏng vấn', color: 'bg-purple-100 text-purple-800' },
      'PASSED': { label: 'Đạt', color: 'bg-emerald-100 text-emerald-800' },
      'FAILED': { label: 'Không đạt', color: 'bg-red-100 text-red-800' },
      'HIRED': { label: 'Đã trúng tuyển', color: 'bg-green-100 text-green-800' },
      'WORKING': { label: 'Đã nhận việc', color: 'bg-teal-100 text-teal-800' },
      'EXPIRED': { label: 'Hết hạn', color: 'bg-gray-100 text-gray-800' },
      'CANCELLED': { label: 'Đã hủy', color: 'bg-gray-200 text-gray-700' },
    };
    const mapped = map[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mapped.color}`}>{mapped.label}</span>;
  };

  const maskCCCD = (cccd: string) => {
    if (!cccd || cccd.length < 4) return '********';
    return `********${cccd.slice(-4)}`;
  };

  const formatDate = (dateObj: any) => {
    if (!dateObj) return '-';
    // Handle Firestore timestamp
    if (dateObj._seconds) {
      return new Date(dateObj._seconds * 1000).toLocaleDateString('vi-VN');
    }
    return new Date(dateObj).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý hồ sơ ứng tuyển</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Tổng cộng: <span className="font-bold text-gray-900">{total}</span> hồ sơ
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Tìm theo tên, mã hồ sơ, CCCD, SĐT..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val as any); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="NEW">Mới đăng ký</SelectItem>
              <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
              <SelectItem value="INTERVIEW_SCHEDULED">Lịch phỏng vấn</SelectItem>
              <SelectItem value="INTERVIEWED">Đã phỏng vấn</SelectItem>
              <SelectItem value="PASSED">Đạt</SelectItem>
              <SelectItem value="FAILED">Không đạt</SelectItem>
              <SelectItem value="HIRED">Đã trúng tuyển</SelectItem>
              <SelectItem value="WORKING">Đã nhận việc</SelectItem>
              <SelectItem value="EXPIRED">Hết hạn</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hồ sơ</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>CCCD</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Ca làm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày ứng tuyển</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                  Không tìm thấy ứng viên phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              data.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium text-red-700">{app.applicationId}</TableCell>
                  <TableCell className="font-semibold">{app.fullName}</TableCell>
                  <TableCell className="text-gray-500">{maskCCCD(app.cccd)}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>
                    {app.preferredShift.includes('Ca 1') ? 'Ca 1' : 
                     app.preferredShift.includes('Ca 2') ? 'Ca 2' : 'Ca 3'}
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(app.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/applications/${app.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        <Eye size={16} className="mr-1" /> Xem
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Trước
          </Button>
          <span className="text-sm text-gray-500">Trang {page} / {totalPages}</span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
