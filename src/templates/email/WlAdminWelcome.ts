import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

function getWLAdminWelcomeEmailHTML({
  name,
  portalUrl,
  username,
  password,
  tenantName,
  logoUrl
}: {
  name: string;
  portalUrl: string;
  username: string;
  password: string;
  tenantName: string;
  logoUrl?: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to ${tenantName}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .logo {
        text-align: center;
        margin-bottom: 25px;
      }
      .logo img {
        max-height: 60px;
      }
      h2 {
        color: #333333;
        font-size: 22px;
        margin-bottom: 20px;
        text-align: center;
      }
      p {
        color: #555555;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      .btn-container {
        text-align: center;
        margin: 25px 0;
      }
      .btn {
        display: inline-block;
        padding: 14px 28px;
        background-color: #007bff;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
      }
      .btn:hover {
        background-color: #0056b3;
      }
      .credentials {
        background: #f0f4f8;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
        font-family: monospace;
        color: #333333;
      }
      .footer {
        font-size: 13px;
        color: #999999;
        text-align: center;
        margin-top: 30px;
        line-height: 1.4;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        ${logoUrl ? `<img src="${logoUrl}" alt="${tenantName} Logo"/>` : ''}
      </div>
      <h2>Welcome, ${name}!</h2>
      <p>Your WL Admin account for <strong>${tenantName}</strong> has been successfully created.</p>

      <div class="credentials">
        <p><strong>Portal URL:</strong> <a href="${portalUrl}">${portalUrl}</a></p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
      </div>

      <div class="btn-container">
        <a href="${portalUrl}" class="btn">Log In Now</a>
      </div>

      <p>Please log in and change your password to keep your account secure.</p>

      <div class="footer">
        If you did not request this account, please contact your administrator or support immediately.
      </div>
    </div>
  </body>
  </html>
  `;
}


export async function sendWLAdminWelcomeEmail(params: {
  to: string;
  name: string;
  portalUrl: string;
  username: string;
  password: string;
  tenantName: string;
  logoUrl?: string;
}) {
  const html = getWLAdminWelcomeEmailHTML(params);

  await sgMail.send({
    to: params.to,
    // from: 'abvils@outlook.com',
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Welcome to ${params.tenantName}`,
    html
  });
}