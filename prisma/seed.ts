import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// ============================================================
// Realistic seed data pools
// ============================================================

const phoneContacts = [
  "+1-512-555-0123",
  "+1-512-555-0456",
  "+1-737-555-0789",
  "+1-214-555-0321",
  "+1-713-555-0654",
  "+1-469-555-0987",
  "+1-817-555-1122",
  "+1-972-555-3344",
  "+1-512-555-5566",
  "+1-210-555-7788",
  "+1-832-555-9900",
  "+1-361-555-2211",
  "+1-903-555-4433",
  "+1-254-555-6655",
  "+1-940-555-8877",
];

const emailContacts = [
  "sarah.johnson@techstartup.io",
  "mike.chen@retailhub.com",
  "jennifer.williams@lawfirmllp.com",
  "david.martinez@constructionpro.net",
  "emily.taylor@healthclinic.org",
  "robert.brown@accounting360.com",
  "amanda.wilson@realtyfirst.com",
  "james.anderson@logisticsnow.com",
  "lisa.thomas@designstudio.co",
  "chris.jackson@autorepairshop.com",
  "karen.white@insuranceplus.com",
  "brian.harris@fitnesscenter.com",
  "nicole.martin@catering-events.com",
  "steven.garcia@plumbingexperts.com",
  "rachel.lee@dentalcare.com",
];

const chatContacts = [
  "WebChat-visitor-1842",
  "WebChat-visitor-2956",
  "WebChat-visitor-3071",
  "WebChat-visitor-4183",
  "WebChat-visitor-5294",
  "WebChat-visitor-6320",
  "WebChat-visitor-7415",
  "WebChat-visitor-8503",
  "WebChat-visitor-9641",
  "WebChat-visitor-1057",
  "WebChat-visitor-1168",
  "WebChat-visitor-1279",
];

const smsContacts = [
  "+1-512-555-1001",
  "+1-214-555-2002",
  "+1-713-555-3003",
  "+1-469-555-4004",
  "+1-817-555-5005",
  "+1-972-555-6006",
  "+1-210-555-7007",
  "+1-832-555-8008",
  "+1-737-555-9009",
  "+1-361-555-1010",
  "+1-903-555-2020",
  "+1-254-555-3030",
];

