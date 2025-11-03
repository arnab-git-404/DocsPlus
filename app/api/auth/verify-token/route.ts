import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      activationToken: token,
      activationExpiry: { $gt: new Date() },
    }).select('name email employeeId role');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired activation link' },
        { status: 400 }
      );
    }


    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}