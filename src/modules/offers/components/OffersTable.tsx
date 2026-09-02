
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Offer } from '../domain/offer.entity';
import { OfferStatusBadge } from "./OfferStatusBadge";
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/currency';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface OffersTableProps {
  offers: Offer[];
  onDelete: (offer: Offer) => void;
}

function MobileOfferCard({ offer, onDelete }: { offer: Offer; onDelete: (offer: Offer) => void; }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{offer.candidateName}</CardTitle>
                    <OfferStatusBadge status={offer.status} />
                </div>
                <CardDescription>{offer.position}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <div><span className="font-semibold">Base Salary:</span> {formatCurrency(offer.baseSalary, offer.currency)}</div>
                <div><span className="font-semibold">Created:</span> {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}</div>
            </CardContent>
            <CardFooter>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                        <MoreHorizontal className="h-4 w-4 mr-2" /> Actions
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/offers/${offer.applicationId}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(offer)}>
                            Delete Offer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}

export function OffersTable({ offers, onDelete }: OffersTableProps) {
  return (
    <>
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {offers.map(offer => (
                <MobileOfferCard key={offer.id} offer={offer} onDelete={onDelete} />
            ))}
        </div>

        {/* Desktop View */}
        <div className="rounded-lg border hidden md:block">
            <Table>
                <caption className="sr-only">A table of job offers.</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Base Salary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {offers.map((offer) => (
                    <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.candidateName}</TableCell>
                        <TableCell>{offer.position}</TableCell>
                        <TableCell>{formatCurrency(offer.baseSalary, offer.currency)}</TableCell>
                        <TableCell><OfferStatusBadge status={offer.status} /></TableCell>
                        <TableCell>{offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/offers/${offer.applicationId}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(offer)}>
                                        Delete Offer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </>
  );
}