// Phone call scenarios
const phoneScenarios = [
  {
    subject: "Appointment scheduling inquiry",
    content:
      "Customer called to schedule a follow-up appointment for next Thursday. Checked availability, confirmed 2:30 PM slot, and sent calendar confirmation via email.",
    outcome: "resolved",
    status: "completed",
    duration: 185,
    direction: "inbound",
  },
  {
    subject: "Order status check - #ORD-4829",
    content:
      "Customer inquired about shipping status for order #ORD-4829 placed 3 days ago. Confirmed order shipped via UPS, provided tracking number. Customer satisfied with update.",
    outcome: "resolved",
    status: "completed",
    duration: 142,
    direction: "inbound",
  },
  {
    subject: "Billing dispute - duplicate charge",
    content:
      "Customer reported seeing a duplicate charge of $49.99 on their statement. Verified in billing system - confirmed duplicate occurred during payment processing. Initiated refund for duplicate amount. Customer will see credit within 3-5 business days.",
    outcome: "resolved",
    status: "completed",
    duration: 312,
    direction: "inbound",
  },
  {
    subject: "Technical support - login issues",
    content:
      "Customer unable to access their account after password reset. Walked through clearing browser cache and trying incognito mode. Issue persisted - escalated to engineering team for further investigation of SSO integration.",
    outcome: "escalated",
    status: "completed",
    duration: 420,
    direction: "inbound",
  },
  {
    subject: "New service inquiry",
    content:
      "Prospective customer called asking about premium tier features and pricing. Discussed call recording, analytics dashboard, and CRM integration capabilities. Sent follow-up email with pricing sheet and case study.",
    outcome: "resolved",
    status: "completed",
    duration: 268,
    direction: "inbound",
  },
  {
    subject: "Missed call - after hours",
    content:
      "Inbound call received outside of business hours. Voicemail left by customer regarding account access. Autoresponder played with callback hours information.",
    outcome: "missed",
    status: "completed",
    duration: 18,
    direction: "inbound",
  },
  {
    subject: "Account cancellation request",
    content:
      "Customer requested account cancellation. Offered retention discount of 20% for 3 months. Customer accepted the offer and will continue service. Updated billing to reflect promotional rate.",
    outcome: "resolved",
    status: "completed",
    duration: 540,
    direction: "inbound",
  },
  {
    subject: "Follow-up call - proposal review",
    content:
      "Called client to follow up on the proposal sent last week. Client had questions about implementation timeline and support SLAs. Clarified all points and client confirmed they will proceed. Scheduling kickoff meeting.",
    outcome: "resolved",
    status: "completed",
    duration: 380,
    direction: "outbound",
  },
  {
    subject: "Missed call - busy line",
    content:
      "Attempted outbound call to follow up on support ticket #TKT-2891. Line was busy, no voicemail available. Will retry tomorrow morning.",
    outcome: "missed",
    status: "completed",
    duration: 12,
    direction: "outbound",
  },
  {
    subject: "Service outage report",
    content:
      "Customer called to report intermittent connectivity issues with their phone system. Checked service status - identified regional AWS degradation. Notified customer of ETA for resolution and offered to route calls to backup number.",
    outcome: "escalated",
    status: "completed",
    duration: 290,
    direction: "inbound",
  },
  {
    subject: "Onboarding walkthrough",
    content:
      "Scheduled onboarding call with new client. Walked through dashboard navigation, showed how to update business hours, configure greetings, and access communication logs. Client comfortable with system.",
    outcome: "resolved",
    status: "completed",
    duration: 1200,
    direction: "outbound",
  },
  {
    subject: "Quarterly business review",
    content:
      "Conducted quarterly review with client. Reviewed call volume trends (up 15%), customer satisfaction scores, and recommended adding SMS channel. Client interested - scheduling follow-up to discuss expansion.",
    outcome: "resolved",
    status: "completed",
    duration: 1800,
    direction: "outbound",
  },
  {
    subject: "Wrong number / spam",
    content:
      "Inbound call from unrecognized number. Caller hung up after automated greeting. Likely robocall or wrong number. No action required.",
    outcome: "resolved",
    status: "completed",
    duration: 8,
    direction: "inbound",
  },
  {
    subject: "Password reset assistance",
    content:
      "Customer locked out of their account after multiple failed login attempts. Verified identity using security questions and email verification. Reset password and confirmed customer can log in successfully.",
    outcome: "resolved",
    status: "completed",
    duration: 195,
    direction: "inbound",
  },
];

