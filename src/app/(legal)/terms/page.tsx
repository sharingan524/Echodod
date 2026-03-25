import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Echodod terms of service and acceptable use policy.",
};

export default function TermsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-14">
      <h1>Terms of Service</h1>
    </div>
  );
}
