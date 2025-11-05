import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SalarySlip from '@/models/SalarySlip';
// import { getUserFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // const user = getUserFromHeaders(request);

    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const salarySlips = await SalarySlip.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      salarySlips,
    });
  } catch (error: any) {
    console.error('Error fetching salary slips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salary slips' },
      { status: 500 }
    );
  }
}