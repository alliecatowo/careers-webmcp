
"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { placementService } from "@/services/placement.service";
import { collegeService } from "@/services/college.service";
import { studentService } from "@/services/student.service";
import type { Placement, Student, College } from "@/types/placement.types";

interface EnrichedPlacement extends Placement {
  studentName?: string;
  collegeType?: "1" | "2" | "3";
  documents?: {
    offerLetterUrl?: string;
    idProofUrl?: string;
  };
}

interface Stats {
  totalStudents: number;
  totalCompanies: number;
  successRate: string;
}

export default function PlacementPage() {
  const [placements, setPlacements] = useState<EnrichedPlacement[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCompanies: 0,
    successRate: "0%",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [approvedPlacements, allStudents, allColleges] = await Promise.all([
            placementService.getApprovedPlacements(),
            studentService.getAllStudents(),
            collegeService.getAllColleges()
        ]);
        
        const studentsMap = new Map(allStudents.map((s) => [s.id, s]));
        const collegesMap = new Map(allColleges.map((c: any) => [c.id, c]));

        const enrichedPlacements = approvedPlacements.map((p) => {
            const student = studentsMap.get(p.studentId);
            const college = student ? collegesMap.get(student.collegeId) : undefined;
            return {
                ...p,
                studentName: student?.name || "Unknown Student",
                collegeType: college?.type || "3",
                documents: student?.documents,
            };
        });

        setPlacements(enrichedPlacements);

        const uniqueCompanies = new Set(enrichedPlacements.map((p) => p.companyName)).size;
        setStats({
            totalStudents: enrichedPlacements.length,
            totalCompanies: uniqueCompanies,
            successRate: "100%", // As we only fetch approved
        });

      } catch (error) {
        console.error("Failed to fetch placement data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-muted/40 font-sans">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-8 text-center">
        <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Verified Campus Placements
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Showcasing our top talent and stellar placement record, trusted by leading global companies across Type 1, Type 2, and Type 3 colleges.
            </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-4xl font-bold text-primary">{stats.totalStudents}+</h2>
              <p className="text-muted-foreground mt-2">Students Placed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-4xl font-bold text-primary">{stats.totalCompanies}+</h2>
              <p className="text-muted-foreground mt-2">Partner Companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-4xl font-bold text-primary">{stats.successRate}</h2>
              <p className="text-muted-foreground mt-2">Placement Success Rate</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Placement Table */}
      <section className="py-12 px-8 container mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Recent Approved Placements</h2>
        <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>College Type</TableHead>
                  <TableHead>Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}><TableCell colSpan={5} className="h-12 text-center">Loading...</TableCell></TableRow>
                    ))
                ) : placements.length > 0 ? (
                    placements.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.studentName}</TableCell>
                            <TableCell>{p.companyName}</TableCell>
                            <TableCell>{p.role}</TableCell>
                            <TableCell>Type {p.collegeType}</TableCell>
                            <TableCell>
                                {p.documents?.offerLetterUrl && <Link href={p.documents.offerLetterUrl} target="_blank" className="text-primary hover:underline text-sm mr-2">Offer Letter</Link>}
                                {p.documents?.idProofUrl && <Link href={p.documents.idProofUrl} target="_blank" className="text-primary hover:underline text-sm">ID Proof</Link>}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                     <TableRow><TableCell colSpan={5} className="h-24 text-center">No approved placements to show.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
        </Card>
      </section>

      {/* Call-to-Action */}
      <section className="bg-background py-16 px-8 text-center">
         <div className="container mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Want to Partner with Us?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Connect with our placement cell to recruit top talent from our colleges.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
        </div>
      </section>
    </main>
  );
}
