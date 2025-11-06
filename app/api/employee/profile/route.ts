import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SalarySlip from "@/models/SalarySlip";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("x-user-id");

    // Fetch employee data
    const employee = await User.findById(userId).select(
      "-password -activationToken -resetPasswordToken"
    );

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Fetch salary slips (you'll need to create a SalarySlip model)
    const salarySlips = await SalarySlip.find({
      "employee.userId": userId,
    }).sort({ "salary.year": -1, "salary.month": -1 });

    return NextResponse.json({
      employee,
      salarySlips,
    });
  } catch (error: any) {
    console.error("Fetch employee profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, phone, department, address, city, state, pincode } = body;

    // Validate name
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && !/^[+]?[\d\s-()]+$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate pincode if provided
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Pincode must be 6 digits" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: name.trim(),
    };

    // Add optional fields to contact
    if (phone !== undefined) {
      updateData["contact.phone"] = phone.trim();
    }

    // Add job department if provided
    if (department !== undefined) {
      updateData["job.department"] = department.trim();
    }

    if (address !== undefined) {
      updateData["contact.address"] = address.trim();
    }

    if (city !== undefined) {
      updateData["contact.city"] = city.trim();
    }
    if (state !== undefined) {
      updateData["contact.state"] = state.trim();
    }
    if (pincode !== undefined) {
      updateData["contact.pincode"] = pincode.trim();
    }
    const updatedEmployee = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -activationToken -resetPasswordToken");

    if (!updatedEmployee) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "Profile updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
