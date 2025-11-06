import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SalarySlip from '@/models/SalarySlip';
import { renderToStream } from '@react-pdf/renderer';
import { SalarySlipDocument } from '@/components/templates/SalarySlip';
import { Readable } from 'stream';
import React from 'react';

export async function GET(
  request: NextRequest,
  { params }: { params: { slipId: string } }
) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slipId } = await params;

    // Fetch the salary slip
    const slip = await SalarySlip.findOne({
      _id: slipId,
      'employee.userId': userId
    });

    if (!slip) {
      return NextResponse.json(
        { error: 'Salary slip not found' },
        { status: 404 }
      );
    }

    // Generate PDF using createElement
    const stream = await renderToStream(
      React.createElement(SalarySlipDocument, { data: slip.toObject() })
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream as unknown as Readable) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="salary-slip-${slip.salary.month}-${slip.salary.year}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Download salary slip error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}