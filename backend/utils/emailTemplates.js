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
            Thanks for joining us. We're thrilled to have you on board.
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

// Order confirmation email template
exports.orderConfirmationEmail = (userName, order, orderItems, orderUrl) => {
  const year = new Date().getFullYear();
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation - Zyqora</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-rspace:0pt; mso-table-lspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    table { border-collapse:collapse !important; }
    body { margin:0!important; padding:0!important; width:100%!important; background-color:#fff2e6; }

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
            Thank You for Your Order!
          </h1>
          <p style="margin:12px 0 0; font-size:14px; color:#6b7280; line-height:1.5;">
            Hi ${userName},<br>
            Your order has been successfully placed and is being processed.
          </p>
        </td>
      </tr>

      <!-- ORDER DETAILS -->
      <tr>
        <td style="background-color:#ffffff; padding:20px 15px;">
          <div style="
            background-color:#f8fafc;
            border-radius:8px;
            padding:20px;
            margin-bottom:20px;
          ">
            <h3 style="margin:0 0 15px 0; font-size:18px; color:#161c2d; font-family:'DM Sans',sans-serif;">
              Order Details
            </h3>
            <p style="margin:0 0 10px 0; font-size:14px; color:#6b7280; font-family:'DM Sans',sans-serif;">
              <strong>Order ID:</strong> ${order._id}<br>
              <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br>
              <strong>Status:</strong> <span style="color:#f97316; font-weight:600;">${order.status}</span>
            </p>
          </div>
        </td>
      </tr>

      <!-- ORDER ITEMS -->
      <tr>
        <td style="background-color:#ffffff; padding:20px 15px;">
          <table style="width:100%; box-shadow:0 0 3px rgba(60, 72, 88, 0.15); border-radius:6px; background-color:#fff;">
            <thead style="text-transform:uppercase; background-color:#f8fafc;">
              <tr>
                <th scope="col" style="text-align:left; padding:10px 16px; border:none; font-family:'DM Sans',sans-serif;">Product</th>
                <th scope="col" style="padding:10px 16px; border:none; font-family:'DM Sans',sans-serif;">Price</th>
                <th scope="col" style="padding:10px 16px; border:none; font-family:'DM Sans',sans-serif;">Qty</th>
                <th scope="col" style="text-align:right; padding:10px 16px; border:none; font-family:'DM Sans',sans-serif;">Total($)</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(item => `
                <tr>
                  <td style="padding:16px;">
                    <span style="display:flex; align-items:center;">
                      <img src="${item.image || 'https://via.placeholder.com/48x48'}" 
                           style="width:48px; box-shadow:0 0 3px rgba(60, 72, 88, 0.15); border-radius:6px;" 
                           alt="${item.product_name}" />
                      <span style="margin-left:8px;">
                        <span style="font-weight:500; font-family:'DM Sans',sans-serif;">${item.product_name}</span>
                        ${item.size ? `<br><span style="font-size:12px; color:#6b7280;">Size: ${item.size}</span>` : ''}
                        ${item.color ? `<br><span style="font-size:12px; color:#6b7280;">Color: ${item.color}</span>` : ''}
                      </span>
                    </span>
                  </td>
                  <td style="text-align:center; padding:16px; font-family:'DM Sans',sans-serif;">$${item.price.toFixed(2)}</td>
                  <td style="text-align:center; padding:16px; font-family:'DM Sans',sans-serif;">${item.quantity}</td>
                  <td style="text-align:right; padding:16px; font-family:'DM Sans',sans-serif;">$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- ORDER SUMMARY -->
      <tr>
        <td style="background-color:#ffffff; padding:20px 15px;">
          <table style="width:240px; box-shadow:0 0 3px rgba(60, 72, 88, 0.15); border-radius:6px; margin-left:auto;">
            <tbody>
              <tr>
                <td style="text-align:right; padding:16px;">
                  <table style="width:100%;">
                    <tr style="list-style:none; padding:0; margin:0;">
                      <td style="display:flex; justify-content:space-between; padding:0 0 10px;">
                        <span style="font-weight:500; font-family:'DM Sans',sans-serif;">Subtotal:</span>
                        <span style="color:#94a3b8; font-family:'DM Sans',sans-serif;">$${order.subtotal.toFixed(2)}</span>
                      </td>
                      <td style="display:flex; justify-content:space-between; padding:10px 0; border-top:1px solid #f3f4f6;">
                        <span style="font-weight:500; font-family:'DM Sans',sans-serif;">Taxes:</span>
                        <span style="color:#94a3b8; font-family:'DM Sans',sans-serif;">$${order.tax_amount.toFixed(2)}</span>
                      </td>
                      <td style="display:flex; justify-content:space-between; padding:10px 0 0; border-top:1px solid #f3f4f6;">
                        <span style="font-weight:600; font-family:'DM Sans',sans-serif;">Total:</span>
                        <span style="font-weight:600; font-family:'DM Sans',sans-serif;">$${order.total_amount.toFixed(2)}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <!-- BUTTON -->
      <tr>
        <td style="background-color:#ffffff; text-align:center; padding:15px;">
          <a
            href="${orderUrl}"
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
            View Order Details
          </a>
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
          <p style="margin:4px 0 0 0;">
            <a href="#" style="color:#ea580c; text-decoration:none;">Unsubscribe</a> | 
            <a href="#" style="color:#ea580c; text-decoration:none;">Privacy Policy</a> | 
            <a href="#" style="color:#ea580c; text-decoration:none;">Terms of Service</a>
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
};

// Cart abandonment email template
exports.cartAbandonmentEmail = (userName, cartItems, cartUrl) => {
  const year = new Date().getFullYear();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Complete Your Purchase - Zyqora</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-rspace:0pt; mso-table-lspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    table { border-collapse:collapse !important; }
    body { margin:0!important; padding:0!important; width:100%!important; background-color:#fff2e6; }

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
            Don't Forget Your Cart!
          </h1>
          <p style="margin:12px 0 0; font-size:14px; color:#6b7280; line-height:1.5;">
            Hi ${userName},<br/>
            We noticed you left some items in your cart. Don't let them get away!
          </p>
        </td>
      </tr>

      <!-- CART SUMMARY -->
      <tr>
        <td style="background-color:#ffffff; padding:20px 15px;">
          <div style="
            background-color:#f8fafc;
            border-radius:8px;
            padding:20px;
            margin-bottom:20px;
          ">
            <h3 style="margin:0 0 15px 0; font-size:18px; color:#161c2d; font-family:'DM Sans',sans-serif;">
              Your Cart Summary
            </h3>
            <p style="margin:0 0 10px 0; font-size:14px; color:#6b7280; font-family:'DM Sans',sans-serif;">
              <strong>${totalItems}</strong> items • <strong>$${totalPrice.toFixed(2)}</strong> total
            </p>
            ${cartItems.map(item => `
              <div style="
                display:flex;
                align-items:center;
                padding:10px 0;
                border-bottom:1px solid #e5e7eb;
              ">
                <img src="${item.image || 'https://via.placeholder.com/50x50'}" 
                     style="width:50px; height:50px; object-fit:cover; border-radius:4px; margin-right:15px;"
                     alt="${item.name}" />
                <div style="flex:1;">
                  <p style="margin:0; font-size:14px; color:#161c2d; font-weight:500; font-family:'DM Sans',sans-serif;">
                    ${item.name}
                  </p>
                  <p style="margin:5px 0 0 0; font-size:12px; color:#6b7280; font-family:'DM Sans',sans-serif;">
                    Qty: ${item.quantity} • $${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </td>
      </tr>

      <!-- BUTTON -->
      <tr>
        <td style="background-color:#ffffff; text-align:center; padding:15px;">
          <a
            href="${cartUrl}"
            style="
              font-family:'DM Sans',sans-serif;
              font-size:16px;
              font-weight:600;
              color:#ffffff;
              text-decoration:none;
              background-color:#f97316;
              padding:15px 30px;
              border-radius:6px;
              display:inline-block;
              border:1px solid #f97316;
            ">
            Complete Your Purchase
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
                    🔒 Secure Checkout
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
                    ⚡ Fast Processing
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
`;};