// Email scenarios
const emailScenarios = [
  {
    subject: "Re: Invoice #INV-2024-0892 Payment Confirmation",
    content:
      "Hi Team,\n\nThank you for your prompt payment of Invoice #INV-2024-0892 ($1,249.00). This confirms that your account is current through the end of the billing period.\n\nIf you have any questions about your billing, please don't hesitate to reach out.\n\nBest regards,\nAccounting Team",
    outcome: "delivered",
    status: "sent",
    direction: "outbound",
  },
  {
    subject: "Support Request: Unable to access analytics dashboard",
    content:
      "Hi Support,\n\nI've been trying to access the analytics dashboard since this morning but keep getting a 403 error. I've tried different browsers and clearing my cache. My account email is jennifer.williams@lawfirmllp.com.\n\nCould you please look into this?\n\nThanks,\nJennifer",
    outcome: "resolved",
    status: "completed",
    direction: "inbound",
  },
  {
    subject: "Welcome to Echodod - Your Account is Ready",
    content:
      "Welcome aboard! Your Echodod account has been set up and your communication services are now active.\n\nHere's what you can do next:\n1. Log in to your dashboard\n2. Update your business hours\n3. Customize your greeting messages\n4. Review your communication logs\n\nIf you need any help getting started, our team is here for you.",
    outcome: "delivered",
    status: "sent",
    direction: "outbound",
  },
  {
    subject: "Inquiry: Pricing for multi-location setup",
    content:
      "Hello,\n\nWe're a dental practice with 4 locations in the Dallas-Fort Worth area. We're interested in setting up a unified phone system across all locations with centralized call routing.\n\nCould you send over pricing for a multi-location setup? We currently handle about 200 calls per day total.\n\nBest,\nDr. Rachel Lee",
    outcome: "resolved",
    status: "completed",
    direction: "inbound",
  },
  {
    subject: "Monthly Usage Report - January 2025",
    content:
      "Your January 2025 usage report is ready.\n\nSummary:\n- Total calls: 1,247 (up 8% from December)\n- Average call duration: 3:42\n- Emails sent: 3,891\n- SMS messages: 2,156\n- Overall satisfaction: 94%\n\nView your full report in the dashboard.",
    outcome: "delivered",
    status: "sent",
    direction: "outbound",
  },
  {
    subject: "Re: Feature request - call recording",
    content:
      "Hi David,\n\nThank you for your feature request regarding automatic call recording with transcription. This feature is available on the Standard and Premium plans.\n\nI've gone ahead and enabled it on your account. You'll now see recordings appear in your communication logs within 5 minutes of each call ending.\n\nLet me know if you have any questions!\n\nBest,\nSupport Team",
    outcome: "delivered",
    status: "sent",
    direction: "outbound",
  },
  {
    subject: "Urgent: Phone system not routing calls correctly",
    content:
      "Our main business line is sending all calls to voicemail instead of the reception queue. This started about 30 minutes ago. We have clients trying to reach us. Please help ASAP.\n\n- Robert Brown, Accounting360",
    outcome: "escalated",
    status: "completed",
    direction: "inbound",
  },
  {
    subject: "Delivery failure notification",
    content:
      "The email to contact@oldclient-domain.com bounced with a permanent failure: 550 5.1.1 The email account does not exist. This address has been added to your suppression list.",
    outcome: "bounced",
    status: "failed",
    direction: "outbound",
  },
  {
    subject: "Appointment reminder: Demo Company consultation",
    content:
      "This is a reminder that you have a consultation scheduled with Demo Company tomorrow at 10:00 AM CT.\n\nJoin link: https://meet.example.com/demo-abc123\n\nPlease let us know if you need to reschedule.",
    outcome: "delivered",
    status: "sent",
    direction: "outbound",
  },
  {
    subject: "Re: Contract renewal discussion",
    content:
      "Hi Amanda,\n\nThanks for sending over the renewal terms. Everything looks good. We'd like to proceed with the Professional maintenance plan for another 12 months.\n\nCan you send the updated agreement for signing?\n\nBest,\nJames Anderson\nLogistics Now",
    outcome: "resolved",
    status: "completed",
    direction: "inbound",
  },
  {
    subject: "Scheduled maintenance notification - Feb 15",
    content:
      "We'll be performing scheduled maintenance on February 15, 2025 from 2:00 AM - 4:00 AM CT. During this window, call routing may experience brief delays of up to 30 seconds. Email and SMS services will not be affected.\n\nNo action is required on your part.",
    outcome: "delivered",
    status: "sent",
    direction: "outbound",
  },
  {
    subject: "Delivery failure - invalid address",
    content:
      "The email to bounced-address@invalid-domain.xyz could not be delivered: 550 No such user. This address has been removed from your mailing list.",
    outcome: "bounced",
    status: "failed",
    direction: "outbound",
  },
];

// SMS scenarios
const smsScenarios = [
  {
    subject: null,
    direction: "outbound",
    content:
      "Your appointment with Demo Company is confirmed for Mon, Feb 3 at 10:00 AM. Reply C to confirm or R to reschedule.",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "inbound",
    content: "C",
    outcome: "resolved",
    status: "completed",
  },
  {
    subject: null,
    direction: "outbound",
    content: "Thank you for confirming your appointment. See you Monday at 10 AM!",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "outbound",
    content:
      "Hi! Your order #ORD-5102 has shipped. Track it here: https://track.example.com/5102. Estimated delivery: Feb 7.",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "outbound",
    content:
      "Reminder: Your payment of $349.00 is due on Feb 15. Log in to your account to make a payment or call us at 512-555-0123.",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "inbound",
    content:
      "I need to reschedule my appointment from Thursday to Friday at the same time. Is that available?",
    outcome: "resolved",
    status: "completed",
  },
  {
    subject: null,
    direction: "outbound",
    content: "Your appointment has been rescheduled to Fri, Feb 7 at 2:30 PM. Reply C to confirm.",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "outbound",
    content:
      "Your verification code is 847293. This code expires in 10 minutes. Do not share this code with anyone.",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "inbound",
    content: "STOP",
    outcome: "resolved",
    status: "completed",
  },
  {
    subject: null,
    direction: "outbound",
    content:
      "You have been unsubscribed from Demo Company messages. Reply START to re-subscribe at any time.",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "outbound",
    content:
      "Hi Sarah, just following up on our conversation. Let me know if you have any questions about the proposal. - Demo Company",
    outcome: "delivered",
    status: "sent",
  },
  {
    subject: null,
    direction: "inbound",
    content: "Yes, I reviewed it. Looks great! When can we get started?",
    outcome: "resolved",
    status: "completed",
  },
];

