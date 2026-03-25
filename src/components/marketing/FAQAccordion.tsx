import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What AWS services do you implement?",
    answer:
      "We specialize in Amazon Connect for phone systems, Amazon Pinpoint for SMS and multi-channel messaging, and Amazon SES for transactional and marketing email. We can also integrate supporting services like Amazon Lex, AWS Lambda, and Amazon CloudWatch as needed.",
  },
  {
    question: "Do I need my own AWS account?",
    answer:
      "Yes. We set up and configure everything inside your own AWS account, so you maintain full ownership and control. You pay AWS directly for usage, and we handle all the implementation and ongoing maintenance.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most implementations take between 1 and 4 weeks depending on complexity. A basic single-service setup can be live within a week, while a full multi-service deployment with custom integrations typically takes 3-4 weeks.",
  },
  {
    question: "What does monthly maintenance include?",
    answer:
      "Our maintenance plans include system monitoring, health reports, technical support, configuration changes, AWS cost optimization, and proactive performance tuning. The specific inclusions depend on your chosen plan.",
  },
  {
    question: "Can I keep my existing phone numbers?",
    answer:
      "Yes. We handle number porting as part of the implementation process. Your existing phone numbers are transferred to Amazon Connect so your customers never notice the change.",
  },
];

export function FAQAccordion() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        Frequently Asked Questions
      </h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
        Got questions? We&apos;ve got answers.
      </p>

      <Accordion type="single" collapsible className="mt-12">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
