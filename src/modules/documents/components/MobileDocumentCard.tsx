
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document, DocumentStatus } from "@/types";
import { MoreHorizontal, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusStyles: Record<DocumentStatus, string> = {
  UPLOADED: "bg-gray-100 text-gray-800",
  PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  DELETION_REQUESTED: "bg-orange-100 text-orange-800",
  DELETED: "bg-destructive text-destructive-foreground",
};

export function MobileDocumentCard({ doc, handleStatusUpdate, handleDeleteApproval }: { doc: Document, handleStatusUpdate: (doc: Document, status: 'VERIFIED' | 'REJECTED') => void, handleDeleteApproval: (docId: string) => void }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base truncate">{doc.name}</CardTitle>
                    <Badge className={statusStyles[doc.status]}>{doc.status.replace(/_/g, ' ')}</Badge>
                </div>
                <CardDescription>Candidate: {doc.candidateId}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
                Type: {doc.type}
            </CardContent>
            <CardFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                            <MoreHorizontal className="mr-2 h-4 w-4" /> Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {doc.status === 'PENDING_VERIFICATION' && (
                            <>
                                <DropdownMenuItem onSelect={() => handleStatusUpdate(doc, 'VERIFIED')}><Check className="mr-2 h-4 w-4"/>Approve</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusUpdate(doc, 'REJECTED')} className="text-destructive"><X className="mr-2 h-4 w-4"/>Reject</DropdownMenuItem>
                            </>
                        )}
                        {doc.status === 'DELETION_REQUESTED' && (
                             <DropdownMenuItem onSelect={() => handleDeleteApproval(doc.id)} className="text-destructive"><Check className="mr-2 h-4 w-4"/>Approve Deletion</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
