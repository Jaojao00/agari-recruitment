import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CandidateChatWidget from "@/components/chat/CandidateChatWidget";
import { FloatingApplicantNotification } from "@/components/social-proof/LiveRecruitmentProof";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Tuyển Dụng Nhân Viên Kho | AGARI",
  description:
    "Tuyển dụng nhân viên kho với thu nhập hấp dẫn, phụ cấp, thưởng và nhiều quyền lợi. Đăng ký ứng tuyển trực tuyến.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <FloatingApplicantNotification />
        <CandidateChatWidget />
      </body>
    </html>
  );
}
