import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { jsonCreated, jsonError } from "@/lib/api/response";
import { logger } from "@/lib/logger";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
});

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, "signup", RATE_LIMITS.auth);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();

    // Validate request body
    const validation = signupSchema.safeParse(body);
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

    const { email, password, name, organizationName } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return jsonError(
        request,
        {
          message: "An account with this email already exists",
          code: "DUPLICATE_ENTRY",
        },
        409
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Generate organization slug
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug is taken
    const slugExists = await prisma.organization.findUnique({
      where: { slug },
    });

    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

    // Create user and organization in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          passwordHash,
          emailVerified: new Date(), // Auto-verify for MVP (add email verification later)
        },
      });

      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: finalSlug,
          plan: "starter",
          members: {
            create: {
              userId: user.id,
              role: "owner",
            },
          },
        },
      });

      // Initialize billing info
      await tx.billingInfo.create({
        data: {
          organizationId: organization.id,
          stripeCustomerId: "", // Will be set when user adds payment
          implementationFee: 0,
          monthlyMaintenanceFee: 0,
          serviceStatus: "pending",
          billingCycle: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });

      return { user, organization };
    });

    return jsonCreated(request, {
      success: true,
      message: "Account created successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      },
    });
  } catch (error) {
    logger.error("Signup error", {}, error);
    return jsonError(
      request,
      {
        message: "An error occurred during signup. Please try again.",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
}
