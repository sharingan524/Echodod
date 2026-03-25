import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PhoneSystemsContent = dynamic(() => import("./PhoneSystemsContent"));

export const metadata: Metadata = {
  title: "Phone Systems | Echodod",
  description:
    "Professional cloud phone systems powered by Amazon Connect. IVR, call routing, recording, analytics, and CRM integration -- implemented and managed for your business.",
};

export default function PhoneSystemsPage() {
  return <PhoneSystemsContent />;
}
