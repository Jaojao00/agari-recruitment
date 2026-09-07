export type ApplicationStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEWED"
  | "PASSED"
  | "FAILED"
  | "HIRED"
  | "WORKING"
  | "EXPIRED"
  | "CANCELLED";

export type SyncStatus = "PENDING" | "SUCCESS" | "FAILED";
export type DateValue = string | number | Date | { _seconds: number };

export interface Application {
  id?: string;
  applicationId: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  cccd: string;
  phone: string;
  gender: "Nam" | "Nữ";
  preferredLocation?: string;
  permanentAddress: string;

  education: "9/12" | "12/12" | "Đã Tốt Nghiệp" | "Khác";
  preferredShift:
    | "Tôi Đã Từng làm việc dưới 1 tháng"
    | "Tôi Đã Từng làm việc từ 1 tháng trở lên"
    | "Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển";
  availableStartDate: string; // YYYY-MM-DD
  note?: string;

  status: ApplicationStatus;

  appliedAt: DateValue; // Firestore Timestamp or serialized date
  contactedAt?: DateValue;
  interviewDate?: DateValue;
  hiredAt?: DateValue;
  expiredAt?: DateValue;
  workingStartDate?: DateValue;

  adminNote?: string;

  createdAt: DateValue;
  updatedAt: DateValue;

  googleSheetSyncStatus: SyncStatus;
  googleSheetRow?: number;
  googleSheetLastSyncAt?: DateValue;
  googleSheetSyncError?: string;

  createdBy?: string;
  updatedBy?: string;
}

export interface ApplicationLog {
  id?: string;
  applicationId: string; // ID của document application
  action: string;
  oldStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
  changes?: Record<string, unknown>;
  adminId: string;
  adminName: string;
  createdAt: DateValue;
}
