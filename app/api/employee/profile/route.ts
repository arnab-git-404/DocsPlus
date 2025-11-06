import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from cookies
    // const cookieStore = cookies();
    // const token = cookieStore.get('token')?.value;

    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Verify token
    // const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };

    const userId = request.headers.get('x-user-id');

    // Fetch employee data
    const employee = await User.findById(userId).select('-password -activationToken -resetPasswordToken');

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Fetch salary slips (you'll need to create a SalarySlip model)
    // For now, returning empty array
    const salarySlips: any[] = [];

    return NextResponse.json({
      employee,
      salarySlips,
    });
  } catch (error: any) {
    console.error('Fetch employee profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}