import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CustomerExperienceContent = dynamic(() => import("./CustomerExperienceContent"));

export const metadata: Metadata = {
  title: "Customer Experience Design | Echodod",
  description:
    "Design and optimize end-to-end customer journeys and touchpoints. Journey mapping, persona development, UX research, and service design — delivered for your business.",
};

export default function CustomerExperiencePage() {
  return <CustomerExperienceContent />;
}
