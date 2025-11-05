import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SalarySlip from '@/models/SalarySlip';
import Invoice from '@/models/Invoice';
import OfferLetter from '@/models/OfferLetter';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    const decoded = jwtVerify(token, secret) as any;


    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const [totalUsers, activeUsers, pendingUsers, totalSalarySlips, totalInvoices, totalOfferLetters] = await Promise.all([
      User.countDocuments({ role: 'EMPLOYEE' }),
      User.countDocuments({ role: 'EMPLOYEE', status: 'ACTIVE' }),
      User.countDocuments({ role: 'EMPLOYEE', status: 'PENDING' }),
      SalarySlip.countDocuments(),
      Invoice.countDocuments(),
      OfferLetter.countDocuments(),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      totalSalarySlips,
      totalInvoices,
      totalOfferLetters,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}