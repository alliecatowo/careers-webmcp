
import { NextRequest } from "next/server";
import { addApplication } from '@/mocks/talent-platform/applications.mock';
import { socketEngine } from "@/lib/realtime/socket.engine";
import { talentService } from "@/services/talent.service";
import { Notification } from "@/features/notifications";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(
    request: NextRequest,
    { params }: { params: { country: string } }
) {
    await delay(1000);
    const countrySlug = params.country;

    try {
        const applicationData = await request.json();
        
        console.log(`Received application for ${countrySlug}:`, applicationData);
        
        // Add to our in-memory mock database and get the created app with its ID
        const newApplication = addApplication(applicationData);

        // Fetch job details to include in the notification
        const job = await talentService.getJobById(applicationData.jobId);

        if (job) {
             const notificationPayload: Notification = {
                id: `notif-realtime-${Date.now()}`,
                tenantId: job.tenantId || 'org_acme', 
                title: 'New Application Received',
                message: `${applicationData.fullName} applied for the ${job.title} position.`,
                type: 'INFO',
                read: false,
                createdAt: new Date().toISOString(),
                link: `/applications`
            };
            // Emit a real-time event
            socketEngine.emit('NEW_NOTIFICATION', notificationPayload);
        }
        
        return Response.json({ 
            success: true, 
            data: { applicationId: newApplication.id }, 
            error: null 
        }, { status: 201 });

    } catch (error) {
        console.error("Failed to process application:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return Response.json({ 
            success: false, 
            data: null, 
            error: `Server error processing application: ${errorMessage}` 
        }, { status: 500 });
    }
}
