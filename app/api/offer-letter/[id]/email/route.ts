import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import OfferLetter from '@/models/OfferLetter';
import mongoose from 'mongoose';
import { sendGenericEmail, verifyEmailConfig } from '@/lib/mail';
import puppeteer from 'puppeteer';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

async function verifyAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

async function generateOfferLetterPDF(offer: any): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .title { font-size: 20px; font-weight: bold; text-align: center; margin: 30px 0; color: #444; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; color: #555; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f5f5f5; font-weight: bold; }
        ul { margin: 10px 0; padding-left: 25px; }
        .footer { margin-top: 50px; }
        .signature { margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">${offer.companyName}</div>
        <div>${offer.companyAddress}, ${offer.companyCity}</div>
        <div>${offer.companyState} - ${offer.companyPincode}</div>
        <div>Phone: ${offer.companyPhone} | Email: ${offer.companyEmail}</div>
        ${offer.companyWebsite ? `<div>Website: ${offer.companyWebsite}</div>` : ''}
      </div>

      <div class="title">OFFER LETTER</div>

      <div class="section">
        <p><span class="label">Offer Number:</span> ${offer.offerNumber}</p>
        <p><span class="label">Date:</span> ${new Date(offer.offerDate).toLocaleDateString()}</p>
      </div>

      <div class="section">
        <p>Dear <strong>${offer.candidateName}</strong>,</p>
        <p>We are pleased to offer you the position of <strong>${offer.position}</strong> in the <strong>${offer.department}</strong> department at ${offer.companyName}.</p>
      </div>

      <div class="section">
        <h3>Position Details:</h3>
        <table>
          <tr>
            <td class="label">Position</td>
            <td>${offer.position}</td>
          </tr>
          <tr>
            <td class="label">Department</td>
            <td>${offer.department}</td>
          </tr>
          <tr>
            <td class="label">Date of Joining</td>
            <td>${new Date(offer.joiningDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td class="label">Annual CTC</td>
            <td>₹${offer.salary.toLocaleString()}</td>
          </tr>
          <tr>
            <td class="label">Working Hours</td>
            <td>${offer.workingHours}</td>
          </tr>
          <tr>
            <td class="label">Probation Period</td>
            <td>${offer.probationPeriod}</td>
          </tr>
          <tr>
            <td class="label">Notice Period</td>
            <td>${offer.noticePeriod}</td>
          </tr>
        </table>
      </div>

      ${offer.benefits && offer.benefits.length > 0 ? `
      <div class="section">
        <h3>Benefits:</h3>
        <ul>
          ${offer.benefits.map((benefit: string) => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${offer.responsibilities && offer.responsibilities.length > 0 ? `
      <div class="section">
        <h3>Key Responsibilities:</h3>
        <ul>
          ${offer.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="section">
        <h3>Terms & Conditions:</h3>
        <p>${offer.terms}</p>
        <p><strong>This offer is valid until ${new Date(offer.expiryDate).toLocaleDateString()}.</strong></p>
      </div>

      ${offer.notes ? `
      <div class="section">
        <h3>Additional Notes:</h3>
        <p>${offer.notes}</p>
      </div>
      ` : ''}

      <div class="footer">
        <p>We look forward to welcoming you to our team!</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p style="margin-top: 40px;"><strong>${offer.signerName}</strong></p>
          <p>${offer.signerDesignation}</p>
          <p>${offer.companyName}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ 
    format: 'A4',
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  await browser.close();
  
  return Buffer.from(pdfBuffer);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid offer letter ID' }, { status: 400 });
    }

    const isEmailConfigValid = await verifyEmailConfig();
    if (!isEmailConfigValid) {
      return NextResponse.json(
        { 
          error: 'Email service not configured',
          details: 'Please configure SMTP_USER and SMTP_PASSWORD in .env file'
        },
        { status: 503 }
      );
    }

    await dbConnect();

    const offerLetter = await OfferLetter.findById(id).lean() as any;

    if (!offerLetter) {
      return NextResponse.json({ error: 'Offer letter not found' }, { status: 404 });
    }

    if (offerLetter.createdBy.toString() !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    console.log('📄 Generating PDF...');
    const pdfBuffer = await generateOfferLetterPDF(offerLetter);
    console.log('✅ PDF generated');

    console.log('📧 Sending offer letter email...');
    await sendGenericEmail({
      to: offerLetter.candidateEmail,
      subject: `Job Offer - ${offerLetter.position} at ${offerLetter.companyName}`,
      title: `Congratulations ${offerLetter.candidateName}!`,
      content: `
        <p>We are delighted to offer you the position of <strong>${offerLetter.position}</strong> at ${offerLetter.companyName}.</p>
        
        <div class="info-box">
          <p><strong>Position:</strong> ${offerLetter.position}</p>
          <p><strong>Department:</strong> ${offerLetter.department}</p>
          <p><strong>Joining Date:</strong> ${new Date(offerLetter.joiningDate).toLocaleDateString()}</p>
          <p><strong>Annual CTC:</strong> ₹${offerLetter.salary.toLocaleString()}</p>
        </div>

        <p>Please find the detailed offer letter attached. This offer is valid until <strong>${new Date(offerLetter.expiryDate).toLocaleDateString()}</strong>.</p>
        
        <p>We look forward to having you on our team!</p>
      `,
      buttonText: 'View Offer Letter',
      buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL}/offer/${offerLetter._id}`,
    });

    if (offerLetter.status === 'DRAFT') {
      await OfferLetter.findByIdAndUpdate(id, { 
        status: 'SENT',
        sentAt: new Date()
      });
      console.log('✅ Offer letter status updated to SENT');
    }

    return NextResponse.json({
      success: true,
      message: `Offer letter sent successfully to ${offerLetter.candidateEmail}`,
    });
  } catch (error: any) {
    console.error('❌ Email offer letter error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send offer letter email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}