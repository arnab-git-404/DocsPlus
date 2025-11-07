import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import OfferLetter from '@/models/OfferLetter';


// GET - List all offer letters
export async function GET(request: NextRequest) {
  try {
    // const user = await verifyAuth(request);
    const userId = request.headers.get('x-user-id');



    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Access denied. Admin only.' },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await dbConnect();

    const query: any = { createdBy: userId };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { offerNumber: { $regex: search, $options: 'i' } },
        { candidateName: { $regex: search, $options: 'i' } },
        { candidateEmail: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [offerLetters, total] = await Promise.all([
      OfferLetter.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OfferLetter.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      offerLetters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('List offer letters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer letters' },
      { status: 500 }
    );
  }
}

// POST - Create new offer letter
export async function POST(request: NextRequest) {
  try {
    // const user = await verifyAuth(request);

    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    await dbConnect();

    // Generate offer number
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    
    const lastOffer = await OfferLetter.findOne()
      .sort({ createdAt: -1 })
      .select('offerNumber');

    let sequence = 1;
    if (lastOffer && lastOffer.offerNumber) {
      const lastSequence = parseInt(lastOffer.offerNumber.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    const offerNumber = `OL-${year}${month}-${sequence.toString().padStart(4, '0')}`;

    const offerLetter = await OfferLetter.create({
      ...body,
      offerNumber,
      createdBy: userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Offer letter created successfully',
      offerLetter: {
        _id: offerLetter._id,
        offerNumber: offerLetter.offerNumber,
        candidateName: offerLetter.candidateName,
        position: offerLetter.position,
        status: offerLetter.status,
      },
    });
  } catch (error: any) {
    console.error('Create offer letter error:', error);
    return NextResponse.json(
      { error: 'Failed to create offer letter' },
      { status: 500 }
    );
  }
}