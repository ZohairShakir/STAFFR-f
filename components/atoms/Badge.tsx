'use client';
import { cn } from '@/lib/utils';

type BadgeStatus =
  | 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  | 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  | 'WEB' | 'SLACK';

const statusStyles: Record<BadgeStatus, string> = {
  PENDING:     'bg-blue-50 text-blue-700 border border-blue-100',
  REVIEWING:   'bg-amber-50 text-amber-700 border border-amber-100',
  ACCEPTED:    'bg-emerald-50 text-emerald-700 border border-emerald-100',
  OPEN:        'bg-emerald-50 text-emerald-700 border border-emerald-100',
  IN_PROGRESS: 'bg-sky-50 text-sky-700 border border-sky-100',
  REJECTED:    'bg-red-50 text-red-700 border border-red-100',
  CLOSED:      'bg-red-50 text-red-700 border border-red-100',
  DRAFT:       'bg-gray-100 text-gray-600 border border-gray-200',
  WITHDRAWN:   'bg-gray-50 text-gray-500 border border-gray-200',
  WEB:         'bg-blue-50 text-blue-600 border border-blue-100',
  SLACK:       'bg-emerald-50 text-emerald-600 border border-emerald-100',
};

const statusLabels: Partial<Record<BadgeStatus, string>> = {
  IN_PROGRESS: 'In Progress',
};

interface BadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-syne tracking-wide',
        statusStyles[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200',
        className,
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
