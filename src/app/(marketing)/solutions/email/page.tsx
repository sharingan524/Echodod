import type { Metadata } from "next";
import dynamic from "next/dynamic";

const EmailContent = dynamic(() => import("./EmailContent"));

export const metadata: Metadata = {
  title: "Business Email | Echodod",
  description:
    "Enterprise email infrastructure powered by Amazon SES. Transactional email, marketing campaigns, deliverability optimization, and full authentication setup -- implemented and managed for your business.",
};

export default function EmailPage() {
  return <EmailContent />;
}
