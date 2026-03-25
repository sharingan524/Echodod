import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { jsonError, jsonOk } from "@/lib/api/response";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, "forgot-password", RATE_LIMITS.auth);
  if (rateLimited) return rateLimited;

  try {
    const { email } = await request.json();

    if (!email) {
      return jsonError(
        request,
        {
          message: "Email is required",
          code: "BAD_REQUEST",
        },
        400
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return jsonOk(request, {
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store token in database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send password reset email
    await sendEmail({
      to: user.email,
      subject: "Reset your Echodod password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>We received a request to reset your password. Click the link below to choose a new password:</p>
          <a href="${resetUrl}"
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
      text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.`,
    });

    logger.info("Password reset email sent", { email: user.email });

    return jsonOk(request, {
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    logger.error("Forgot password error", {}, error);
    return jsonError(
      request,
      {
        message: "An error occurred. Please try again.",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
}
