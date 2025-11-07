import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';
import mongoose from 'mongoose';


// GET - Fetch single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const userId = request.headers.get('x-user-id');

    // const user = await verifyAuth(request);

    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Access denied. Admin only.' },
    //     { status: 403 }
    //   );
    // }

     const { id } = await params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }


    await dbConnect();

    const invoice = (await Invoice.findById(id).lean()) as any;

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

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error: any) {
    console.error('Get invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT - Update invoice
export async function PUT(
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
    const { id } = await params; 
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    await dbConnect();


    const invoice = await Invoice.findById(id);

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

    const body = await request.json();

    // Update invoice fields
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== 'invoiceNumber' && key !== 'createdBy') {
        invoice[key] = body[key];
      }
    });

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: {
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        status: invoice.status,
      },
    });
  } catch (error: any) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE - Delete invoice
export async function DELETE(
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
     const { id } = await params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const invoice = await Invoice.findById(id);

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

    await Invoice.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}