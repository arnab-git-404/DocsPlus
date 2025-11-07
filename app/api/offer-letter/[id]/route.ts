import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import OfferLetter from '@/models/OfferLetter';
import mongoose from 'mongoose';


// GET - Fetch single offer letter
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const user = await verifyAuth(request);



    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Access denied. Admin only.' },
    //     { status: 403 }
    //   );
    // }

    const userId = request.headers.get('x-user-id');


    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid offer letter ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const offerLetter = await OfferLetter.findById(id).lean();

    if (!offerLetter) {
      return NextResponse.json(
        { error: 'Offer letter not found' },
        { status: 404 }
      );
    }

    // if (offerLetter.createdBy.toString() !== userId) {
    //   return NextResponse.json(
    //     { error: 'Access denied' },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      offerLetter,
    });
  } catch (error: any) {
    console.error('Get offer letter error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer letter' },
      { status: 500 }
    );
  }
}

// PUT - Update offer letter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const user = await verifyAuth(request);

    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Access denied. Admin only.' },
    //     { status: 403 }
    //   );
    // }

        const userId = request.headers.get('x-user-id');


    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid offer letter ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const offerLetter = await OfferLetter.findById(id);

    if (!offerLetter) {
      return NextResponse.json(
        { error: 'Offer letter not found' },
        { status: 404 }
      );
    }

    // this check is commented out to allow admins to edit all offer letters

    // if (offerLetter.createdBy.toString() !== userId) {
    //   return NextResponse.json(
    //     { error: 'Access denied' },
    //     { status: 403 }
    //   );
    // }

    const body = await request.json();

    // Update offer letter fields
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== 'offerNumber' && key !== 'createdBy') {
        (offerLetter as any)[key] = body[key];
      }
    });

    await offerLetter.save();

    return NextResponse.json({
      success: true,
      message: 'Offer letter updated successfully',
      offerLetter: {
        _id: offerLetter._id,
        offerNumber: offerLetter.offerNumber,
        candidateName: offerLetter.candidateName,
        status: offerLetter.status,
      },
    });
  } catch (error: any) {
    console.error('Update offer letter error:', error);
    return NextResponse.json(
      { error: 'Failed to update offer letter' },
      { status: 500 }
    );
  }
}

// DELETE - Delete offer letter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const user = await verifyAuth(request);

    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Access denied. Admin only.' },
    //     { status: 403 }
    //   );
    // }

    const userId = request.headers.get('x-user-id');


       if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid offer letter ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const offerLetter = await OfferLetter.findById(id);

    if (!offerLetter) {
      return NextResponse.json(
        { error: 'Offer letter not found' },
        { status: 404 }
      );
    }

    // this check is commented out to allow admins to delete all offer letters
    // if (offerLetter.createdBy.toString() !== userId) {
    //   return NextResponse.json(
    //     { error: 'Access denied' },
    //     { status: 403 }
    //   );
    // }

    await OfferLetter.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Offer letter deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete offer letter error:', error);
    return NextResponse.json(
      { error: 'Failed to delete offer letter' },
      { status: 500 }
    );
  }
}