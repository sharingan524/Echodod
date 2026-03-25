import type { Metadata } from "next";
import dynamic from "next/dynamic";

const SoftwareDevelopmentOutsourcingContent = dynamic(
  () => import("./SoftwareDevelopmentOutsourcingContent")
);

export const metadata: Metadata = {
  title: "Software Development Outsourcing & Recruitment | Echodod",
  description:
    "Outsource software development and technical recruitment. Vetted engineers and teams delivered to your roadmap — ship faster with the right talent.",
};

export default function SoftwareDevelopmentOutsourcingPage() {
  return <SoftwareDevelopmentOutsourcingContent />;
}
