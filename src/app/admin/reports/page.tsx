'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ReportsPage() {
  const [status, setStatus] = useState('ALL');

  const handleExport = () => {
    window.location.href = `/api/admin/export/excel?status=${status}`;
  };

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold">Báo cáo & Xuất dữ liệu</h1>
       
       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-xl">
         <h2 className="text-lg font-semibold mb-4">Xuất danh sách ứng viên (Excel)</h2>
         
         <div className="space-y-4">
           <div className="space-y-2">
             <Label>Lọc theo trạng thái</Label>
             <Select value={status} onValueChange={setStatus}>
               <SelectTrigger>
                 <SelectValue placeholder="Tất cả trạng thái" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                 <SelectItem value="NEW">Mới đăng ký</SelectItem>
                 <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
                 <SelectItem value="INTERVIEW_SCHEDULED">Đã đặt lịch phỏng vấn</SelectItem>
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
           
           <Button onClick={handleExport} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
             XUẤT EXCEL
           </Button>
           <p className="text-sm text-gray-500 italic mt-2">
             File Excel sẽ bao gồm toàn bộ các trường dữ liệu và được format sẵn theo tiêu chuẩn báo cáo. Dữ liệu CCCD/SĐT sẽ được định dạng Text để không bị mất số 0 đầu hoặc chuyển thành E+.
           </p>
         </div>
       </div>
    </div>
  );
}
