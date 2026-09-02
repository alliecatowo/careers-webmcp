
interface SentEmail {
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
}

const mockSentEmails: SentEmail[] = [];

// In a real app, this service would use an SDK like @sendgrid/mail or nodemailer
export const emailService = {
  async sendEmail(to: string, subject: string, body: string): Promise<SentEmail> {
    console.log("=====================================");
    console.log(`📧 MOCK EMAIL: Sending email...`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${body}`);
    console.log("=====================================");

    const email: SentEmail = { to, subject, body, sentAt: new Date() };
    mockSentEmails.unshift(email); // Add to the top of the log

    return email;
  },

  async getEmailLog(): Promise<SentEmail[]> {
    return [...mockSentEmails];
  }
};