// Chat scenarios
const chatScenarios = [
  {
    subject: "Live chat - product question",
    content:
      "Visitor asked about differences between Standard and Premium plans. Explained feature comparison including call recording limits and analytics depth. Visitor requested to schedule a demo call. Transferred to sales calendar link.",
    outcome: "resolved",
    status: "completed",
    duration: 345,
    direction: "inbound",
  },
  {
    subject: "Live chat - getting started help",
    content:
      "New user needed help configuring their first greeting message. Walked through the My Business > Greetings tab. User successfully saved a custom phone greeting. No further questions.",
    outcome: "resolved",
    status: "completed",
    duration: 220,
    direction: "inbound",
  },
  {
    subject: "Chatbot - business hours inquiry",
    content:
      "Visitor asked 'What are your hours?' - Chatbot auto-responded with business hours: Mon-Fri 8AM-6PM, Sat 9AM-5PM CT. Visitor did not escalate to agent.",
    outcome: "resolved",
    status: "completed",
    duration: 15,
    direction: "inbound",
  },
  {
    subject: "Live chat - billing issue escalation",
    content:
      "Customer reported being charged twice for monthly maintenance. Chat agent verified the duplicate charge in Stripe dashboard. Initiated refund and provided confirmation number. Customer asked to be notified when refund processes.",
    outcome: "escalated",
    status: "completed",
    duration: 480,
    direction: "inbound",
  },
  {
    subject: "Chatbot - pricing request",
    content:
      "Visitor asked about pricing. Chatbot provided overview of implementation tiers ($999-$4,999) and maintenance plans ($149-$699/mo). Visitor clicked through to pricing page. No further interaction.",
    outcome: "resolved",
    status: "completed",
    duration: 30,
    direction: "inbound",
  },
  {
    subject: "Live chat - API integration help",
    content:
      "Developer from client company needed help with webhook setup for real-time communication events. Walked through API documentation, showed how to create webhook endpoints in Settings, and confirmed test event delivery. Developer confirmed integration working.",
    outcome: "resolved",
    status: "completed",
    duration: 720,
    direction: "inbound",
  },
  {
    subject: "Live chat - feature request",
    content:
      "Customer requested ability to export communication logs as CSV. Documented feature request in internal tracker. Informed customer this is on the roadmap for next quarter. Customer satisfied with timeline.",
    outcome: "resolved",
    status: "completed",
    duration: 180,
    direction: "inbound",
  },
  {
    subject: "Chatbot - contact info",
    content:
      "Visitor asked for support email address. Chatbot provided hello@syntaxvoice.com and offered to connect to live agent. Visitor declined and ended chat.",
    outcome: "resolved",
    status: "completed",
    duration: 20,
    direction: "inbound",
  },
  {
    subject: "Live chat - service disruption report",
    content:
      "Customer reported their phone system queue was showing 'offline' status. Agent checked service health dashboard and confirmed a regional AWS issue. Updated customer on status and ETA. Escalated to engineering for monitoring.",
    outcome: "escalated",
    status: "completed",
    duration: 390,
    direction: "inbound",
  },
  {
    subject: "Live chat - account setup assistance",
    content:
      "New client needed help connecting their AWS credentials. Walked through the Settings > AWS tab, explained required IAM permissions, and verified credential validation passed. All services now showing as active.",
    outcome: "resolved",
    status: "completed",
    duration: 600,
    direction: "inbound",
  },
];

// ============================================================
// Helpers
// ============================================================

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a realistic timestamp within the last N days, weighted toward business hours */
function randomTimestamp(daysAgo: number): Date {
  const now = new Date();
  const msAgo = daysAgo * 24 * 60 * 60 * 1000;
  const start = now.getTime() - msAgo;
  // Weight toward more recent dates (exponential distribution)
  const t = Math.pow(Math.random(), 0.7); // bias toward 1 (recent)
  const randomMs = start + t * msAgo;
  const date = new Date(randomMs);
  // Weight toward business hours (8 AM - 6 PM)
  const hour = 8 + Math.floor(Math.random() * 10); // 8-17
  const minute = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, Math.floor(Math.random() * 60), 0);
  return date;
}

