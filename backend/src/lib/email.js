 const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"ResumeMetrics" <${config.email.user}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.clientUrl}/verify-email?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Verify your email — ResumeMetrics',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 0;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="text-align:center;">
                    <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#1a1a1a;">
                      Resu<span style="color:#6C5CE7;">Metrics</span>
                    </span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:32px 0 8px;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#1a1a1a;">
                Verify your email address
              </h1>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#666666;">
                Thanks for creating a ResumeMetrics account. Click the button below to verify your email address.
              </p>
            </td>
          </tr>
          <!-- Button -->
          <tr>
            <td style="padding:0 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${verificationUrl}" style="display:inline-block;padding:14px 40px;background-color:#6C5CE7;color:#ffffff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Verify Email</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Plain link -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#999999;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#6C5CE7;word-break:break-all;">
                <a href="${verificationUrl}" style="color:#6C5CE7;">${verificationUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Expiration notice -->
          <tr>
            <td style="padding:0 40px;text-align:center;">
              <p style="margin:0 0 32px;font-size:13px;color:#999999;">
                This verification link expires in <strong style="color:#666666;">24 hours</strong>.
                If you did not create an account, please ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;background-color:#fafafa;text-align:center;border-top:1px solid #e8e8e8;">
              <p style="margin:0 0 4px;font-size:12px;color:#999999;">
                ResumeMetrics &mdash; AI-powered resume analysis
              </p>
              <p style="margin:0;font-size:12px;color:#bbbbbb;">
                Need help? <a href="mailto:support@resumetrics.com" style="color:#6C5CE7;text-decoration:none;">Contact support</a>
              </p>
            </td>
          </tr>
        </table>
        <!-- Footer outside card -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;padding:16px 0 0;">
          <tr>
            <td style="text-align:center;font-size:11px;color:#bbbbbb;">
              &copy; ${new Date().getFullYear()} ResumeMetrics. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Reset your password — ResumeMetrics',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 0;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="text-align:center;">
                    <span style="font-family:Georgia,serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#1a1a1a;">
                      Resu<span style="color:#6C5CE7;">Metrics</span>
                    </span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:32px 0 8px;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#1a1a1a;">
                Reset your password
              </h1>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#666666;">
                We received a request to reset the password for your ResumeMetrics account. Click the button below to set a new password.
              </p>
            </td>
          </tr>
          <!-- Button -->
          <tr>
            <td style="padding:0 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 40px;background-color:#6C5CE7;color:#ffffff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Reset Password</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Plain link -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#999999;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#6C5CE7;word-break:break-all;">
                <a href="${resetUrl}" style="color:#6C5CE7;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Expiration notice -->
          <tr>
            <td style="padding:0 40px;text-align:center;">
              <p style="margin:0 0 32px;font-size:13px;color:#999999;">
                This password reset link expires in <strong style="color:#666666;">1 hour</strong>.
                If you did not request a password reset, please ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;background-color:#fafafa;text-align:center;border-top:1px solid #e8e8e8;">
              <p style="margin:0 0 4px;font-size:12px;color:#999999;">
                ResumeMetrics &mdash; AI-powered resume analysis
              </p>
              <p style="margin:0;font-size:12px;color:#bbbbbb;">
                Need help? <a href="mailto:support@resumetrics.com" style="color:#6C5CE7;text-decoration:none;">Contact support</a>
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;padding:16px 0 0;">
          <tr>
            <td style="text-align:center;font-size:11px;color:#bbbbbb;">
              &copy; ${new Date().getFullYear()} ResumeMetrics. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
};

module.exports = { transporter, sendEmail, sendVerificationEmail, sendPasswordResetEmail };