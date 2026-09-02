
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export const metadata: Metadata = {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about applying for jobs and using the Baalvion platform.",
    alternates: {
        canonical: '/faqs',
    },
    openGraph: {
        title: "Frequently Asked Questions | TalentOS by Baalvion",
        description: "Find answers to common questions about applying for jobs and using the Baalvion platform.",
        url: '/faqs'
    }
};

const faqs = [
    {
        question: "How do I apply for a job?",
        answer: "To apply for a job, navigate to our Careers page, find a position that interests you, and click the 'Apply Now' button. This will take you to an application form where you can fill in your details and upload your resume."
    },
    {
        question: "Can I apply for multiple positions?",
        answer: "Yes, you are welcome to apply for multiple positions that you feel are a good fit for your skills and experience. Each application will be considered independently."
    },
    {
        question: "How can I track my application status?",
        answer: "After you submit your first application, an account will be created for you. You can log in to the '/my-account' dashboard at any time to see the current status of all your applications."
    },
    {
        question: "What happens after I apply?",
        answer: "Our recruitment team will review your application. If your profile matches our requirements, we will reach out to schedule the next steps, which typically involve one or more interviews. You will receive email and dashboard notifications as your application moves through our pipeline."
    },
    {
        question: "Is my data safe?",
        answer: "Yes. We take data privacy and security very seriously. All data is encrypted, and we adhere to strict data protection policies. For more details, please review our Privacy Policy and Data Protection pages."
    }
]

export default function FAQsPage() {
    return (
        <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Frequently Asked Questions</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions below.</p>
                </div>
            </section>
            <Separator />
             <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-lg text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
             </div>
        </main>
    );
}
