import nodemailer from "nodemailer";

export const HR_EMAIL =
  process.env.HR_NOTIFICATION_EMAIL?.trim() || "tainguyenhr.dev@gmail.com";

const STATUS_VI: Record<string, string> = {
  NEW: "Đang xử lý",
  CONTACTED: "Đã liên hệ",
  INTERVIEW_SCHEDULED: "Lịch hẹn phỏng vấn",
  INTERVIEWED: "Đã phỏng vấn",
  PASSED: "ĐẠT PHỎNG VẤN",
  HIRED: "ĐÃ TRÚNG TUYỂN",
  WORKING: "ĐÃ NHẬN VIỆC",
  FAILED: "Chưa phù hợp",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã hủy",
};

function getSmtpTransporter() {
  const user = process.env.GMAIL_USER?.trim() || HR_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD?.trim()?.replace(/\s+/g, "");
  if (!pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

async function sendEmailViaTransport(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const to = params.to.trim();
  if (!to || !to.includes("@")) return false;

  // 1. Try Gmail SMTP via Nodemailer if GMAIL_APP_PASSWORD is set
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const fromUser = process.env.GMAIL_USER?.trim() || HR_EMAIL;
      await transporter.sendMail({
        from: `"Tuyển Dụng AGARI - SPX Express" <${fromUser}>`,
        to,
        replyTo: params.replyTo || HR_EMAIL,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      return true;
    } catch (err) {
      console.error("Nodemailer send error:", err);
    }
  }

  // 2. Try Google Apps Script Web App Webhook if configured
  const gasUrl = process.env.GOOGLE_APPS_SCRIPT_MAIL_URL?.trim();
  if (gasUrl) {
    try {
      const res = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject: params.subject,
          htmlBody: params.html,
          body: params.text,
          replyTo: params.replyTo || HR_EMAIL,
        }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.error("GAS mail webhook error:", err);
    }
  }

  // 3. Fallback for HR notification to tainguyenhr.dev@gmail.com via FormSubmit AJAX
  if (to.toLowerCase() === HR_EMAIL.toLowerCase()) {
    try {
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(HR_EMAIL)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: params.subject,
          message: params.text,
          _template: "table",
        }),
      });
      return true;
    } catch {
      // ignore
    }
  }

  return false;
}

