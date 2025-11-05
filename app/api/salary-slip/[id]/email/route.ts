import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SalarySlip from '@/models/SalarySlip';
import { sendEmail, emailTemplates } from '@/lib/mail';
import { SalarySlipDocument } from '@/components/templates/SalarySlip';
import React from 'react';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const {id} = await params;

    await dbConnect();

    const salarySlip = await SalarySlip.findById(id);

    if (!salarySlip) {
      return NextResponse.json(
        { error: 'Salary slip not found' },
        { status: 404 }
      );
    }

    console.log('📧 Sending salary slip email to:', salarySlip.employee.email);

    // Generate PDF filename
    const pdfFilename = `SalarySlip_${salarySlip.employee.employeeId}_${salarySlip.salary.month}_${salarySlip.salary.year}.pdf`;

    // Create React element for PDF
    const pdfDocument = React.createElement(SalarySlipDocument, {
      data: salarySlip.toObject(),
    });

    // Send email with PDF attachment
    await sendEmail({
      to: salarySlip.employee.email,
      subject: `Salary Slip - ${salarySlip.salary.month} ${salarySlip.salary.year}`,
      html: emailTemplates.salarySlip(
        salarySlip.employee.name,
        salarySlip.salary.month,
        salarySlip.salary.year
      ),
      pdfDocument,
      pdfFilename,
    });

    // Update status to SENT
    salarySlip.status = 'SENT';
    salarySlip.sentAt = new Date();
    await salarySlip.save();

    console.log('✅ Salary slip email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Salary slip sent successfully',
      sentTo: salarySlip.employee.email,
    });
  } catch (error: any) {
    console.error('❌ Error sending salary slip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send salary slip' },
      { status: 500 }
    );
  }
}