
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read the Baalvion privacy policy to understand how we collect, use, and protect your data on our global talent acquisition platform.",
    alternates: {
        canonical: '/privacy',
    },
    openGraph: {
        title: "Privacy Policy | TalentOS by Baalvion",
        description: "Learn how Baalvion protects your privacy.",
        url: '/privacy',
    }
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold tracking-tight">{children}</h2>
);

const SubSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-semibold tracking-tight">{children}</h3>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
    <ul className="list-disc space-y-3 pl-6">
        {items.map((item, index) => <li key={index} className="text-muted-foreground [&>strong]:font-semibold [&>strong]:text-foreground">{item}</li>)}
    </ul>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode}) => (
    <section className="space-y-6">
        <SectionTitle>{title}</SectionTitle>
        <div className="space-y-4 text-lg">{children}</div>
    </section>
)

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12">
        <p className="text-xl text-muted-foreground">
            This Privacy Policy describes how Baalvion Industries Pvt Ltd ("Baalvion", "we", "us", or "our") collects, uses, and discloses information in connection with your use of our website, Jobs.Baalvion.com, and our related services (collectively, the "Platform").
        </p>

        <Separator />

        <Section title="1. Introduction">
          <p className="text-muted-foreground">
            Baalvion provides a global talent acquisition and recruitment SaaS platform designed to connect employers with candidates. This policy applies to all users of our Platform, including individual candidates ("Candidates"), employer clients ("Clients"), and their authorized users. By accessing or using our Platform, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <div className="space-y-8">
            <p className="text-muted-foreground">
                We collect information that you provide to us directly, that we collect automatically, and that we receive from other sources.
            </p>
            <div className="space-y-4">
                <SubSectionTitle>A. Personal Information Provided by You</SubSectionTitle>
                <BulletList items={[
                    "Contact Information: such as your full name, email address, and phone number.",
                    "Professional Information: including your employment history, educational background, skills, and any other information contained within your resume or CV.",
                    "Profile Information: such as your location, professional headline, and links to external profiles (e.g., LinkedIn, portfolio).",
                ]} />
            </div>

            <div className="space-y-4">
                <SubSectionTitle>B. Account Information</SubSectionTitle>
                <BulletList items={[
                    "Login Credentials: When you create an account, we collect your email address and a secure password.",
                    "User Role: We associate your account with a specific role, such as Candidate, Recruiter, or Administrator.",
                ]} />
            </div>

            <div className="space-y-4">
                <SubSectionTitle>C. Technical Data We Collect Automatically</SubSectionTitle>
                <BulletList items={[
                    "Log and Usage Data: including IP address, browser type, device information, operating system, and pages visited.",
                    "Cookies and Similar Technologies: We use cookies to operate and administer our Platform and to improve your experience. See our Cookies Policy section for more details.",
                ]} />
            </div>

            <div className="space-y-4">
                <SubSectionTitle>D. Employer Data</SubSectionTitle>
                <BulletList items={[
                    "Job Listings: Information provided by Clients regarding open positions, including job descriptions, requirements, and location.",
                    "Organization Data: Information about the Client's company, such as name and branding assets.",
                    "Hiring Activity: Data related to the recruitment process, such as candidate pipeline status and internal notes.",
                ]} />
            </div>
          </div>
        </Section>

        <Section title="3. How We Use Information">
            <p className="text-muted-foreground">We use the information we collect for the following purposes:</p>
            <BulletList items={[
                "To provide and maintain the Platform, including account creation and management.",
                "To process and analyze resumes and other professional information you provide.",
                "To use our proprietary AI and automated systems to score and match candidate profiles against job descriptions.",
                "To facilitate communication between Candidates and Clients.",
                "To monitor for security threats, prevent fraud, and ensure the integrity of our Platform.",
                "To analyze usage trends and improve the functionality and user experience of our Platform.",
                "To comply with legal obligations and respond to lawful requests from public authorities.",
            ]} />
        </Section>

        <Section title="4. AI & Automated Processing Disclosure">
          <p className="text-muted-foreground">
            Our Platform utilizes advanced artificial intelligence (AI) and automated systems to enhance the recruitment process. This includes:
          </p>
          <BulletList items={[
                "Resume Parsing: Our technology automatically extracts and structures information from resumes to build a candidate profile.",
                "Algorithmic Scoring: We use proprietary algorithms to score a candidate's profile against the requirements of a specific job description. This scoring is based on factors such as skills, experience, and education.",
          ]} />
          <p className="text-muted-foreground">
            It is important to note that these automated tools are designed to assist human recruiters, not to replace them. <strong>Baalvion does not make fully automated hiring decisions.</strong> All outputs from our AI systems, including scores and summaries, are provided to our Clients to aid their evaluation process, which involves human review and judgment. We are committed to developing and deploying our AI technology responsibly and actively work to mitigate potential biases.
          </p>
        </Section>

        <Section title="5. Data Sharing & Disclosure">
            <p className="text-muted-foreground">We only share your information in the following circumstances:</p>
            <BulletList items={[
                "With Employers: When a Candidate applies for a job, their profile information, including their resume and our AI-generated analysis, is shared with that specific Client.",
                "Service Providers: We engage third-party service providers to perform functions on our behalf, such as cloud hosting (e.g., Google Cloud Platform), email delivery, and analytics. These providers only have access to the information necessary to perform their functions and are contractually obligated to maintain the confidentiality and security of your data.",
                "Legal Obligations: We may disclose information if required by law, subpoena, or other legal process, or if we have a good faith belief that disclosure is reasonably necessary to protect the rights, property, or safety of Baalvion, our users, or the public.",
                "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
            ]} />
            <p className="font-bold text-lg text-foreground">We do not sell your personal data to third parties.</p>
        </Section>

        <Section title="6. International Data Transfers">
          <p className="text-muted-foreground">
            Baalvion operates globally, and your information may be transferred to, and processed in, countries other than the one in which you reside. These countries may have data protection laws that are different from the laws of your country. We rely on secure cloud infrastructure with robust security and data protection safeguards to ensure that your data is protected wherever it is processed.
          </p>
        </Section>

        <Section title="7. Data Retention Policy">
            <p className="text-muted-foreground">
                We retain your personal information for as long as your account is active or as needed to provide you with our services. We may also retain information to comply with our legal obligations, resolve disputes, and enforce our agreements. Inactive accounts and associated data may be scheduled for deletion in accordance with our internal data retention schedules.
            </p>
        </Section>

        <Section title="8. Data Security">
            <p className="text-muted-foreground">
                We implement a range of technical and organizational security measures to protect your information from unauthorized access, use, or disclosure. These measures include data encryption in transit and at rest, secure software development practices, access controls, and system monitoring. However, no security system is impenetrable, and we cannot guarantee the absolute security of your information.
            </p>
        </Section>

        <Section title="9. User Rights">
            <p className="text-muted-foreground">
                Depending on your location, you may have certain rights regarding your personal information. We are committed to providing you with the ability to exercise these rights, which may include:
            </p>
            <BulletList items={[
                "The right to access the personal information we hold about you.",
                "The right to correct any inaccurate personal information.",
                "The right to request the deletion of your personal information.",
                "The right to restrict the processing of your personal information.",
                "The right to data portability.",
                "The right to withdraw consent at any time, where we are relying on consent to process your information.",
            ]} />
            <p className="text-muted-foreground">
                To exercise these rights, please contact us at the email address provided below. We are aware of our obligations under global data protection frameworks, including the principles of the GDPR and the requirements of India’s Information Technology Act, 2000.
            </p>
        </Section>

        <Section title="10. Cookies Policy Summary">
            <p className="text-muted-foreground">We use cookies and similar tracking technologies for several purposes:</p>
            <BulletList items={[
                "Essential Cookies: Necessary for the Platform to function, such as for authentication and security.",
                "Analytics Cookies: Help us understand how users interact with our Platform, allowing us to improve it.",
                "Preference Cookies: Remember your settings and preferences to enhance your user experience.",
            ]} />
             <p className="text-muted-foreground">Most browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.</p>
        </Section>

        <Section title="11. Children's Privacy">
            <p className="text-muted-foreground">
                Our Platform is not intended for individuals under the age of 18 or the applicable legal age of employment in their jurisdiction. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such information, we will take steps to delete it.
            </p>
        </Section>

        <Section title="12. Third-Party Links">
            <p className="text-muted-foreground">
                Our Platform may contain links to other websites, products, or services that we do not own or operate. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information to them.
            </p>
        </Section>

        <Section title="13. Policy Updates">
            <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. When we do, we will post the updated policy on this page and revise the "Last Updated" date at the top. We encourage you to review this policy periodically.
            </p>
        </Section>

        <Section title="14. Contact Information">
            <p className="text-lg text-muted-foreground">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="text-lg text-muted-foreground">
                <p>Email: legal@baalvion.com</p>
                <p>Baalvion Industries Pvt Ltd</p>
                <p>[Your Registered Office Address, City, Postal Code, India]</p>
            </div>
        </Section>
      </div>
    </main>
  );
}
