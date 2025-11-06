import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SalarySlip from '@/models/SalarySlip';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

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
    const salarySlips = await SalarySlip.find({ 'employee.userId': userId })
    .sort({ 'salary.year': -1, 'salary.month': -1 });

    console.log('Employee salary fetched successfully' , salarySlips);

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