export async function sendNewApplicationEmails(app: {
  applicationId: string;
  fullName: string;
  phone: string;
  email?: string;
  cccd?: string;
  dateOfBirth?: string;
  gender?: string;
  opsCode?: string;
  jobTitle?: string;
  workSchedule?: string;
  preferredLocation?: string;
  permanentAddress?: string;
  availableStartDate?: string;
  note?: string;
}) {
  const hrSubject = `[AGARI Tuyển Dụng] Hồ sơ mới ${app.applicationId} - ${app.fullName} (${app.jobTitle || "Nhân viên kho"})`;
  const hrText = [
    `THÔNG BÁO HỒ SƠ ỨNG TUYỂN MỚI TRÊN WEB AGARI`,
    `--------------------------------------------`,
    `Mã hồ sơ: ${app.applicationId}`,
    `Họ và tên: ${app.fullName}`,
    `Số điện thoại Zalo: ${app.phone}`,
    `Gmail ứng viên: ${app.email || "Chưa cung cấp"}`,
    `Số CCCD: ${app.cccd || "-"}`,
    `Ngày sinh: ${app.dateOfBirth || "-"} | Giới tính: ${app.gender || "-"}`,
    `Mã Ops: ${app.opsCode || "Mới"}`,
    `Vị trí ứng tuyển: ${app.jobTitle || "Nhân viên kho SPX"}`,
    `Khu vực / Kho: ${app.preferredLocation || "-"}`,
    `Ca đăng ký: ${app.workSchedule || "-"}`,
    `Địa chỉ: ${app.permanentAddress || "-"}`,
    `Ngày có thể nhận việc: ${app.availableStartDate || "-"}`,
    `Ghi chú: ${app.note || "Không có"}`,
    `--------------------------------------------`,
    `Quản lý & Phản hồi ứng viên tại: https://agari-recruitment.vercel.app/admin/chat`,
  ].join("\n");

  const hrHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #fecaca; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #990000, #D90000); color: #ffffff; padding: 18px 24px;">
        <h2 style="margin: 0; font-size: 18px; text-transform: uppercase;">🚨 Hồ Sơ Ứng Tuyển Mới - AGARI</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #fef08a;">Mã hồ sơ: <strong>${app.applicationId}</strong></p>
      </div>
      <div style="padding: 20px 24px; background: #ffffff; color: #1e293b; font-size: 14px; line-height: 1.6;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 160px;">Họ và tên:</td><td style="padding: 6px 0; font-weight: bold;">${app.fullName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Số điện thoại Zalo:</td><td style="padding: 6px 0; font-weight: bold; color: #d90000;">${app.phone}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Gmail ứng viên:</td><td style="padding: 6px 0; font-weight: bold;">${app.email || "Chưa cung cấp"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Số CCCD:</td><td style="padding: 6px 0;">${app.cccd || "-"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Ngày sinh / Giới tính:</td><td style="padding: 6px 0;">${app.dateOfBirth || "-"} • ${app.gender || "-"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Vị trí ứng tuyển:</td><td style="padding: 6px 0; font-weight: bold;">${app.jobTitle || "Nhân viên kho SPX"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Khu vực / Kho:</td><td style="padding: 6px 0; font-weight: bold; color: #b91c1c;">${app.preferredLocation || "-"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Ca đăng ký:</td><td style="padding: 6px 0;">${app.workSchedule || "-"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Địa chỉ hiện tại:</td><td style="padding: 6px 0;">${app.permanentAddress || "-"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Ngày nhận việc:</td><td style="padding: 6px 0;">${app.availableStartDate || "-"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Ghi chú:</td><td style="padding: 6px 0;">${app.note || "Không có"}</td></tr>
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="https://agari-recruitment.vercel.app/admin/chat" style="display: inline-block; background: #D90000; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 22px; border-radius: 8px;">Mở Trang Quản Trị & Chat Với Ứng Viên</a>
        </div>
      </div>
    </div>
  `;

  await sendEmailViaTransport({
    to: HR_EMAIL,
    subject: hrSubject,
    html: hrHtml,
    text: hrText,
    replyTo: app.email || HR_EMAIL,
  });

  // Also send confirmation email to the candidate if they provided a Gmail address
  if (app.email && app.email.includes("@")) {
    const candSubject = `[AGARI - SPX Express] Xác nhận tiếp nhận hồ sơ ứng tuyển (${app.applicationId})`;
    const candText = [
      `Xin chào ${app.fullName},`,
      `Hệ thống Tuyển dụng AGARI - SPX Express đã tiếp nhận thành công hồ sơ ứng tuyển của bạn!`,
      `- Mã hồ sơ: ${app.applicationId}`,
      `- Vị trí: ${app.jobTitle || "Nhân viên kho SPX"}`,
      `- Khu vực đăng ký: ${app.preferredLocation || ""}`,
      `- Ca làm việc: ${app.workSchedule || ""}`,
      ``,
      `Bộ phận Nhân sự sẽ kiểm tra và gửi kết quả / lịch hẹn phỏng vấn qua Gmail này hoặc qua SĐT/Zalo (${app.phone}).`,
      `Bạn cũng có thể tra cứu trạng thái hồ sơ & chat trực tiếp với HR tại: https://agari-recruitment.vercel.app/ho-so-online`,
    ].join("\n");

    const candHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fecaca; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #990000, #D90000); color: #ffffff; padding: 18px 24px;">
          <h2 style="margin: 0; font-size: 18px; text-transform: uppercase;">Xác Nhận Tiếp Nhận Hồ Sơ Ứng Tuyển</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #fef08a;">Hệ thống Tuyển dụng AGARI – Kho SPX Express</p>
        </div>
        <div style="padding: 20px 24px; background: #ffffff; color: #1e293b; font-size: 14px; line-height: 1.6;">
          <p>Xin chào <strong>${app.fullName}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký ứng tuyển tại <strong>AGARI – SPX Express</strong>. Thông tin hồ sơ của bạn đã được ghi nhận trên hệ thống:</p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px 16px; margin: 14px 0;">
            <p style="margin: 4px 0;">📌 <strong>Mã hồ sơ:</strong> <span style="color: #d90000; font-weight: bold;">${app.applicationId}</span></p>
            <p style="margin: 4px 0;">💼 <strong>Vị trí:</strong> ${app.jobTitle || "Nhân viên kho SPX"}</p>
            <p style="margin: 4px 0;">📍 <strong>Khu vực:</strong> ${app.preferredLocation || "-"}</p>
            <p style="margin: 4px 0;">⏰ <strong>Ca đăng ký:</strong> ${app.workSchedule || "-"}</p>
          </div>
          <p>Bộ phận Tuyển dụng sẽ sớm phản hồi kết quả và lịch phỏng vấn trực tiếp qua <strong>Gmail</strong> này cũng như qua <strong>Zalo/SĐT (${app.phone})</strong> của bạn.</p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://agari-recruitment.vercel.app/ho-so-online" style="display: inline-block; background: #D90000; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 22px; border-radius: 8px;">Tra Cứu Hồ Sơ & Chat Trực Tiếp Với HR</a>
          </div>
        </div>
      </div>
    `;

    await sendEmailViaTransport({
      to: app.email,
      subject: candSubject,
      html: candHtml,
      text: candText,
      replyTo: HR_EMAIL,
    });
  }
}

export async function sendCandidateResultEmail(params: {
  candidateEmail?: string;
  candidateName: string;
  candidatePhone: string;
  applicationId?: string;
  jobTitle?: string;
  status: string;
  adminNote?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  documents?: string;
}): Promise<boolean> {
  const email = params.candidateEmail?.trim();
  if (!email || !email.includes("@")) return false;

  const statusLabel = STATUS_VI[params.status] || params.status;
  const isInterview = params.status === "INTERVIEW_SCHEDULED";
  const isPassed =
    params.status === "PASSED" ||
    params.status === "HIRED" ||
    params.status === "WORKING";

  const subject = isInterview
    ? `[AGARI - SPX Express] Thư mời phỏng vấn trực tiếp - ${params.candidateName} (${params.applicationId || ""})`
    : isPassed
      ? `[AGARI - SPX Express] Chúc mừng kết quả ứng tuyển: ${statusLabel} - ${params.candidateName}`
      : `[AGARI - SPX Express] Thông báo cập nhật trạng thái hồ sơ (${statusLabel}) - ${params.candidateName}`;

  const interviewBlockHtml =
    isInterview || params.interviewDate || params.interviewLocation
      ? `
      <div style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 10px; padding: 14px 16px; margin: 14px 0;">
        <h3 style="margin: 0 0 8px; color: #92400e; font-size: 15px;">📅 THÔNG TIN LỊCH HẸN PHỎNG VẤN:</h3>
        ${params.interviewTime || params.interviewDate ? `<p style="margin: 4px 0;">⏰ <strong>Thời gian:</strong> <span style="color: #d90000; font-weight: bold;">${params.interviewTime || "09:00"} - Ngày ${params.interviewDate || ""}</span></p>` : ""}
        ${params.interviewLocation ? `<p style="margin: 4px 0;">📍 <strong>Địa điểm:</strong> ${params.interviewLocation}</p>` : ""}
        <p style="margin: 4px 0;">🪪 <strong>Giấy tờ cần mang:</strong> ${params.documents || "CCCD gắn chip bản gốc (và VNeID Mức 2)"}</p>
      </div>
    `
      : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fecaca; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #990000, #D90000); color: #ffffff; padding: 18px 24px;">
        <h2 style="margin: 0; font-size: 18px; text-transform: uppercase;">Thông Báo Kết Quả Hồ Sơ Ứng Tuyển</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #fef08a;">Bộ phận Tuyển dụng AGARI – Kho SPX Express</p>
      </div>
      <div style="padding: 20px 24px; background: #ffffff; color: #1e293b; font-size: 14px; line-height: 1.6;">
        <p>Xin chào <strong>${params.candidateName}</strong>,</p>
        <p>Bộ phận Tuyển dụng AGARI xin thông báo trạng thái mới nhất của hồ sơ ứng tuyển ${params.applicationId ? `(Mã: <strong>${params.applicationId}</strong>)` : ""} của bạn:</p>
        <div style="background: #f8fafc; border-left: 4px solid #D90000; padding: 12px 16px; margin: 14px 0;">
          <p style="margin: 4px 0;">💼 <strong>Vị trí:</strong> ${params.jobTitle || "Nhân viên kho SPX Express"}</p>
          <p style="margin: 4px 0;">🔔 <strong>Trạng thái kết quả:</strong> <span style="color: #d90000; font-weight: bold; font-size: 15px;">${statusLabel}</span></p>
          ${params.adminNote ? `<p style="margin: 6px 0 0;">📝 <strong>Ghi chú từ Nhân sự:</strong> ${params.adminNote}</p>` : ""}
        </div>
        ${interviewBlockHtml}
        <p>Nếu có bất kỳ thắc mắc nào, bạn có thể trả lời trực tiếp email này (${HR_EMAIL}) hoặc mở khung Chat trực tuyến trên website tuyển dụng AGARI.</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://agari-recruitment.vercel.app/ho-so-online" style="display: inline-block; background: #D90000; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 22px; border-radius: 8px;">Xem Chi Tiết & Chat Trực Tiếp Với HR</a>
        </div>
      </div>
    </div>
  `;

  const text = [
    `Xin chào ${params.candidateName},`,
    `Bộ phận Tuyển dụng AGARI thông báo kết quả hồ sơ ${params.applicationId || ""} của bạn:`,
    `- Vị trí: ${params.jobTitle || "Nhân viên kho SPX Express"}`,
    `- Trạng thái kết quả: ${statusLabel}`,
    params.adminNote ? `- Ghi chú từ HR: ${params.adminNote}` : "",
    params.interviewDate
      ? `- Thời gian phỏng vấn: ${params.interviewTime || "09:00"} ngày ${params.interviewDate}`
      : "",
    params.interviewLocation
      ? `- Địa điểm phỏng vấn: ${params.interviewLocation}`
      : "",
    `Xem chi tiết hoặc chat với HR tại: https://agari-recruitment.vercel.app/ho-so-online`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendEmailViaTransport({
    to: email,
    subject,
    html,
    text,
    replyTo: HR_EMAIL,
  });
}
