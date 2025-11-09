import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';



// GET - Fetch all invoices
export async function GET(request: NextRequest) {
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

    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientName = searchParams.get('clientName');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let query: any = {  };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (clientName) {
      query.clientName = { $regex: clientName, $options: 'i' };
    }

    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) {
        query.invoiceDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.invoiceDate.$lte = new Date(endDate);
      }
    }

    const invoices = await Invoice.find(query)
      .sort({ invoiceDate: -1, createdAt: -1 })
      .select('invoiceNumber invoiceDate clientName total status')
      .lean();

    return NextResponse.json({
      success: true,
      invoices,
      count: invoices.length,
    });
  } catch (error: any) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST - Create new invoice
export async function POST(request: NextRequest) {
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

    await dbConnect();

    const body = await request.json();

 console.log('📝 Creating invoice:', body.invoiceNumber);


    // Validate required fields
    const requiredFields = [
      'invoiceNumber',
      'clientName',
      'clientAddress',
      'clientCity',
      'clientState',
      'clientPincode',
      'clientPhone',
      'items',
      'subtotal',
      'total',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Validate each item
    // for (const item of body.items) {
    //   if (!item.item || !item.description || !item.quantity || !item.rate) {
    //     return NextResponse.json(
    //       { error: 'All item fields are required' },
    //       { status: 400 }
    //     );
    //   }
    // }
    for (const item of body.items) {
      if (!item.item || !item.description || item.quantity === undefined || item.rate === undefined) {
        return NextResponse.json(
          { error: 'All item fields (item, description, quantity, rate) are required' },
          { status: 400 }
        );
      }
    }

    // Create invoice
    const invoice = new Invoice({
      ...body,
      createdBy: userId,
      invoiceDate: body.invoiceDate || new Date(),
    });

    await invoice.save();

    console.log('Invoice saved successfully:', invoice.invoiceNumber);


    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: {
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        status: invoice.status,
      },
    });
  } catch (error: any) {
    console.error('Create invoice error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

