import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import ExcelJS from 'exceljs';
import { Application } from '@/lib/firebase/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    
    let query: any = adminDb.collection('applications').orderBy('createdAt', 'desc');
    if (status && status !== 'ALL') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const data = snapshot.docs.map((doc: any) => doc.data() as Application);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Applications');

    sheet.columns = [
      { header: 'Mã hồ sơ', key: 'id', width: 20 },
      { header: 'Họ tên', key: 'name', width: 30 },
      { header: 'Ngày sinh', key: 'dob', width: 15 },
      { header: 'CCCD', key: 'cccd', width: 20 },
      { header: 'Số điện thoại', key: 'phone', width: 20 },
      { header: 'Giới tính', key: 'gender', width: 10 },
      { header: 'Địa chỉ', key: 'address', width: 40 },
      { header: 'Học vấn', key: 'education', width: 15 },
      { header: 'Ca làm', key: 'shift', width: 20 },
      { header: 'Ngày nhận việc', key: 'startDate', width: 15 },
      { header: 'Ngày ứng tuyển', key: 'appliedAt', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 20 },
      { header: 'Ngày trúng tuyển', key: 'hiredAt', width: 15 },
      { header: 'Ngày hết hạn', key: 'expiredAt', width: 15 },
      { header: 'Ghi chú', key: 'note', width: 30 }
    ];

    // Format header row
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    data.forEach((app: any) => {
      sheet.addRow({
        id: app.applicationId,
        name: app.fullName,
        dob: app.dateOfBirth,
        cccd: `'${app.cccd}`, // Prevent scientific notation for large numbers
        phone: `'${app.phone}`, // Prevent leading zero loss
        gender: app.gender,
        address: app.permanentAddress,
        education: app.education,
        shift: app.preferredShift,
        startDate: app.availableStartDate,
        appliedAt: app.appliedAt ? new Date(app.appliedAt._seconds * 1000).toLocaleString('vi-VN') : '',
        status: app.status,
        hiredAt: app.hiredAt ? new Date(app.hiredAt._seconds * 1000).toLocaleDateString('vi-VN') : '',
        expiredAt: app.expiredAt ? new Date(app.expiredAt._seconds * 1000).toLocaleDateString('vi-VN') : '',
        note: app.adminNote || app.note || ''
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="AGARI_Applications_${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
