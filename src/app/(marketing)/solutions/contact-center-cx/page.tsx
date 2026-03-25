import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ContactCenterCXContent = dynamic(() => import("./ContactCenterCXContent"));

export const metadata: Metadata = {
  title: "Contact Center CX | Echodod",
  description:
    "Contact center customer experience powered by Amazon Connect. Omnichannel, analytics, and agent tools — implemented and managed for your business.",
};

export default function ContactCenterCXPage() {
  return <ContactCenterCXContent />;
}
