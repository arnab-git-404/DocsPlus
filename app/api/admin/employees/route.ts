import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // const cookieStore = cookies();
    // const token = (await cookieStore).get('token')?.value;

    // if (!token) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
    //   userId: string;
    //   role: string;
    // };

    // if (decoded.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    await dbConnect();

    const employees = await User.find({ 
      role: 'EMPLOYEE',
      status: 'ACTIVE'
    }).select('name email employeeId designation');

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Fetch employees error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}