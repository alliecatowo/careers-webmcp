
import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/types";

const statusStyles: Record<DocumentStatus, string> = {
  UPLOADED: "bg-gray-100 text-gray-800",
  PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  DELETION_REQUESTED: "bg-orange-100 text-orange-800",
  DELETED: "bg-destructive text-destructive-foreground",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const formattedStatus = status.replace(/_/g, ' ');
  return <Badge variant="outline" className={statusStyles[status] || ""}>{formattedStatus}</Badge>;
}
