
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Document, DocumentStatus } from '@/types/document.types';
import { documentService } from '@/services/document.service';
import { useToast } from '@/components/system/Toast/useToast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, Loader2 } from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import { MobileDocumentCard } from '@/modules/documents/components/MobileDocumentCard';
import { Badge } from '@/components/ui/badge';

export default function DocumentsAdminPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchDocuments = async () => {
        setIsLoading(true);
        const allDocs = await (documentService as any).getAllDocuments();
        setDocuments(allDocs);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleStatusUpdate = async (doc: Document, status: 'VERIFIED' | 'REJECTED') => {
        try {
            await (documentService as any).updateDocumentStatus(doc.id, status);
            showToast({ type: 'success', title: `Document ${status.toLowerCase()}`, description: `The document "${doc.name}" has been updated.` });
            
            // Send mock notification
            notificationService.sendNotification(doc.candidateId, {
                title: 'Document Status Updated',
                message: `Your document "${doc.name}" has been ${status.toLowerCase()}.`,
                type: status === 'VERIFIED' ? 'SUCCESS' : 'ERROR',
                link: '/my-account?tab=documents'
            });

            fetchDocuments();
        } catch (error) {
            showToast({ type: 'error', title: 'Update failed', description: 'Could not update the document status.' });
        }
    };

    const handleDeleteApproval = async (docId: string) => {
        try {
            await (documentService as any).approveDeletion(docId);
            showToast({ type: 'success', title: 'Document Deleted', description: 'The document has been successfully deleted.' });
            fetchDocuments();
        } catch (error) {
            showToast({ type: 'error', title: 'Deletion failed', description: 'Could not approve the document deletion.' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
                <p className="text-muted-foreground">Approve, reject, and manage all candidate documents.</p>
            </div>

            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {documents.map(doc => (
                    <MobileDocumentCard 
                        key={doc.id}
                        doc={doc} 
                        handleStatusUpdate={handleStatusUpdate} 
                        handleDeleteApproval={handleDeleteApproval} 
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block">
                <CardHeader>
                    <CardTitle>All Documents</CardTitle>
                    <CardDescription>Review documents pending verification or deletion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate ID</TableHead>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.candidateId}</TableCell>
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>
                                        <Badge className={(statusStyles as any)[doc.status]}>{doc.status.replace(/_/g, ' ')}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

const statusStyles: Record<DocumentStatus, string> = {
  UPLOADED: "bg-gray-100 text-gray-800",
  PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  DELETION_REQUESTED: "bg-orange-100 text-orange-800",
  DELETED: "bg-destructive text-destructive-foreground",
};
