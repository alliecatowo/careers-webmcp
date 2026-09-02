'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document } from '@/types';
import { FileText, Download, Upload } from 'lucide-react';

interface DocumentManagerProps {
    documents: Document[];
}

export function DocumentManager({ documents }: DocumentManagerProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Manage your application documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {documents.length > 0 ? (
                    documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <a href={doc.url} download>
                                    <Download className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                )}
                <div className="pt-4 border-t">
                    <Button variant="outline" disabled>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Document
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
