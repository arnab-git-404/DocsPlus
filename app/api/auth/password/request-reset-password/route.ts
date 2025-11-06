import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendGenericEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorizedd" }, { status: 401 });
    }

    await dbConnect();

    const dbUser = await User.findById(userId);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    dbUser.passwordResetToken = resetToken;
    dbUser.passwordResetExpiry = resetExpiry;
    await dbUser.save();

    // Create reset URL
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password/?resetToken=${resetToken}`;

    // Send email
    await sendGenericEmail({
      to: dbUser.email,
      subject: "Password Reset Request",
      title: "Reset Your Password",
      content: `
        <p>Hello ${dbUser.name},</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div class="info-box">
          <strong>Important:</strong>
          <ul>
            <li>This link will expire in 30 minutes</li>
            <li>If you didn't request this, please ignore this email</li>
            <li>Your password will not change until you create a new one</li>
          </ul>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
      `,
      buttonText: "Reset Password",
      buttonUrl: resetUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to send reset link" },
      { status: 500 }
    );
  }
}
