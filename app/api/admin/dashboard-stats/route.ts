import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SalarySlip from "@/models/SalarySlip";
import Invoice from "@/models/Invoice";
import OfferLetter from "@/models/OfferLetter";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
    const { payload } = (await jwtVerify(token, secret)) as any;

    if (payload.role !== "ADMIN") {
      console.log("Unauthorized access attempt", payload.role);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalSalarySlips,
      totalInvoices,
      totalOfferLetters,
    ] = await Promise.all([
      User.countDocuments({ role: "EMPLOYEE" }),
      User.countDocuments({ role: "EMPLOYEE", status: "ACTIVE" }),
      User.countDocuments({ role: "EMPLOYEE", status: "PENDING" }),
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
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
