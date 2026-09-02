'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription as DialogDescriptionComponent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { documentTypes, DocumentType } from '@/types/document.types';
import { SUPPORTED_COUNTRIES } from '@/config/countries';
import { Loader2 } from 'lucide-react';
import { documentService } from '@/services/document.service';

const uploadSchema = z.object({
    file: z.instanceof(File).refine(file => file.size > 0, "File is required."),
    documentType: z.enum(documentTypes, { required_error: "Document type is required." }),
    country: z.string().min(1, "Country is required."),
    issueDate: z.string().optional(),
    signature: z.boolean().refine(val => val === true, "You must digitally sign the document."),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface DocumentUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
    candidateId: string;
}

export function DocumentUploadDialog({ isOpen, onClose, onUploadSuccess, candidateId }: DocumentUploadDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            country: 'US',
            signature: false,
        }
    });

    const onSubmit = async (data: UploadFormData) => {
        setIsSubmitting(true);
        try {
            await documentService.uploadDocument({
                candidateId,
                file: data.file,
                documentType: data.documentType,
                country: data.country,
                issueDate: data.issueDate,
            });
            onUploadSuccess();
            form.reset();
        } catch (error) {
            console.error("Upload failed", error);
            // Show toast error in a real app
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a New Document</DialogTitle>
                    <DialogDescriptionComponent>
                        Select a file and provide the necessary details. All documents are subject to verification.
                    </DialogDescriptionComponent>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField control={form.control} name="file" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document File</FormLabel>
                                <FormControl>
                                    <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="documentType" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select document type..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {documentTypes.map(type => <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="country" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Country of Issuance</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select country..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {SUPPORTED_COUNTRIES.map(code => <SelectItem key={code} value={code}>{code}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="issueDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Issue Date (Optional)</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="signature" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                               <FormControl>
                                 <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                               </FormControl>
                               <div className="space-y-1 leading-none">
                                 <FormLabel>Digital Signature</FormLabel>
                                 <FormDescription>
                                   By checking this box, you certify that this document is authentic and accurate.
                                 </FormDescription>
                               </div>
                             </FormItem>
                        )} />
                         <DialogFooter>
                            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upload & Sign
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}