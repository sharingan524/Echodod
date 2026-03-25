import type { Metadata } from "next";
import dynamic from "next/dynamic";

const MessagingContent = dynamic(() => import("./MessagingContent"));

export const metadata: Metadata = {
  title: "Customer Messaging | Echodod",
  description:
    "Multi-channel customer messaging powered by Amazon Pinpoint. SMS campaigns, two-way messaging, push notifications, and chat -- implemented and managed for your business.",
};

export default function MessagingPage() {
  return <MessagingContent />;
}
