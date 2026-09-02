
'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AuditLog } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
}

function AuditLogDetails({ details }: { details: any }) {
    if (!details) return <span className="text-muted-foreground">N/A</span>;
    return (
        <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
            {JSON.stringify(details, null, 2)}
        </pre>
    )
}

function MobileAuditCard({ log }: { log: AuditLog }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{log.actionType}</CardTitle>
                <CardDescription>{new Date(log.timestamp).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div>
                    <p className="font-semibold">Actor</p>
                    <p>{log.actorName} ({log.actorId})</p>
                </div>
                 <div>
                    <p className="font-semibold">Entity</p>
                    <p>{log.entityType} ({log.entityId})</p>
                </div>
                 <div>
                    <p className="font-semibold">Details</p>
                    <AuditLogDetails details={log.details} />
                </div>
            </CardContent>
        </Card>
    )
}

export function AuditTable({ logs, isLoading }: AuditTableProps) {
  if (isLoading) {
    return (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
    )
  }

  if (logs.length === 0) {
      return (
          <div className="text-center text-muted-foreground py-8 border rounded-lg">
              No audit logs found for the selected filters.
          </div>
      )
  }

  return (
    <>
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {logs.map(log => <MobileAuditCard key={log.id} log={log} />)}
        </div>

        {/* Desktop View */}
        <Card className="hidden md:block">
            <CardContent className="p-0">
                <Table>
                    <caption className="sr-only">A table of audit log activities.</caption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium text-xs whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <div className="font-semibold">{log.actorName}</div>
                                <div className="text-xs text-muted-foreground">{log.actorId}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">{log.actionType}</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="font-semibold">{log.entityType}</div>
                                <div className="text-xs text-muted-foreground">{log.entityId}</div>
                            </TableCell>
                            <TableCell>
                            <AuditLogDetails details={log.details} />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </>
  );
}
