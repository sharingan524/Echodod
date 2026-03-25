import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CustomerServiceOutsourcingContent = dynamic(
  () => import("./CustomerServiceOutsourcingContent")
);

export const metadata: Metadata = {
  title: "Customer Service Outsourcing & Recruitment | Echodod",
  description:
    "Customer service outsourcing and recruitment. Scalable support teams and hiring so you can focus on growth — support that scales with your customers.",
};

export default function CustomerServiceOutsourcingPage() {
  return <CustomerServiceOutsourcingContent />;
}
