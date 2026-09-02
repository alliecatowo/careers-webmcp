'use client';
import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MultiPhaseApplicationData } from '@/types';
import { applicationService } from '@/services/application.service';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

function DetailSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="py-4 border-b">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="space-y-2 text-sm">{children}</div>
        </div>
    )
}

function DetailItem({ label, value }: { label: string, value?: string | number | null | string[] }) {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground col-span-1">{label}</span>
            <span className="col-span-2">{Array.isArray(value) ? value.join(', ') : value}</span>
        </div>
    )
}

interface ApplicationDetailDrawerProps {
    applicationId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ApplicationDetailDrawer({ applicationId, isOpen, onClose }: ApplicationDetailDrawerProps) {
    const [application, setApplication] = useState<MultiPhaseApplicationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && applicationId) {
            setIsLoading(true);
            applicationService.getDetailedApplication(applicationId).then(data => {
                setApplication(data || null);
            }).catch(console.error).finally(() => setIsLoading(false));
        } else {
            setApplication(null);
        }
    }, [isOpen, applicationId]);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-2xl">
                <SheetHeader>
                    <SheetTitle>Application Details</SheetTitle>
                    {application && <SheetDescription>For {application.fullName} - {application.jobTitle}</SheetDescription>}
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] pr-6">
                    <div className="py-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : !application ? (
                            <p className="text-center text-muted-foreground">Application data not found.</p>
                        ) : (
                            <div className="space-y-6">
                                <DetailSection title="Basic Information">
                                    <DetailItem label="Full Name" value={application.fullName} />
                                    <DetailItem label="Email" value={application.email} />
                                    <DetailItem label="Phone" value={application.phone} />
                                    <DetailItem label="Work Model" value={application.preferredWorkModel} />
                                    <DetailItem label="Discovered Via" value={application.sourceOfDiscovery} />
                                    <DetailItem label="LinkedIn" value={application.linkedinUrl} />
                                    <DetailItem label="Portfolio" value={application.portfolioUrl} />
                                </DetailSection>
                                <DetailSection title="Skills & Projects">
                                    <DetailItem label="Primary Expertise" value={application.primaryExpertise} />
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground col-span-1">Projects</span>
                                        <p className="col-span-2 whitespace-pre-wrap">{application.projects}</p>
                                    </div>
                                    <DetailItem label="Challenge Link" value={application.technicalChallengeLink} />
                                </DetailSection>
                                <DetailSection title="Verification Details">
                                    <DetailItem label="National ID" value={application.nationalId} />
                                    <DetailItem label="Tax ID" value={application.taxId} />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {application.experienceCertificate && <Badge variant="outline">Has Experience Cert.</Badge>}
                                        {application.lastJobCertificate && <Badge variant="outline">Has Last Job Cert.</Badge>}
                                        {application.recommendationLetters && <Badge variant="outline">Has Rec. Letters</Badge>}
                                        {application.photoId && <Badge variant="outline">Has Photo ID</Badge>}
                                    </div>
                                </DetailSection>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
