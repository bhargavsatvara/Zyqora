// utils/emailTemplates.js
exports.successEmail = (name) => {
  const year = new Date().getFullYear();
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Zyqora</title>
  <style>
    /* Reset styles for consistent rendering */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-rspace:0pt; mso-table-lspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    table { border-collapse:collapse !important; }
    body { margin:0!important; padding:0!important; width:100%!important; background-color:#fff2e6; }

    /* Responsive */
    @media screen and (max-width:600px) {
      .email-container { width:100%!important; }
      .fluid { max-width:100%!important; height:auto!important; }
      .stack-column, .stack-column-center {
        display:block!important;
        width:100%!important;
        max-width:100%!important;
      }
      .stack-column-center { text-align:center!important; }
      .center-on-narrow {
        text-align:center!important;
        display:block!important;
        margin:0 auto!important;
        float:none!important;
      }
    }
  </style>
</head>
<body style="background-color:#fff2e6; margin:0; padding:0;">
  <center style="width:100%; background-color:#fff2e6;">
    <table
      align="center"
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="520"
      class="email-container"
      style="
        width:520px;
        margin:auto;
        background-color:#ffffff;
        border:1px solid #e0e0e0;
        border-top:4px solid #f97316;
        border-radius:8px;
        overflow:hidden;
      ">

      <!-- HEADER -->
      <tr>
        <td style="padding:40px 0; text-align:center; background-color:#ffffff;">
          <img
            src="cid:zyqoraLogo"
            width="120"
            height="auto"
            class="fluid"
            alt="Zyqora"
            style="display:block; margin:auto;"
          />
        </td>
      </tr>

      <!-- HERO -->
      <tr>
        <td
          style="
            background-color:#ffffff;
            padding:30px 15px;
            text-align:center;
            font-family:'DM Sans',sans-serif;
          ">
          <h1 style="margin:0; font-size:24px; font-weight:700; color:#161c2d;">
            Welcome to Zyqora!
          </h1>
          <p style="margin:12px 0 0; font-size:14px; color:#6b7280; line-height:1.5;">
            Hi ${name},<br/>
            Thanks for joining us. We’re thrilled to have you on board.
          </p>
        </td>
      </tr>

      <!-- BUTTON -->
      <tr>
        <td style="background-color:#ffffff; text-align:center; padding:15px;">
          <a
            href="${loginUrl}"
            style="
              font-family:'DM Sans',sans-serif;
              font-size:14px;
              font-weight:600;
              color:#ffffff;
              text-decoration:none;
              background-color:#f97316;
              padding:10px 20px;
              border-radius:6px;
              display:inline-block;
              border:1px solid #f97316;
            ">
            Log in to your account
          </a>
        </td>
      </tr>

      <!-- BENEFITS -->
      <tr>
        <td
          style="
            background-color:#ffffff;
            padding:20px 15px;
            text-align:center;
            font-family:'DM Sans',sans-serif;
          ">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="stack-column-center" style="padding:8px;">
                <div
                  style="
                    display:inline-block;
                    padding:8px;
                    border:1px solid #e0e0e0;
                    border-radius:4px;
                    text-align:center;
                  ">
                  <p style="margin:0; font-size:12px; color:#161c2d; font-weight:600;">
                    🚚 Free Delivery
                  </p>
                </div>
              </td>
              <td class="stack-column-center" style="padding:8px;">
                <div
                  style="
                    display:inline-block;
                    padding:8px;
                    border:1px solid #e0e0e0;
                    border-radius:4px;
                    text-align:center;
                  ">
                  <p style="margin:0; font-size:12px; color:#161c2d; font-weight:600;">
                    📦 Non-Contact Delivery
                  </p>
                </div>
              </td>
              <td class="stack-column-center" style="padding:8px;">
                <div
                  style="
                    display:inline-block;
                    padding:8px;
                    border:1px solid #e0e0e0;
                    border-radius:4px;
                    text-align:center;
                  ">
                  <p style="margin:0; font-size:12px; color:#161c2d; font-weight:600;">
                    🔒 Secure Payments
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td
          style="
            background-color:#161c2d;
            padding:15px;
            text-align:center;
            font-family:'DM Sans',sans-serif;
            color:#ffffff;
            font-size:10px;
            line-height:1.4;
          ">
          <p style="margin:0;">© ${year} Zyqora. All rights reserved.</p>
          <p style="margin:4px 0 0;">
            Designed by
            <a href="https://Zyqora.in/" style="color:#f97316; text-decoration:none;">
              Zyqora
            </a>
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`;}

// utils/emailTemplates.js
exports.resetPasswordEmail = (userName, resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:DM Sans, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px 0;">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px;background:#f8fafc;">
              <h1 style="margin:0;font-size:24px;color:#333;">Forgot Your Password?</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:24px;color:#555;">
              <p style="margin-top:0;">Hi ${userName},</p>
              <p>You recently requested to reset your password for your Zyqora account. Click the button below to reset it. This link will expire in 2 hours.</p>
              <p style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}"
                   style="
                     display:inline-block;
                     padding:12px 24px;
                     background:#f97316;
                     color:#ffffff;
                     text-decoration:none;
                     border-radius:4px;
                     font-weight:500;
                   ">
                  Reset My Password
                </a>
              </p>
              <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
              <p>Thanks,<br/>The Zyqora Team</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:16px;background:#161c2d;color:#fff;font-size:12px;">
              &copy; ${new Date().getFullYear()} Zyqora. All rights reserved.
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
