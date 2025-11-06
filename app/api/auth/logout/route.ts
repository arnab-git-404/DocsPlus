import { NextResponse } from 'next/server';

export async function POST() {
  try {
    
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // response.cookies.set('auth-token', '', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 0,
    // });
    
    response.cookies.delete('auth-token');
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}