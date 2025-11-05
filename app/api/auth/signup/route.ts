import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendActivationEmail } from '@/lib/mail';


export async function POST(request: NextRequest) {
  try {
    // const cookieStore = cookies();
    // const token = (await cookieStore).get('token')?.value;

    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
    //   userId: string;
    //   role: string;
    // };

    // if (decoded.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    await dbConnect();

    const { employeeId, name, email, role } = await request.json();

    // Validate required fields
    if (!employeeId || !name || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    // Generate activation token
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      employeeId,
      name,
      email,
      role: role || 'EMPLOYEE',
      status: 'PENDING',
      activationToken,
      activationExpiry,
    //   createdBy: decoded.userId || 'TEST_USER',
    });

    // Send activation email
    const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/activate?token=${activationToken}`;
    
    await sendActivationEmail({
      to: email,
      name,
      activationUrl,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}