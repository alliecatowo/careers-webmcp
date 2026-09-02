
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { User, Document, DocumentStatus } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Upload, Loader2 } from 'lucide-react';
import { documentService } from '@/services/document.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/system/Toast/useToast';
import { DocumentStatusBadge } from '../DocumentStatusBadge';

const DocumentUploadDialog = dynamic(() => import('../DocumentUploadDialog').then(mod => mod.DocumentUploadDialog), {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
});


interface DocumentsTabProps {
    user: User;
}

export function DocumentsTab({ user }: DocumentsTabProps) {
    const { showToast } = useToast();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const fetchDocs = async () => {
        setIsLoading(true);
        try {
            const data = await documentService.getDocumentsForCandidate(user.id);
            setDocuments(data);
        } catch (err) {
            console.error("Failed to fetch documents", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user.id) {
            fetchDocs();
        }
    }, [user.id]);
    
    const handleRequestDeletion = async (docId: string) => {
        showToast({
            type: 'info',
            title: 'Deletion Requested',
            description: 'Your request to delete this document has been submitted for admin approval.'
        });
        await documentService.requestDocumentDeletion(docId);
        fetchDocs(); // Re-fetch to update status
    };
    
    const handleUploadSuccess = () => {
        setIsUploadOpen(false);
        showToast({ type: 'success', title: 'Document Uploaded', description: 'Your document is now pending verification.' });
        fetchDocs();
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/4" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Documents & Certificates</CardTitle>
                        <CardDescription>Manage all your employment and verification documents.</CardDescription>
                    </div>
                    <Button onClick={() => setIsUploadOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <caption className="sr-only">A table of your uploaded documents.</caption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length > 0 ? (
                                documents.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>{doc.type.replace('_', ' ')}</TableCell>
                                        <TableCell>{doc.country}</TableCell>
                                        <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                                        <TableCell><DocumentStatusBadge status={doc.status} /></TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => window.open(doc.url, '_blank')}>Download</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-destructive" 
                                                        onSelect={() => handleRequestDeletion(doc.id)}
                                                        disabled={doc.status === 'DELETION_REQUESTED'}
                                                    >
                                                        Request Deletion
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No documents found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {isUploadOpen && (
                <DocumentUploadDialog 
                    isOpen={isUploadOpen}
                    onClose={() => setIsUploadOpen(false)}
                    onUploadSuccess={handleUploadSuccess}
                    candidateId={user.id}
                />
            )}
        </>
    );
}
