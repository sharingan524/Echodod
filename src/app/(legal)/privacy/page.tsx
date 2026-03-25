import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Echodod privacy policy. How we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-14">
      <h1>Privacy Policy</h1>
    </div>
  );
}
