import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    await dbConnect();
    const user = await User.findById(userId)
      .select("-password -activationToken -resetPasswordToken -updatedAt -__v -createdAt");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    return NextResponse.json({
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.contact.phone,
        role: user.role,
        department: user.job.department,
        address: user.contact.address,
        joinDate: user.job.joinDate,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
