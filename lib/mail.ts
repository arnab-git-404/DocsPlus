import nodemailer from 'nodemailer';

interface SendActivationEmailParams {
  to: string;
  name: string;
  activationUrl: string;
}

export async function sendActivationEmail({
  to,
  name,
  activationUrl,
}: SendActivationEmailParams) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .info-box { background: #fff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hackence Services!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your employee account has been created successfully. To activate your account and set your password, please click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${activationUrl}" class="button">Activate Account</a>
              </div>
              
              <div class="info-box">
                <strong>Important:</strong>
                <ul>
                  <li>This activation link will expire in 24 hours</li>
                  <li>You will be asked to set a password</li>
                  <li>After activation, you can log in to your dashboard</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${activationUrl}</p>
              
              <p>If you didn't expect this email, please ignore it.</p>
              
              <p>Best regards,<br>Hackence Services Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Hackence Services. All rights reserved.</p>
              <p>Balbhadrapur, Laheriasarai, Darbhanga, Bihar - 84600</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Hackence Services" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Activate Your Account - Hackence Services',
      html: htmlContent,
    });

    console.log(`Activation email sent to ${to}`);
  } catch (error) {
    console.error('Send email error:', error);
    throw new Error('Failed to send activation email');
  }
}