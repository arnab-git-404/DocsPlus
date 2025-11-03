import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';


export async function POST(request: NextRequest) {
  try {
    const { password, token } = await request.json();

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

  const hashedPassword = await bcrypt.hash(password, 10);

  // Hash Password
    user.password = hashedPassword;
    user.status = 'ACTIVE';
    user.activationToken = undefined;
    user.activationExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Account activated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}