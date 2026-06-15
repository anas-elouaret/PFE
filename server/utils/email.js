const nodemailer = require("nodemailer");

const getTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } =
    process.env;

  if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT || "587", 10),
      secure: EMAIL_PORT === "465",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: { user: "resend", pass: process.env.RESEND_API_KEY },
    });
  }

  if (process.env.MAILTRAP_HOST) {
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT || "587", 10),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  console.warn("No email config found — using ethereal test account");
  return nodemailer.createTestAccount().then((account) =>
    nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    }),
  );
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = await getTransporter();
  const from = process.env.EMAIL_FROM || "noreply@growstack.app";
  const info = await transporter.sendMail({ from, to, subject, html });

  if (info.messageId && info.messageId.includes("ethereal")) {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
};

const verificationEmail = (name, token) => ({
  subject: "Verify your email — growstack",
  html: `<!DOCTYPE html>
<html lang="en" style="background:#070707;margin:0;padding:0">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
<tr><td style="padding:32px 32px 0;text-align:center">
<h1 style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin:0">
growstack<span style="color:#00AEEF">.</span>
</h1>
</td></tr>
<tr><td style="padding:40px 32px;background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));border-radius:16px;border:1px solid rgba(255,255,255,0.06)">
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">Verify your email</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
Hi ${name},<br>Click the button below to verify your email address and activate your account.
</p>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/client/verify-email?token=${token}"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    Verify Email
</a>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin:24px 0 0;line-height:1.5">
This link expires in 24 hours.<br>If you didn't create an account, ignore this email.
</p>
</td></tr>
<tr><td style="padding:24px 32px;text-align:center">
<p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0">&copy; ${new Date().getFullYear()} growstack. All rights reserved.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`,
});

const resetPasswordEmail = (name, token) => ({
  subject: "Reset your password — growstack",
  html: `<!DOCTYPE html>
<html lang="en" style="background:#070707;margin:0;padding:0">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
<tr><td style="padding:32px 32px 0;text-align:center">
<h1 style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin:0">
growstack<span style="color:#00AEEF">.</span>
</h1>
</td></tr>
<tr><td style="padding:40px 32px;background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));border-radius:16px;border:1px solid rgba(255,255,255,0.06)">
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">Reset your password</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
Hi ${name},<br>We received a request to reset your password. Click below to set a new one.
</p>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/client/reset-password?token=${token}"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    Reset Password
</a>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin:24px 0 0;line-height:1.5">
This link expires in 1 hour.<br>If you didn't request this, ignore this email.
</p>
</td></tr>
<tr><td style="padding:24px 32px;text-align:center">
<p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0">&copy; ${new Date().getFullYear()} growstack. All rights reserved.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`,
});

module.exports = { sendEmail, verificationEmail, resetPasswordEmail };
