import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';
import mongoose from 'mongoose';





export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const user = await verifyAuth(request);

        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }
    const {id} = await params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return NextResponse.json(
    //     { error: 'Invalid invoice ID' },
    //     { status: 400 }
    //   );
    // }


    await dbConnect();

    const invoice = await Invoice.findById(id).lean() as any;

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if user owns this invoice
    if (invoice.createdBy.toString() !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // For now, we'll return a success message
    // In production, you would integrate with a PDF generation library like:
    // - puppeteer
    // - jsPDF
    // - pdfkit
    // - react-pdf

    return NextResponse.json({
      success: true,
      message: 'PDF generation will be implemented',
      invoice,
      // In production, you would return:
      // return new NextResponse(pdfBuffer, {
      //   headers: {
      //     'Content-Type': 'application/pdf',
      //     'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      //   },
      // });
    });
  } catch (error: any) {
    console.error('Download invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}