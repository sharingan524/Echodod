/**
 * Email Notification Service
 * Sends transactional emails via Resend
 */

import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Echodod <noreply@syntaxvoice.com>";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email via Resend (production) or log to console (development)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    logger.debug("Email (no RESEND_API_KEY)", {
      to: options.to,
      subject: options.subject,
    });
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      logger.error("Email send failed", { to: options.to, subject: options.subject }, error);
      return false;
    }

    logger.info("Email sent", { to: options.to, subject: options.subject });
    return true;
  } catch (err) {
    logger.error("Email send error", { to: options.to }, err);
    return false;
  }
}

/**
 * Send payment failed alert
 */
export async function sendPaymentFailedAlert(params: { to: string; organizationName: string }) {
  const { to, organizationName } = params;

  const subject = `Payment Failed - ${organizationName}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">Payment Failed</h2>
      <p>We were unable to process your most recent payment for ${organizationName}.</p>

      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #ef4444;">Action Required</h3>
        <p>Your maintenance service has been suspended. Please update your payment method to restore service.</p>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings"
         style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Update Payment Method
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        If you believe this is an error, please contact support at support@syntaxvoice.com
      </p>
    </div>
  `;

  const text = `
Payment Failed - ${organizationName}

We were unable to process your most recent payment.

Action Required: Your maintenance service has been suspended. Please update your payment method to restore service.

Update payment method: ${process.env.NEXT_PUBLIC_APP_URL}/settings
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Send payment success alert (maintenance service reactivation)
 */
export async function sendPaymentSuccessAlert(params: { to: string; organizationName: string }) {
  const { to, organizationName } = params;

  const subject = `Payment Successful - ${organizationName} Maintenance Service Reactivated`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Payment Successful</h2>
      <p>Your payment has been processed successfully and the maintenance service for ${organizationName} has been reactivated.</p>

      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #10b981;">Maintenance Service Reactivated</h3>
        <p>Your maintenance service is fully operational. Monitoring, support, and all included services have been restored.</p>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Go to Dashboard
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Thank you for being a Echodod customer!
      </p>
    </div>
  `;

  const text = `
Payment Successful - ${organizationName} Maintenance Service Reactivated

Your payment has been processed successfully and your maintenance service has been reactivated.

Your maintenance service is fully operational. Monitoring, support, and all included services have been restored.

Go to dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Send implementation payment confirmation
 */
export async function sendImplementationPaidConfirmation(params: {
  email: string;
  orgName: string;
  tier: string;
}) {
  const { email, orgName, tier } = params;

  const subject = `Implementation Payment Received - ${orgName}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Implementation Payment Received</h2>
      <p>Thank you! We have received your payment for the <strong>${tier}</strong> implementation package for ${orgName}.</p>

      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #10b981;">What Happens Next</h3>
        <p>Our team has been notified and will begin working on your AWS communication setup. You will receive an update once implementation begins.</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>An implementation ticket has been created for your project</li>
          <li>A team member will be assigned shortly</li>
          <li>You can track progress from your dashboard</li>
        </ul>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        View Dashboard
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        If you have any questions, please contact support at support@syntaxvoice.com
      </p>
    </div>
  `;

  const text = `
Implementation Payment Received - ${orgName}

Thank you! We have received your payment for the ${tier} implementation package for ${orgName}.

What Happens Next:
- Our team has been notified and will begin working on your AWS communication setup.
- An implementation ticket has been created for your project.
- A team member will be assigned shortly.
- You can track progress from your dashboard.

View dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
  `;

  return sendEmail({ to: email, subject, html, text });
}

/**
 * Send implementation complete notification
 */
export async function sendImplementationCompleteNotification(params: {
  email: string;
  orgName: string;
}) {
  const { email, orgName } = params;

  const subject = `Implementation Complete - ${orgName} Services Are Live`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Your Services Are Live!</h2>
      <p>Great news! The AWS communication implementation for ${orgName} has been completed and your services are now live.</p>

      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #10b981;">Implementation Complete</h3>
        <p>Your AWS Connect environment has been fully configured and is ready for use. All contact flows, queues, and integrations are operational.</p>
      </div>

      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #3b82f6;">Recommended Next Step</h3>
        <p>Consider subscribing to a maintenance plan to ensure ongoing monitoring, support, and optimization of your communication infrastructure.</p>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Go to Dashboard
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Thank you for choosing Echodod for your communication infrastructure!
      </p>
    </div>
  `;

  const text = `
Implementation Complete - ${orgName} Services Are Live

Great news! The AWS communication implementation for ${orgName} has been completed and your services are now live.

Your AWS Connect environment has been fully configured and is ready for use. All contact flows, queues, and integrations are operational.

Recommended Next Step: Consider subscribing to a maintenance plan to ensure ongoing monitoring, support, and optimization of your communication infrastructure.

Go to dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
  `;

  return sendEmail({ to: email, subject, html, text });
}
