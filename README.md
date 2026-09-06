# AGARI - Hệ Thống Tuyển Dụng Nhân Viên Kho

Hệ thống quản lý tuyển dụng chuyên nghiệp được xây dựng bằng Next.js, Tailwind CSS, shadcn/ui và Firebase.

## Kiến trúc hệ thống

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes / Server Actions
- **Database:** Firebase Firestore (Source of Truth)
- **Authentication:** Firebase Auth
- **Tích hợp:** Google Sheets API (Sync Queue / Idempotency), ExcelJS (Export)

## Yêu cầu cài đặt

- Node.js >= 18
- Tài khoản Firebase (Firestore, Auth)
- Tài khoản Google Cloud (Service Account cho Google Sheets API)

## Hướng dẫn cài đặt & Chạy Local

### 1. Cài đặt Dependencies

```bash
npm install
```

### 2. Cấu hình Biến Môi Trường (Environment Variables)

Tạo file `.env.local` ở thư mục gốc và sao chép cấu hình từ `.env.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Bắt buộc cho Backend / Admin SDK
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Bắt buộc cho tính năng đồng bộ Google Sheets
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

_Lưu ý: Bạn cần share quyền Edit Google Sheet của bạn cho `GOOGLE_SERVICE_ACCOUNT_EMAIL`._

### 3. Cấu hình Firebase

- Vào Firebase Console, bật **Authentication** (Email/Password).
- Bật **Firestore Database**.
- Cập nhật **Security Rules** trong Firestore bằng nội dung của file `firestore.rules`.
- Tạo thủ công một User Admin đầu tiên trong Authentication và thêm email đó vào collection `admins` trong Firestore để cấp quyền đăng nhập Admin Dashboard.

### 4. Chạy dự án

```bash
npm run dev
```

Trang chủ: `http://localhost:3000`
Admin: `http://localhost:3000/admin`

## Cơ chế đồng bộ Google Sheets

- Hệ thống sử dụng một Background Sync Queue (`/api/sync/process`).
- Khi hồ sơ được submit hoặc được Admin cập nhật, hệ thống ghi trực tiếp vào Google Sheets.
- Tiến trình đồng bộ sẽ quét Queue và cập nhật (nếu đã có row) hoặc tạo mới row trong Google Sheets.
- Nếu Google Sheets API bị lỗi, trạng thái sẽ là `FAILED` và Admin có thể chủ động bấm **"Retry Sync"** tại trang chi tiết ứng viên.

## Triển khai (Deployment)

- **Frontend & Backend API:** Khuyên dùng **Vercel** vì hỗ trợ tối đa cho Next.js App Router. Thêm toàn bộ các biến môi trường vào phần cấu hình Vercel.
- Đảm bảo `FIREBASE_PRIVATE_KEY` và `GOOGLE_PRIVATE_KEY` được truyền vào dạng string có chứa `\n`.
