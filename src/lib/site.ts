export const siteConfig = {
  name: "Echodod",
  description:
    "Enterprise-grade AWS communication services, automatically provisioned in minutes. Phone systems, messaging, and email for small and medium businesses — professionally managed.",
  tagline: "Enterprise Communication. Small Business Simplicity.",
  mainNav: [{ title: "How It Works", href: "/how-it-works" }],
  solutions: [
    {
      title: "Phone Systems",
      href: "/solutions/phone-systems",
      description:
        "Professional phone systems powered by Amazon Connect with IVR, call routing, and analytics.",
      hook: "Enterprise phone systems without the enterprise price tag.",
      accent: "blue" as const,
      benefit: "Crystal-clear calls with 99.99% uptime",
    },
    {
      title: "Customer Messaging",
      href: "/solutions/messaging",
      description:
        "SMS and chat powered by Amazon Pinpoint. Reach customers on their preferred channel.",
      hook: "Meet your customers where they are.",
      accent: "emerald" as const,
      benefit: "Engage customers across SMS, chat, and push notifications",
    },
    {
      title: "Business Email",
      href: "/solutions/email",
      description:
        "Enterprise email infrastructure powered by Amazon SES with high deliverability.",
      hook: "Email that actually reaches the inbox.",
      accent: "purple" as const,
      benefit: "99.9% deliverability with enterprise-grade security",
    },
    {
      title: "Customer Experience design",
      href: "/solutions/customer-experience",
      description: "Design and optimize end-to-end customer journeys and touchpoints.",
      hook: "Every interaction shapes how customers feel.",
      accent: "rose" as const,
      benefit: "Seamless experiences that build loyalty",
    },
    {
      title: "Contact center CX",
      href: "/solutions/contact-center-cx",
      description:
        "Contact center customer experience powered by Amazon Connect. Omnichannel, analytics, and agent tools.",
      hook: "Every call and message, one great experience.",
      accent: "orange" as const,
      benefit: "Unified voice and digital in one platform",
    },
    {
      title: "IVR, Chatbot, and omnichannel implementation",
      href: "/solutions/ivr-chatbot-omnichannel",
      description:
        "IVR flows, AI chatbots, and omnichannel routing — implemented and integrated so customers get answers on any channel.",
      hook: "Automate and unify every touchpoint.",
      accent: "indigo" as const,
      benefit: "Self-service and handoff that scale",
    },
    {
      title: "Software development Outsourcing And Recruitment",
      href: "/solutions/software-development-outsourcing",
      description:
        "Outsource software development and technical recruitment. vetted engineers and teams delivered to your roadmap.",
      hook: "Ship faster with the right talent.",
      accent: "amber" as const,
      benefit: "Flexible teams aligned to your stack",
    },
    {
      title: "Customer Service Outsourcing and Recruitment",
      href: "/solutions/customer-service-outsourcing",
      description:
        "Customer service outsourcing and recruitment. Scalable support teams and hiring so you can focus on growth.",
      hook: "Support that scales with your customers.",
      accent: "fuchsia" as const,
      benefit: "Trained agents and hiring pipelines",
    },
  ],
  links: {
    email: "Echododconsulting@gmail.com",
    calendly: "https://calendly.com/syntaxvoice/consultation",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Echodod. Built in Texas.`,
    links: [
      { title: "How It Works", href: "/how-it-works" },
      { title: "Contact", href: "/contact" },
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
} as const;
