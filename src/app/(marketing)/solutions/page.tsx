import type { Metadata } from "next";
import dynamic from "next/dynamic";

const SolutionsContent = dynamic(() => import("./SolutionsContent"));

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "AWS communication services for your business. Phone systems powered by Amazon Connect, customer messaging with Amazon Pinpoint, and business email via Amazon SES.",
};

export default function SolutionsPage() {
  return <SolutionsContent />;
}