// ============================================================
// Main seed function
// ============================================================

async function main() {
  console.log("Seeding database...");

  // Clean up existing data (development only!)
  console.log("Cleaning up existing data...");
  await prisma.maintenanceLog.deleteMany();
  await prisma.implementationTicket.deleteMany();
  await prisma.serviceConfig.deleteMany();
  await prisma.greetingMessage.deleteMany();
  await prisma.holidaySchedule.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.communicationLog.deleteMany();
  await prisma.webhook.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.billingInfo.deleteMany();
  await prisma.phoneNumber.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  console.log("Creating demo user...");
  const passwordHash = await hash("password123", 10);

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@syntaxvoice.com",
      name: "Demo User",
      passwordHash,
      emailVerified: new Date(),
    },
  });
  console.log(`Created user: ${demoUser.email}`);

  // Create super admin user
  const adminHash = await hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@syntaxvoice.com",
      name: "Admin User",
      passwordHash: adminHash,
      emailVerified: new Date(),
      isSuperAdmin: true,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // Create demo organization
  console.log("Creating demo organization...");
  const demoOrg = await prisma.organization.create({
    data: {
      name: "Demo Company",
      slug: "demo-company",
      plan: "standard",
      members: {
        create: [
          {
            userId: demoUser.id,
            role: "owner",
          },
          {
            userId: adminUser.id,
            role: "admin",
          },
        ],
      },
    },
  });
  console.log(`Created organization: ${demoOrg.name} (${demoOrg.slug})`);

  // Create client profile
  console.log("Creating client profile...");
  await prisma.clientProfile.create({
    data: {
      organizationId: demoOrg.id,
      businessName: "Demo Company LLC",
      address: "123 Main Street, Austin, TX 78701",
      phone: "+1-555-123-4567",
      email: "info@democompany.com",
      website: "https://democompany.com",
      industry: "Professional Services",
      timezone: "America/Chicago",
    },
  });

  // Create business hours
  console.log("Creating business hours...");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 0; i < 7; i++) {
    await prisma.businessHours.create({
      data: {
        organizationId: demoOrg.id,
        dayOfWeek: i,
        openTime: i === 0 || i === 6 ? "09:00" : "08:00",
        closeTime: i === 0 || i === 6 ? "17:00" : "18:00",
        isClosed: i === 0, // Closed on Sunday
      },
    });
  }
  console.log(`Created business hours for ${days.length} days`);

  // Create greeting messages
  console.log("Creating greeting messages...");
  const greetingChannels = ["phone", "chat", "email", "sms"];
  for (const channel of greetingChannels) {
    await prisma.greetingMessage.create({
      data: {
        organizationId: demoOrg.id,
        channel,
        message: `Thank you for contacting Demo Company via ${channel}. How can we help you today?`,
        isActive: true,
      },
    });
  }
  console.log(`Created ${greetingChannels.length} greeting messages`);

  // Create a sample phone number
  console.log("Creating sample phone number...");
  const phoneNumber = await prisma.phoneNumber.create({
    data: {
      organizationId: demoOrg.id,
      phoneNumber: "+1-555-DEMO-123",
      provider: "aws-connect",
      providerSid: "instance-1234567890",
      isActive: true,
    },
  });
  console.log(`Created phone number: ${phoneNumber.phoneNumber}`);

  // ============================================================
  // Create realistic communication logs (~80 entries)
  // ============================================================
  console.log("Creating realistic communication logs...");
  const allLogs: Prisma.CommunicationLogCreateManyInput[] = [];

  // Phone logs (~25)
  for (let i = 0; i < 25; i++) {
    const scenario = pick(phoneScenarios);
    const durationVariance = Math.floor(Math.random() * 60) - 30;
    allLogs.push({
      organizationId: demoOrg.id,
      externalId: `call-${randomUUID()}`,
      channel: "phone",
      direction: scenario.direction,
      contactInfo: pick(phoneContacts),
      subject: scenario.subject,
      content: scenario.content,
      duration: Math.max(5, (scenario.duration ?? 120) + durationVariance),
      outcome: scenario.outcome,
      status: scenario.status,
      provider: "aws-connect",
      metadata: {
        callQuality: pick(["excellent", "good", "good", "good", "fair"]),
        transferCount: 0,
      },
      createdAt: randomTimestamp(30),
    });
  }

  // Email logs (~20)
  for (let i = 0; i < 20; i++) {
    const scenario = pick(emailScenarios);
    allLogs.push({
      organizationId: demoOrg.id,
      externalId: `email-${randomUUID()}`,
      channel: "email",
      direction: scenario.direction,
      contactInfo: scenario.direction === "inbound" ? pick(emailContacts) : pick(emailContacts),
      subject: scenario.subject,
      content: scenario.content,
      duration: null,
      outcome: scenario.outcome,
      status: scenario.status,
      provider: "ses",
      metadata: { messageSize: Math.floor(Math.random() * 50000) + 500 },
      createdAt: randomTimestamp(30),
    });
  }

  // SMS logs (~20)
  for (let i = 0; i < 20; i++) {
    const scenario = pick(smsScenarios);
    allLogs.push({
      organizationId: demoOrg.id,
      externalId: `sms-${randomUUID()}`,
      channel: "sms",
      direction: scenario.direction,
      contactInfo: pick(smsContacts),
      subject: scenario.subject,
      content: scenario.content,
      duration: null,
      outcome: scenario.outcome,
      status: scenario.status,
      provider: "pinpoint",
      metadata: { segmentCount: 1 },
      createdAt: randomTimestamp(30),
    });
  }

  // Chat logs (~15)
  for (let i = 0; i < 15; i++) {
    const scenario = pick(chatScenarios);
    const durationVariance = Math.floor(Math.random() * 60) - 30;
    allLogs.push({
      organizationId: demoOrg.id,
      externalId: `chat-${randomUUID()}`,
      channel: "chat",
      direction: scenario.direction,
      contactInfo: pick(chatContacts),
      subject: scenario.subject,
      content: scenario.content,
      duration: Math.max(5, (scenario.duration ?? 60) + durationVariance),
      outcome: scenario.outcome,
      status: scenario.status,
      provider: "aws-connect",
      metadata: {
        chatType: scenario.duration && scenario.duration > 100 ? "live_agent" : "chatbot",
      },
      createdAt: randomTimestamp(30),
    });
  }

  await prisma.communicationLog.createMany({ data: allLogs });
  console.log(`Created ${allLogs.length} realistic communication logs`);

  // Create service configs
  console.log("Creating service configs...");
  await prisma.serviceConfig.create({
    data: {
      organizationId: demoOrg.id,
      serviceType: "connect",
      status: "active",
      awsAccountId: "123456789012",
      awsRegion: "us-east-1",
      configDetails: {
        instanceId: "instance-1234567890",
        instanceAlias: "demo-company",
      },
    },
  });

  await prisma.serviceConfig.create({
    data: {
      organizationId: demoOrg.id,
      serviceType: "ses",
      status: "active",
      awsAccountId: "123456789012",
      awsRegion: "us-east-1",
      configDetails: {
        domain: "democompany.com",
        verified: true,
      },
    },
  });
  console.log("Created 2 service configs");

  // Create API key
  console.log("Creating API key...");
  const keyValue = "sk_test_demo_" + Math.random().toString(36).substring(2, 15);
  const apiKey = await prisma.apiKey.create({
    data: {
      organizationId: demoOrg.id,
      name: "Development API Key",
      keyHash: keyValue,
      keyPrefix: keyValue.substring(0, 8),
      lastUsedAt: new Date(),
    },
  });
  console.log(`Created API key: ${apiKey.name}`);

  // Create webhook
  console.log("Creating webhook...");
  const webhook = await prisma.webhook.create({
    data: {
      organizationId: demoOrg.id,
      url: "https://example.com/webhooks/syntaxvoice",
      events: ["communication.received", "communication.sent", "service.status_changed"],
      secret: "whsec_" + Math.random().toString(36).substring(2, 24),
      isActive: true,
    },
  });
  console.log(`Created webhook: ${webhook.url}`);

  // Create billing info
  console.log("Creating billing info...");
  const billing = await prisma.billingInfo.create({
    data: {
      organizationId: demoOrg.id,
      stripeCustomerId: "cus_demo_" + Math.random().toString(36).substring(2, 15),
      implementationFee: 2499,
      monthlyMaintenanceFee: 349,
      implementationPaidAt: new Date(),
      serviceStatus: "active",
      billingCycle: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`Created billing info: $${billing.implementationFee} implementation fee`);

  // Create implementation ticket with provisioning steps
  console.log("Creating implementation ticket...");
  const provisioningStarted = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  await prisma.implementationTicket.create({
    data: {
      organizationId: demoOrg.id,
      title: "Initial Setup - Amazon Connect + SES",
      description:
        "Automated provisioning of Amazon Connect instance with IVR, call routing, and Amazon SES for transactional email.",
      status: "completed",
      priority: "high",
      assignedTo: "admin@syntaxvoice.com",
      provisioningMode: "auto",
      provisioningSteps: {
        organizationId: demoOrg.id,
        tier: "standard",
        status: "completed",
        currentStepIndex: 5,
        startedAt: provisioningStarted.toISOString(),
        completedAt: new Date(provisioningStarted.getTime() + 8 * 60 * 1000).toISOString(),
        steps: [
          {
            id: "connect-create-instance",
            name: "Create Connect Instance",
            service: "connect",
            status: "completed",
            startedAt: provisioningStarted.toISOString(),
            completedAt: new Date(provisioningStarted.getTime() + 2 * 60 * 1000).toISOString(),
            result: { instanceId: "instance-1234567890", instanceAlias: "demo-company" },
          },
          {
            id: "connect-wait-active",
            name: "Wait for Instance Activation",
            service: "connect",
            status: "completed",
            startedAt: new Date(provisioningStarted.getTime() + 2 * 60 * 1000).toISOString(),
            completedAt: new Date(provisioningStarted.getTime() + 4 * 60 * 1000).toISOString(),
            result: { instanceStatus: "ACTIVE" },
          },
          {
            id: "connect-create-queue",
            name: "Create Default Queue",
            service: "connect",
            status: "completed",
            startedAt: new Date(provisioningStarted.getTime() + 4 * 60 * 1000).toISOString(),
            completedAt: new Date(provisioningStarted.getTime() + 5 * 60 * 1000).toISOString(),
            result: { queueName: "Default Queue" },
          },
          {
            id: "connect-claim-phone",
            name: "Claim Phone Number",
            service: "connect",
            status: "completed",
            startedAt: new Date(provisioningStarted.getTime() + 5 * 60 * 1000).toISOString(),
            completedAt: new Date(provisioningStarted.getTime() + 6 * 60 * 1000).toISOString(),
            result: { phoneNumber: "+1-555-DEMO-123" },
          },
          {
            id: "ses-verify-domain",
            name: "Verify Email Domain",
            service: "ses",
            status: "completed",
            startedAt: new Date(provisioningStarted.getTime() + 6 * 60 * 1000).toISOString(),
            completedAt: new Date(provisioningStarted.getTime() + 7 * 60 * 1000).toISOString(),
            result: { domain: "democompany.com", verified: true },
          },
          {
            id: "ses-config-set",
            name: "Create SES Configuration Set",
            service: "ses",
            status: "completed",
            startedAt: new Date(provisioningStarted.getTime() + 7 * 60 * 1000).toISOString(),
            completedAt: new Date(provisioningStarted.getTime() + 8 * 60 * 1000).toISOString(),
            result: { configurationSet: "demo-company-config" },
          },
        ],
      },
      completedAt: new Date(provisioningStarted.getTime() + 8 * 60 * 1000),
    },
  });
  console.log("Created implementation ticket with provisioning steps");

  // Create maintenance log
  console.log("Creating maintenance log...");
  await prisma.maintenanceLog.create({
    data: {
      organizationId: demoOrg.id,
      description: "Monthly health check - all systems operational. Updated Connect flows.",
      performedBy: "admin@syntaxvoice.com",
      type: "routine",
    },
  });
  console.log("Created maintenance log");

  console.log("\nSeeding completed successfully!\n");
  console.log("Test Credentials:");
  console.log("  Demo User:  demo@syntaxvoice.com / password123");
  console.log("  Admin User: admin@syntaxvoice.com / admin123");
  console.log("\nStart the dev server:");
  console.log("  pnpm dev");
  console.log("\nThen visit:");
  console.log("  http://localhost:3001/login");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
