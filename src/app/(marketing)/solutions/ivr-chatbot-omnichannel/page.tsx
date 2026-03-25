import type { Metadata } from "next";
import dynamic from "next/dynamic";

const IVRChatbotOmnichannelContent = dynamic(() => import("./IVRChatbotOmnichannelContent"));

export const metadata: Metadata = {
  title: "IVR, Chatbot & Omnichannel Implementation | Echodod",
  description:
    "IVR flows, AI chatbots, and omnichannel routing — implemented and integrated so customers get answers on any channel. Powered by Amazon Connect and Lex.",
};

export default function IVRChatbotOmnichannelPage() {
  return <IVRChatbotOmnichannelContent />;
}
