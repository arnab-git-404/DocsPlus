import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';
import { verifyAuth } from '@/lib/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// async function verifyAuth(request: NextRequest) {
//   try {
//     const cookieStore = cookies();
//     const token = cookieStore.get('token')?.value;

//     if (!token) {
//       return null;
//     }

//     const { payload } = await jwtVerify(token, JWT_SECRET);
//     return payload;
//   } catch (error) {
//     return null;
//   }
// }

export async function GET(request: NextRequest) {
  try {
    // const user = await verifyAuth(request);

    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || !userRole) {
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

    await dbConnect();

    // Generate preview of next invoice number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Find last invoice of current month
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}`),
    })
      .sort({ invoiceNumber: -1 })

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    const nextInvoiceNumber = `INV-${year}${month}-${sequence.toString().padStart(4, '0')}`;

    return NextResponse.json({
      success: true,
      nextInvoiceNumber,
      year: date.getFullYear(),
      month: date.toLocaleString('default', { month: 'long' }),
    });
  } catch (error: any) {
    console.error('Generate invoice number error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice number' },
      { status: 500 }
    );
  }
}