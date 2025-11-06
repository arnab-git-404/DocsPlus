// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';


const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET
);

export async function POST(request: NextRequest) {
  try {
    
    await dbConnect();


    const { email, password, role } = await request.json();
    
    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'User Not found' },
        { status: 401 }
      );
    }

    // if (user.status !== 'ACTIVE') {
    //   return NextResponse.json(
    //     { error: 'Account not activated' },
    //     { status: 403 }
    //   );
    // }


    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Verify role matches
    if (user.role !== role) {
      return NextResponse.json(
        { 
          error: `You cannot login as ${role}. Your account role is ${user.role}.` 
        },
        { status: 403 }
      );
    }

    // Create JWT token using jose library (Next.js edge runtime compatible)
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);


    // Return user data (without password)
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        employeeId: user.employeeId,

      },
    });

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}