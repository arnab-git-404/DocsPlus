// import nodemailer from 'nodemailer';

// // Email transporter (reusable)
// function createTransporter() {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST || 'smtp.gmail.com',
//     port: parseInt(process.env.SMTP_PORT || '465'),
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });
// }

// // Base email template wrapper
function wrapEmailTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .info-box { background: #fff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { background-color: #f0f0f0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${content}
            <p>Best regards,<br>Hackence Services Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Hackence Services. All rights reserved.</p>
            <p>Balbhadrapur, Laheriasarai, Darbhanga, Bihar - 846004</p>
            <p>Phone: +91 9472948357 | Email: hackence.services@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Activation Email
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
    const transporter = createTransporter();

    const content = `
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
    `;

    await transporter.sendMail({
      from: `"Hackence Services" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Activate Your Account - Hackence Services',
      html: wrapEmailTemplate('Welcome to Hackence Services!', content),
    });

    console.log(`✅ Activation email sent to ${to}`);
  } catch (error) {
    console.error('❌ Send activation email error:', error);
    throw new Error('Failed to send activation email');
  }
}

// // 2. Invoice Email
// interface SendInvoiceEmailParams {
//   to: string;
//   clientName: string;
//   invoice: any;
//   pdfBuffer?: Buffer;
// }

// export async function sendInvoiceEmail({
//   to,
//   clientName,
//   invoice,
//   pdfBuffer,
// }: SendInvoiceEmailParams) {
//   try {
//     const transporter = createTransporter();

//     const itemsTable = invoice.items.map((item: any) => `
//       <tr>
//         <td>
//           <strong>${item.item}</strong><br/>
//           <small style="color: #666;">${item.description}</small>
//         </td>
//         <td style="text-align: center;">${item.quantity}</td>
//         <td style="text-align: right;">₹${item.rate.toFixed(2)}</td>
//         <td style="text-align: right;">₹${item.amount.toFixed(2)}</td>
//       </tr>
//     `).join('');

//     const content = `
//       <h2>Hello ${clientName},</h2>
//       <p>Please find the details of invoice <strong>${invoice.invoiceNumber}</strong>.</p>
      
//       <div class="info-box">
//         <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
//         <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
//         <p><strong>Status:</strong> ${invoice.status}</p>
//       </div>

//       <h3>Invoice Items:</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th style="text-align: center;">Qty</th>
//             <th style="text-align: right;">Rate</th>
//             <th style="text-align: right;">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsTable}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
//             <td style="text-align: right;">₹${invoice.subtotal.toFixed(2)}</td>
//           </tr>
//           ${invoice.discountAmount > 0 ? `
//           <tr>
//             <td colspan="3" style="text-align: right;"><strong>Discount:</strong></td>
//             <td style="text-align: right; color: red;">-₹${invoice.discountAmount.toFixed(2)}</td>
//           </tr>
//           ` : ''}
//           <tr>
//             <td colspan="3" style="text-align: right;"><strong>CGST (${invoice.cgst}%):</strong></td>
//             <td style="text-align: right;">₹${invoice.cgstAmount.toFixed(2)}</td>
//           </tr>
//           <tr>
//             <td colspan="3" style="text-align: right;"><strong>SGST (${invoice.sgst}%):</strong></td>
//             <td style="text-align: right;">₹${invoice.sgstAmount.toFixed(2)}</td>
//           </tr>
//           <tr class="total-row">
//             <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
//             <td style="text-align: right;"><strong>₹${invoice.total.toFixed(2)}</strong></td>
//           </tr>
//         </tfoot>
//       </table>

//       ${invoice.notes ? `
//       <div class="info-box">
//         <strong>Notes:</strong>
//         <p>${invoice.notes}</p>
//       </div>
//       ` : ''}

//       ${invoice.terms ? `
//       <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
//         <strong>Terms & Conditions:</strong>
//         <p>${invoice.terms}</p>
//       </div>
//       ` : ''}

//       <p style="margin-top: 30px;">Thank you for your business!</p>
//     `;

//     const mailOptions: any = {
//       from: `"${invoice.companyName}" <${process.env.SMTP_USER}>`,
//       to,
//       subject: `Invoice ${invoice.invoiceNumber} from ${invoice.companyName}`,
//       html: wrapEmailTemplate(`Invoice ${invoice.invoiceNumber}`, content),
//     };

//     // Add PDF attachment if provided
//     if (pdfBuffer) {
//       mailOptions.attachments = [
//         {
//           filename: `invoice-${invoice.invoiceNumber}.pdf`,
//           content: pdfBuffer,
//           contentType: 'application/pdf',
//         },
//       ];
//     }

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Invoice email sent to ${to}`);
//   } catch (error) {
//     console.error('❌ Send invoice email error:', error);
//     throw new Error('Failed to send invoice email');
//   }
// }

// // 3. Payment Reminder Email
// interface SendPaymentReminderParams {
//   to: string;
//   clientName: string;
//   invoiceNumber: string;
//   amount: number;
//   dueDate: Date;
// }

// export async function sendPaymentReminder({
//   to,
//   clientName,
//   invoiceNumber,
//   amount,
//   dueDate,
// }: SendPaymentReminderParams) {
//   try {
//     const transporter = createTransporter();

//     const content = `
//       <h2>Hello ${clientName},</h2>
//       <p>This is a friendly reminder about your pending invoice.</p>
      
//       <div class="info-box">
//         <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
//         <p><strong>Amount Due:</strong> ₹${amount.toFixed(2)}</p>
//         <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
//       </div>

//       <p>Please process the payment at your earliest convenience.</p>
//       <p>If you have already paid, please disregard this email.</p>
//     `;

//     await transporter.sendMail({
//       from: `"Hackence Services" <${process.env.SMTP_USER}>`,
//       to,
//       subject: `Payment Reminder - Invoice ${invoiceNumber}`,
//       html: wrapEmailTemplate('Payment Reminder', content),
//     });

//     console.log(`✅ Payment reminder sent to ${to}`);
//   } catch (error) {
//     console.error('❌ Send payment reminder error:', error);
//     throw new Error('Failed to send payment reminder');
//   }
// }

// 4. Generic Email (for custom messages)
interface SendGenericEmailParams {
  to: string;
  subject: string;
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}

export async function sendGenericEmail({
  to,
  subject,
  title,
  content,
  buttonText,
  buttonUrl,
}: SendGenericEmailParams) {
  try {
    const transporter = createTransporter();

    let emailContent = content;

    if (buttonText && buttonUrl) {
      emailContent += `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${buttonUrl}" class="button">${buttonText}</a>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"Hackence Services" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: wrapEmailTemplate(title, emailContent),
    });

    console.log(`✅ Generic email sent to ${to}`);
  } catch (error) {
    console.error('❌ Send generic email error:', error);
    throw new Error('Failed to send email');
  }
}

// // 5. Verify email configuration
// export async function verifyEmailConfig(): Promise<boolean> {
//   try {
//     const transporter = createTransporter();
//     await transporter.verify();
//     console.log('✅ Email configuration is valid');
//     return true;
//   } catch (error) {
//     console.error('❌ Email configuration error:', error);
//     return false;
//   }
// }













import nodemailer from 'nodemailer';
import { renderToBuffer } from '@react-pdf/renderer';
import { ReactElement } from 'react';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  pdfDocument?: ReactElement;
  pdfFilename?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  pdfDocument,
  pdfFilename = 'document.pdf',
}: EmailOptions) {
  try {
    const transporter = createTransporter();

    const mailOptions: any = {
      from: `"${process.env.SMTP_FROM_NAME || 'Slip Generator'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    // If PDF document is provided, render and attach it
    if (pdfDocument) {
      console.log('📄 Rendering PDF for email attachment...');
      const pdfBuffer = await renderToBuffer(pdfDocument);
      
      mailOptions.attachments = [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ];
      console.log('✅ PDF rendered successfully');
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('❌ Email error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Email templates
export const emailTemplates = {
  salarySlip: (employeeName: string, month: string, year: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4F46E5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4F46E5;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Salary Slip - ${month} ${year}</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>Please find attached your salary slip for <strong>${month} ${year}</strong>.</p>
          <p>The attached PDF document contains detailed information about your salary breakdown, including:</p>
          <ul>
            <li>Basic Salary</li>
            <li>Allowances</li>
            <li>Deductions</li>
            <li>Net Salary</li>
          </ul>
          <p>If you have any questions or concerns regarding your salary slip, please contact the HR department.</p>
          <p style="margin-top: 30px;">
            <strong>Important:</strong> Please keep this document for your records.
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Slip Generator. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  invoice: (clientName: string, invoiceNumber: string, amount: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #059669;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-radius: 0 0 8px 8px;
        }
        .amount {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice - ${invoiceNumber}</h1>
        </div>
        <div class="content">
          <p>Dear ${clientName},</p>
          <p>Thank you for your business! Please find attached your invoice.</p>
          <div class="amount">
            Total Amount: ₹${amount.toLocaleString('en-IN')}
          </div>
          <p>The attached PDF contains the complete invoice details including itemized breakdown and payment information.</p>
          <p><strong>Payment Terms:</strong> Please make payment within the specified due date.</p>
          <p>If you have any questions about this invoice, please contact us.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Slip Generator. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  offerLetter: (candidateName: string, position: string, joiningDate: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #DC2626;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-radius: 0 0 8px 8px;
        }
        .highlight {
          background-color: #fef3c7;
          padding: 15px;
          border-left: 4px solid #f59e0b;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations!</h1>
        </div>
        <div class="content">
          <p>Dear ${candidateName},</p>
          <p>We are pleased to extend an offer for the position of <strong>${position}</strong>.</p>
          <div class="highlight">
            <p><strong>Joining Date:</strong> ${joiningDate}</p>
          </div>
          <p>Please find the complete offer letter attached as a PDF document. The letter includes:</p>
          <ul>
            <li>Position details and responsibilities</li>
            <li>Compensation and benefits</li>
            <li>Terms and conditions</li>
            <li>Next steps</li>
          </ul>
          <p>Please review the offer letter carefully and let us know if you have any questions.</p>
          <p>We look forward to having you join our team!</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Slip Generator. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  activation: (name: string, activationUrl: string) => `
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
  `,

  };