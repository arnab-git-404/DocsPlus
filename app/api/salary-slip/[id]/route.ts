import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SalarySlip from '@/models/SalarySlip';
// import { getUserFromHeaders } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id}  = await params;
    // const user = getUserFromHeaders(request);
    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const salarySlip = await SalarySlip.findById(id).lean();

    if (!salarySlip) {
      return NextResponse.json(
        { error: 'Salary slip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      salarySlip,
    });
  } catch (error: any) {
    console.error('Error fetching salary slip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salary slip' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const user = getUserFromHeaders(request);

    const { id }= await params;
        const userRole = request.headers.get('x-user-role');


    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();



    const salarySlip = await SalarySlip.findByIdAndDelete(id);

    if (!salarySlip) {
      return NextResponse.json(
        { error: 'Salary slip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Salary slip deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting salary slip:', error);
    return NextResponse.json(
      { error: 'Failed to delete salary slip' },
      { status: 500 }
    );
  }
}