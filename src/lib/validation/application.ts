import * as z from 'zod';

export const applicationSchema = z.object({
  fullName: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Vui lòng chọn ngày sinh hợp lệ' }),
  cccd: z.string().regex(/^\d{12}$/, { message: 'CCCD phải bao gồm đúng 12 chữ số' }),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Số điện thoại không hợp lệ' }),
  gender: z.enum(['Nam', 'Nữ'], { required_error: 'Vui lòng chọn giới tính' }),
  permanentAddress: z.string().min(10, { message: 'Vui lòng nhập địa chỉ thường trú đầy đủ' }),
  education: z.enum(['9/12', '10/12', '11/12', '12/12', 'Khác'], { required_error: 'Vui lòng chọn trình độ học vấn' }),
  preferredShift: z.enum(['Ca 1: 06:00 - 15:00', 'Ca 2: 15:00 - 22:00', 'Ca 3: 18:00 - 22:00'], { required_error: 'Vui lòng chọn ca làm việc' }),
  availableStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Vui lòng chọn ngày có thể nhận việc hợp lệ' }),
  note: z.string().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
