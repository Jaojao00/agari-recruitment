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

  education: "9/12" | "10/12" | "11/12" | "12/12" | "Khác";
  preferredShift:
    | "Ca 1: 06:00 - 15:00"
    | "Ca 2: 15:00 - 22:00"
    | "Ca 3: 18:00 - 22:00";
  availableStartDate: string; // YYYY-MM-DD
  note?: string;

  status: ApplicationStatus;

  appliedAt: any; // Firestore Timestamp
  contactedAt?: any;
  interviewDate?: any;
  hiredAt?: any;
  expiredAt?: any;
  workingStartDate?: any;

  adminNote?: string;

  createdAt: any;
  updatedAt: any;

  googleSheetSyncStatus: SyncStatus;
  googleSheetRow?: number;
  googleSheetLastSyncAt?: any;
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
  changes?: Record<string, any>;
  adminId: string;
  adminName: string;
  createdAt: any;
}
