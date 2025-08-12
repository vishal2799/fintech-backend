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
      body { font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px; }
      .container { max-width: 600px; background: #fff; border-radius: 8px; padding: 20px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
      .logo { text-align: center; margin-bottom: 20px; }
      .logo img { max-height: 50px; }
      .btn { display: inline-block; padding: 12px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
      .btn:hover { background: #0056b3; }
      .footer { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        ${logoUrl ? `<img src="${logoUrl}" alt="${tenantName} Logo"/>` : ''}
      </div>
      <h2>Welcome, ${name}!</h2>
      <p>Your WL Admin account for <strong>${tenantName}</strong> has been created.</p>
      <p><strong>Portal URL:</strong> <a href="${portalUrl}">${portalUrl}</a></p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Temporary Password:</strong> ${password}</p>
      <p>Please log in and change your password for security.</p>
      <p style="text-align: center;">
        <a href="${portalUrl}" class="btn">Log In Now</a>
      </p>
      <div class="footer">
        If you did not request this account, please contact support immediately.
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
    from: 'abvils@outlook.com',
    // from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Welcome to ${params.tenantName}`,
    html
  });
}