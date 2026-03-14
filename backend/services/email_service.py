import smtplib
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import config

FROM_NAME = 'Haven of Hope Academy'
FROM_EMAIL = config.SMTP_USER or 'noreply@havenofhope.edu'


def _strip_html(html):
    """Remove HTML tags for plain-text fallback. Not safe for untrusted input."""
    result = re.sub(r'<(script|style)[^>]*>[\s\S]*?</\1>', ' ', html, flags=re.IGNORECASE)
    result = re.sub(r'<[^>]+>', ' ', result)
    result = re.sub(r'\s{2,}', ' ', result)
    return result.strip()


def send_email(*, to, subject, html, text=None):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'"{FROM_NAME}" <{FROM_EMAIL}>'
    msg['To'] = to

    plain_text = text or _strip_html(html)
    msg.attach(MIMEText(plain_text, 'plain'))
    msg.attach(MIMEText(html, 'html'))

    if config.SMTP_SECURE:
        smtp_cls = smtplib.SMTP_SSL
    else:
        smtp_cls = smtplib.SMTP

    with smtp_cls(config.SMTP_HOST, config.SMTP_PORT) as server:
        if not config.SMTP_SECURE:
            server.starttls()
        if config.SMTP_USER and config.SMTP_PASS:
            server.login(config.SMTP_USER, config.SMTP_PASS)
        server.sendmail(FROM_EMAIL, to, msg.as_string())

    print(f'Email sent to {to}: {subject}')
    return {'to': to, 'subject': subject}


def send_welcome_email(user):
    name = user.get('name', '')
    email = user.get('email', '')
    role = user.get('role', 'student')

    portal_urls = {
        'student': f"{config.FRONTEND_URL}/student/dashboard",
        'teacher': f"{config.FRONTEND_URL}/teacher/dashboard",
        'parent': f"{config.FRONTEND_URL}/parent/dashboard",
        'admin': f"{config.FRONTEND_URL}/admin/dashboard",
    }
    portal_url = portal_urls.get(role, f"{config.FRONTEND_URL}/login")

    html = f"""
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
          <h2 style="color: #166534;">Welcome, {name}! 👋</h2>
          <p style="color: #374151;">Your account has been successfully created at Haven of Hope Academy. You can now access your {role} portal.</p>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;"><strong>Email:</strong> {email}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Role:</strong> {role.capitalize()}</p>
          </div>
          <a href="{portal_url}" style="display: inline-block; background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            Access Your Portal &rarr;
          </a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you did not create this account, please contact us immediately.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Haven of Hope Academy &middot; Hmarkhawlien, Cachar, Assam
        </div>
      </div>
    </body>
    </html>
    """
    return send_email(to=email, subject=f'Welcome to Haven of Hope Academy \u2013 {name}', html=html)


def send_admission_confirmation(applicant):
    student_name = applicant.get('studentName', '')
    guardian_email = applicant.get('guardianEmail', '')
    guardian_name = applicant.get('guardianName', '')
    applied_class = applicant.get('appliedClass', '')

    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f0fdf4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #166534, #16a34a); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Haven of Hope Academy</h1>
          <p style="color: #bbf7d0; margin: 8px 0 0;">Admission Application Received</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #166534;">Dear {guardian_name},</h2>
          <p style="color: #374151;">Thank you for applying to Haven of Hope Academy. We have received the admission application for <strong>{student_name}</strong>.</p>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;"><strong>Student Name:</strong> {student_name}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Applied Class:</strong> {applied_class}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Status:</strong> Under Review</p>
          </div>
          <p style="color: #374151;">Our admissions team will review the application and contact you within 3-5 working days regarding the next steps.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">For inquiries, contact us at +91 XXXXX XXXXX or visit our school office.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Haven of Hope Academy &middot; Hmarkhawlien, Cachar, Assam
        </div>
      </div>
    </body>
    </html>
    """
    return send_email(
        to=guardian_email,
        subject=f'Admission Application Received \u2013 {student_name}',
        html=html,
    )


def send_password_reset_email(email, reset_token):
    reset_url = f"{config.FRONTEND_URL}/reset-password?token={reset_token}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #166534;">Password Reset Request</h2>
      <p>You requested a password reset for your Haven of Hope Academy account.</p>
      <a href="{reset_url}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
        Reset Password &rarr;
      </a>
      <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you did not request a password reset, ignore this email.</p>
    </div>
    """
    return send_email(to=email, subject='Password Reset \u2013 Haven of Hope Academy', html=html)
