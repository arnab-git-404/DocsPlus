import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { verify } from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import SalarySlip from '@/models/SalarySlip';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedUser  = (await jwtVerify(token, JWT_SECRET)).payload as any;

    if (decodedUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const data = await request.json();

    const salarySlip = await SalarySlip.create({
      ...data,
      generatedBy: decodedUser.userId,
    });

    return NextResponse.json(
      { message: 'Salary slip saved successfully', salarySlip },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save salary slip error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}