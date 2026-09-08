import * as z from "zod";

export const applicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
  jobId: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  workSchedule: z.string().trim().optional(),
  opsCode: z.string().trim().optional(),
  dateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Vui lòng chọn ngày sinh hợp lệ",
    }),
  cccd: z
    .string()
    .trim()
    .regex(/^\d{12}$/, { message: "CCCD phải bao gồm đúng 12 chữ số" }),
  phone: z
    .string()
    .trim()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
      message: "Số điện thoại không hợp lệ",
    }),
  gender: z.enum(["Nam", "Nữ"] as [string, ...string[]], {
    message: "Vui lòng chọn giới tính",
  }),
  permanentAddress: z
    .string()
    .trim()
    .min(5, { message: "Vui lòng nhập địa chỉ cụ thể" }),
  preferredLocation: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng chọn khu vực muốn ứng tuyển" }),
  education: z.enum(
    ["9/12", "12/12", "Đã Tốt Nghiệp", "Khác"] as [string, ...string[]],
    { message: "Vui lòng chọn trình độ học vấn" },
  ),
  preferredShift: z.enum(
    [
      "Tôi Đã Từng làm việc dưới 1 tháng",
      "Tôi Đã Từng làm việc từ 1 tháng trở lên",
      "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển",
    ] as [string, ...string[]],
    { message: "Vui lòng chọn kinh nghiệm làm việc" },
  ),
  availableStartDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Vui lòng chọn ngày có thể nhận việc hợp lệ",
    }),
  note: z.string().trim().optional(),
});

export function normalizeApplicationPayload(raw: unknown) {
  const source =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  const stringValue = (value: unknown) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value === undefined || value === null ? "" : String(value).trim();
  };

  return {
    fullName: stringValue(source.fullName),
    jobId: stringValue(source.jobId) || "warehouse-rotating-shift",
    jobTitle: stringValue(source.jobTitle) || "Nhân viên kho - Ca xoay",
    workSchedule: stringValue(source.workSchedule),
    dateOfBirth: stringValue(source.dateOfBirth),
    cccd: stringValue(source.cccd).replace(/\s+/g, ""),
    phone: stringValue(source.phone).replace(/\s+/g, ""),
    gender: stringValue(source.gender),
    permanentAddress: stringValue(source.permanentAddress),
    preferredLocation: stringValue(source.preferredLocation ?? source.location),
    education: stringValue(source.education),
    preferredShift: stringValue(source.preferredShift),
    availableStartDate: stringValue(source.availableStartDate),
    note: stringValue(source.note),
    opsCode: stringValue(source.opsCode),
  };
}

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
