// This is a mock email service for demonstration purposes.
// In a real application, this would integrate with a transactional email provider like SendGrid, Postmark, or AWS SES.

import { Job, Candidate, User } from "@/types";
import { Interview } from "@/modules/interviews/domain/interview.entity";

export async function sendApplicationConfirmation(candidate: Candidate, job: Job) {
  console.log("=====================================");
  console.log(`📧 MOCK EMAIL: Sending application confirmation...`);
  console.log(`   To: ${candidate.email}`);
  console.log(`   Subject: Your Application for ${job.title} at Baalvion`);
  console.log(`
    Hi ${candidate.name},

    Thank you for applying for the ${job.title} position at Baalvion Industries. We have successfully received your application.

    You can track the status of your application at any time by visiting your candidate dashboard.

    Our team will review your qualifications and get back to you soon.

    Best,
    The Baalvion Talent Team
  `);
  console.log("=====================================");
}

export async function sendStageUpdateEmail(candidate: Candidate, job: Job, newStage: string) {
  console.log("=====================================");
  console.log(`📧 MOCK EMAIL: Sending stage update notification...`);
  console.log(`   To: ${candidate.email}`);
  console.log(`   Subject: Update on your application for ${job.title}`);
  console.log(`
    Hi ${candidate.name},

    We have an update on your application for the ${job.title} position. Your application has been moved to the following stage: ${newStage}.

    Please visit your candidate dashboard for more details.

    Best,
    The Baalvion Talent Team
  `);
  console.log("=====================================");
}

export async function sendOfferEmail(candidate: Candidate, job: Job) {
  console.log("=====================================");
  console.log(`📧 MOCK EMAIL: Sending offer letter...`);
  console.log(`   To: ${candidate.email}`);
  console.log(`   Subject: Congratulations! An Offer from Baalvion Industries`);
  console.log(`
    Dear ${candidate.name},

    Congratulations! Following your recent interviews, we are thrilled to formally offer you the position of ${job.title} at Baalvion Industries.

    Please log in to your candidate dashboard to view and accept your official offer letter.

    We were incredibly impressed with your skills and experience and believe you will be a fantastic addition to our team.

    Best,
    The Baalvion Talent Team
  `);
  console.log("=====================================");
}

export async function sendInterviewScheduledEmail(candidate: Candidate, interview: Interview) {
  console.log("=====================================");
  console.log(`📧 MOCK EMAIL: Sending interview confirmation to candidate...`);
  console.log(`   To: ${candidate.email}`);
  console.log(`   Subject: Interview Scheduled for ${interview.jobTitle}`);
  console.log(`
      Hi ${candidate.name},
  
      Your ${interview.stage.replace('_', ' ')} for the ${interview.jobTitle} position has been scheduled.
  
      Please log in to your candidate dashboard to view the full details, including the date, time, and meeting link.
  
      Best,
      The Baalvion Talent Team
    `);
  console.log("=====================================");
}

export async function sendInterviewerNotification(interviewer: User, interview: Interview) {
  console.log("=====================================");
  console.log(`📧 MOCK EMAIL: Sending interview notification to interviewer...`);
  console.log(`   To: ${interviewer.email}`);
  console.log(`   Subject: You have been scheduled for an interview`);
  console.log(`
      Hi ${interviewer.name},
  
      You have been scheduled for a ${interview.stage.replace('_', ' ')} for candidate ID ${interview.candidateId}.
  
      Please check your internal calendar for details.
  
      Job: ${interview.jobTitle}
  
      Thanks,
      Baalvion TalentOS
    `);
  console.log("=====================================");
}
