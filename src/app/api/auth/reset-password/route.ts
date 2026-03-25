import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api/response";
import { logger } from "@/lib/logger";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
});

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, "reset-password", RATE_LIMITS.auth);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();

    // Validate request body
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(
        request,
        {
          message: validation.error.issues[0]?.message || "Invalid request",
          code: "BAD_REQUEST",
        },
        400
      );
    }

    const { token, password } = validation.data;

    // Find valid token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return jsonError(
        request,
        {
          message: "Invalid or expired reset token",
          code: "BAD_REQUEST",
        },
        400
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return jsonError(
        request,
        {
          message: "Reset token has expired. Please request a new one.",
          code: "BAD_REQUEST",
        },
        400
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return jsonError(
        request,
        {
          message: "User not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    // Hash new password
    const passwordHash = await hash(password, 12);

    // Update user password and delete token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.verificationToken.delete({
        where: { token },
      }),
    ]);

    return jsonOk(request, {
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    logger.error("Reset password error", {}, error);
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
