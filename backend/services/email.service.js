import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM_NAME  = 'Haven of Hope Academy';
const FROM_EMAIL = process.env.SMTP_USER || 'noreply@havenofhope.edu';

function stripHtml(html) {
  // Single-pass replacement of all HTML tags with spaces.
  // Used only for plain-text email fallback (not browser-rendered).
  return html
    .replace(/[<][^>]*[>]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
    text: text || stripHtml(html),
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to}: ${info.messageId}`);
  return info;
}

export async function sendWelcomeEmail(user) {
  const { name, email, role } = user;
  const portalUrl = {
    student: `${process.env.FRONTEND_URL}/student/dashboard`,
    teacher: `${process.env.FRONTEND_URL}/teacher/dashboard`,
    parent:  `${process.env.FRONTEND_URL}/parent/dashboard`,
    admin:   `${process.env.FRONTEND_URL}/admin/dashboard`,
  }[role] || `${process.env.FRONTEND_URL}/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f0fdf4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #166534, #16a34a); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Haven of Hope Academy</h1>
          <p style="color: #bbf7d0; margin: 8px 0 0;">Learning Today, Leading Tomorrow</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #166534;">Welcome, ${name}! 👋</h2>
          <p style="color: #374151;">Your account has been successfully created at Haven of Hope Academy. You can now access your ${role} portal.</p>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
          <a href="${portalUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            Access Your Portal →
          </a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you did not create this account, please contact us immediately.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Haven of Hope Academy · Hmarkhawlien, Cachar, Assam
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: `Welcome to Haven of Hope Academy – ${name}`, html });
}

export async function sendAdmissionConfirmation(applicant) {
  const { studentName, guardianEmail, guardianName, appliedClass } = applicant;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f0fdf4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #166534, #16a34a); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Haven of Hope Academy</h1>
          <p style="color: #bbf7d0; margin: 8px 0 0;">Admission Application Received</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #166534;">Dear ${guardianName},</h2>
          <p style="color: #374151;">Thank you for applying to Haven of Hope Academy. We have received the admission application for <strong>${studentName}</strong>.</p>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;"><strong>Student Name:</strong> ${studentName}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Applied Class:</strong> ${appliedClass}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Status:</strong> Under Review</p>
          </div>
          <p style="color: #374151;">Our admissions team will review the application and contact you within 3-5 working days regarding the next steps.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">For inquiries, contact us at +91 XXXXX XXXXX or visit our school office.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Haven of Hope Academy · Hmarkhawlien, Cachar, Assam
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: guardianEmail, subject: `Admission Application Received – ${studentName}`, html });
}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #166534;">Password Reset Request</h2>
      <p>You requested a password reset for your Haven of Hope Academy account.</p>
      <a href="${resetUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
        Reset Password →
      </a>
      <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you did not request a password reset, ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Password Reset – Haven of Hope Academy', html });
}
