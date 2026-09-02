
"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { placementService } from "@/services/placement.service";
import { studentService } from "@/services/student.service";
import type { Placement, Student } from "@/types/placement.types";
import { useToast } from "@/components/system/Toast/useToast";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

interface EnrichedPlacement extends Placement {
  studentName?: string;
  offerLetterUrl?: string;
  idProofUrl?: string;
}

export default function AdminPlacementPanel() {
  const [placements, setPlacements] = useState<EnrichedPlacement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pendingPlacements, allStudents] = await Promise.all([
        placementService.getPendingPlacements(),
        studentService.getAllStudents(),
      ]);

      const studentsMap = new Map(allStudents.map((s: Student) => [s.id, s]));

      setPlacements(
        pendingPlacements.map((p) => {
            const student = studentsMap.get(p.studentId);
            return {
                ...p,
                studentName: student?.name || "Unknown Student",
                offerLetterUrl: student?.documents?.offerLetterUrl,
                idProofUrl: student?.documents?.idProofUrl,
            }
        })
      );
    } catch (error) {
        console.error("Failed to fetch pending placements:", error);
        showToast({ type: 'error', title: 'Error', description: 'Failed to load data.' });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approvePlacement = async (placement: EnrichedPlacement) => {
    if (!placement.offerLetterUrl || !placement.idProofUrl) {
      showToast({ type: 'error', title: 'Verification Missing', description: 'Please ensure both documents are present before approval.' });
      return;
    }
    try {
        await placementService.approvePlacement(placement.id, {
            auditLogs: [
                {
                    action: "approved",
                    adminId: "currentAdminId", // replace with auth context in a real app
                    timestamp: new Date().toISOString(),
                    notes: "Verified documents and approved placement",
                },
            ],
        });
        showToast({ type: 'success', title: 'Success', description: 'Placement has been approved.' });
        fetchData(); // Refresh the list
    } catch (error) {
        console.error("Failed to approve placement:", error);
        showToast({ type: 'error', title: 'Error', description: 'Could not approve placement.' });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (placements.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No pending placements to review.</p>
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placements.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.studentName}</TableCell>
              <TableCell>{p.companyName}</TableCell>
              <TableCell>{p.role}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                    {p.offerLetterUrl ? <Link href={p.offerLetterUrl} target="_blank" className="text-primary hover:underline text-sm">Offer Letter</Link> : <span className="text-destructive text-sm">Missing</span>}
                    {p.idProofUrl ? <Link href={p.idProofUrl} target="_blank" className="text-primary hover:underline text-sm">ID Proof</Link> : <span className="text-destructive text-sm">Missing</span>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => approvePlacement(p)}
                >
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Placement Approvals</h1>
            <p className="text-muted-foreground">Review and approve new placements submitted by students or partners.</p>
        </div>
        <Card>
            <CardContent className="p-0">
                {renderContent()}
            </CardContent>
        </Card>
    </div>
  );
}
