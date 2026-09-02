import { Badge } from '@/components/ui/badge';
import { OfferStatus } from '../domain/offer.entity';

interface OfferStatusBadgeProps {
  status: OfferStatus;
}

const statusStyles: Record<OfferStatus, string> = {
  DRAFT:
    'border-transparent bg-gray-100 text-gray-900 dark:bg-gray-900/50 dark:text-gray-300',
  PENDING:
    'border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300',
  PENDING_APPROVAL:
    'border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300',
  APPROVED:
    'border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300',
  SENT: 'border-transparent bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300',
  ACCEPTED:
    'border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300',
  DECLINED:
    'border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300',
  REJECTED:
    'border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300',
  EXPIRED:
    'border-transparent bg-gray-500 text-white dark:bg-gray-700 dark:text-gray-200',
};

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  const formattedStatus = status.replace(/_/g, ' ');
  return <Badge className={statusStyles[status]}>{formattedStatus}</Badge>;
}
