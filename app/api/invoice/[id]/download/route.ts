import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';
import mongoose from 'mongoose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

async function verifyAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const invoice = await Invoice.findById(params.id).lean() as any;

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if user owns this invoice
    if (invoice.createdBy.toString() !== user.userId) {
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