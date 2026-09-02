
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Data Protection Policy",
    description: "Learn about Baalvion's commitment to data protection, our principles, and the measures we take to secure your data.",
    alternates: {
        canonical: '/data-protection',
    },
    openGraph: {
        title: "Data Protection Policy | TalentOS by Baalvion",
        description: "Learn about Baalvion's commitment to data protection.",
        url: '/data-protection'
    }
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold tracking-tight">{children}</h2>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
    <ul className="list-disc space-y-3 pl-6">
        {items.map((item, index) => <li key={index} className="text-muted-foreground [&>strong]:font-semibold [&>strong]:text-foreground">{item}</li>)}
    </ul>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode}) => (
    <section className="space-y-4">
        <SectionTitle>{title}</SectionTitle>
        {children}
    </section>
)

export default function DataProtectionPolicyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Data Protection Policy</h1>
          <p className="mt-4 text-lg text-muted-foreground">Version 1.0 | Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12">
        
        <Section title="1. Purpose &amp; Scope">
          <p className="text-lg text-muted-foreground">
            This Data Protection Policy outlines the commitment of Baalvion Industries Pvt Ltd ("Baalvion") to protecting personal data processed within our global talent acquisition platform, Jobs.Baalvion.com (the "Platform"). This policy applies to all personal data collected, processed, and stored by Baalvion, including data from candidates, employer clients, and platform users. It forms the foundation of our data governance framework and demonstrates our commitment to operating in a secure, transparent, and compliant manner.
          </p>
        </Section>

        <Separator />

        <Section title="2. Data Protection Principles">
          <p className="text-lg text-muted-foreground">Baalvion adheres to the following core data protection principles:</p>
          <BulletList items={[
              <><strong>Lawfulness, Fairness, and Transparency:</strong> We process personal data lawfully, fairly, and in a transparent manner in relation to the data subject.</>,
              <><strong>Purpose Limitation:</strong> We collect personal data for specified, explicit, and legitimate purposes and do not further process it in a manner that is incompatible with those purposes.</>,
              <><strong>Data Minimization:</strong> We ensure that personal data is adequate, relevant, and limited to what is necessary in relation to the purposes for which it is processed.</>,
              <><strong>Accuracy:</strong> We take every reasonable step to ensure that personal data is accurate and, where necessary, kept up to date.</>,
              <><strong>Storage Limitation:</strong> We keep personal data in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data is processed.</>,
              <><strong>Integrity and Confidentiality:</strong> We process personal data in a manner that ensures appropriate security, including protection against unauthorized or unlawful processing and against accidental loss, destruction, or damage, using appropriate technical and organizational measures.</>,
          ]} />
        </Section>
        
        <Section title="3. Types of Data Processed">
          <p className="text-lg text-muted-foreground">We process various categories of data to provide our services:</p>
            <BulletList items={[
                <><strong>Candidate Personal Data:</strong> Includes contact details, professional experience, education, skills, and any information contained within a resume or profile.</>,
                <><strong>Employer Data:</strong> Includes company information, job descriptions, and hiring criteria provided by our clients.</>,
                <><strong>Account Data:</strong> Includes user credentials, roles (e.g., recruiter, admin), and permissions.</>,
                <><strong>Technical Log Data:</strong> Includes IP addresses, device information, and system activity logs for security and performance monitoring.</>,
                <><strong>AI-Generated Analysis Data:</strong> Includes structured data parsed from resumes, candidate scores, and summaries generated by our proprietary AI models.</>,
            ]} />
        </Section>

        <Section title="4. Legal Basis for Processing">
          <p className="text-lg text-muted-foreground">Our processing activities are based on the following legal grounds:</p>
            <BulletList items={[
                <><strong>Consent:</strong> Where a data subject has given clear consent for us to process their personal data for a specific purpose (e.g., a candidate applying for a job).</>,
                <><strong>Contractual Necessity:</strong> Where processing is necessary for the performance of a contract to which the data subject is party (e.g., providing our platform services to a client).</>,
                <><strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate interests, such as platform security, analytics, and service improvement, provided these interests are not overridden by the rights of the data subject.</>,
                <><strong>Legal Obligation:</strong> Where processing is necessary for us to comply with the law.</>,
            ]} />
        </Section>
        
        <Section title="5. Data Security Measures">
          <p className="text-lg text-muted-foreground">Baalvion implements a multi-layered security framework to protect data:</p>
            <BulletList items={[
                <><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.2+ and at rest using industry-standard AES-256 encryption.</>,
                <><strong>Access Control:</strong> We enforce a strict role-based access control (RBAC) model to ensure users can only access data necessary for their role.</>,
                <><strong>Logging and Monitoring:</strong> System activity is extensively logged and monitored for suspicious behavior and security incidents.</>,
                <><strong>Secure Infrastructure:</strong> Our platform is hosted on a leading cloud infrastructure provider that maintains a high level of physical and network security.</>,
                <><strong>Incident Response:</strong> We have established procedures for responding to and mitigating the impact of any potential data security incident.</>,
            ]} />
        </Section>
        
        <Section title="6. AI Data Governance">
          <p className="text-lg text-muted-foreground">Our use of Artificial Intelligence is governed by a commitment to responsible and ethical practices:</p>
            <BulletList items={[
                <><strong>Transparency:</strong> We are transparent about our use of AI for resume parsing and candidate scoring, as detailed in our Privacy Policy.</>,
                <><strong>Human-in-the-Loop:</strong> AI-generated analysis serves as a tool to assist human recruiters. We do not make fully automated hiring decisions.</>,
                <><strong>Bias Mitigation:</strong> We are committed to an ongoing process of identifying and mitigating potential biases in our algorithms and data.</>,
                <><strong>Data Quality:</strong> We implement controls to ensure the quality and integrity of data used to train and operate our AI models.</>,
            ]} />
        </Section>
        
        <Section title="7. Data Retention &amp; Deletion">
          <p className="text-lg text-muted-foreground">Data is retained only for as long as necessary:</p>
            <BulletList items={[
                <><strong>Retention Schedules:</strong> Personal data is retained for the duration of an active account or application process. Specific retention periods are defined based on legal requirements and business needs.</>,
                <><strong>Account Deletion:</strong> Upon account deletion or data subject request, personal data is either anonymized or permanently deleted from production systems in accordance with our procedures.</>,
                <><strong>Backup Policies:</strong> Data in backups is isolated and protected from further processing and is deleted in line with our backup rotation cycle.</>,
            ]} />
        </Section>
        
        <Section title="8. Third-Party Processors">
          <p className="text-lg text-muted-foreground">We engage a limited number of third-party service providers ("sub-processors") for specific technical functions. All sub-processors are subject to a rigorous due diligence process and are bound by contractual agreements that ensure they meet our data protection and security standards. These include providers for cloud hosting, email delivery, and platform analytics.</p>
        </Section>
        
        <Section title="9. International Data Transfers">
          <p className="text-lg text-muted-foreground">As a global platform, data may be processed in jurisdictions outside of the data subject's home country. We ensure that all international data transfers are protected by appropriate safeguards, such as Standard Contractual Clauses (SCCs) and adherence to enterprise-level security standards across all processing locations.</p>
        </Section>
        
        <Section title="10. Data Subject Rights Handling">
          <p className="text-lg text-muted-foreground">Baalvion has established procedures to facilitate the exercise of data subject rights, including rights of access, rectification, erasure, restriction, and portability. All requests are handled in a timely manner, in accordance with applicable legal frameworks. Users can initiate a request through the contact information provided in our Privacy Policy.</p>
        </Section>

        <Section title="11. Data Breach Management">
          <p className="text-lg text-muted-foreground">In the event of a data breach, our incident response team will take immediate action to contain, investigate, and mitigate the incident. We will notify affected parties and relevant regulatory authorities in accordance with our legal obligations and our established breach notification procedures.</p>
        </Section>
        
        <Section title="12. Governance &amp; Accountability">
          <p className="text-lg text-muted-foreground">Data protection is a core responsibility at Baalvion. We maintain an internal governance structure to oversee our data protection program, conduct regular policy reviews, and monitor for compliance with this policy and applicable regulations, including GDPR principles and India's Information Technology Act, 2000.</p>
        </Section>
        
        <Section title="13. Contact &amp; Escalation">
          <p className="text-lg text-muted-foreground">For questions regarding this policy or our data protection practices, please contact our legal team at legal@baalvion.com. This is the designated channel for all data protection inquiries.</p>
        </Section>
      </div>
    </main>
  );
}
