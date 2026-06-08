'use client';
import { cn } from '@/lib/utils';

type BadgeStatus =
  | 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  | 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  | 'WEB' | 'SLACK';

const statusStyles: Record<BadgeStatus, string> = {
  PENDING:     'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  REVIEWING:   'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  ACCEPTED:    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  OPEN:        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  IN_PROGRESS: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
  REJECTED:    'bg-red-500/10 text-red-500 border border-red-500/20',
  CLOSED:      'bg-red-500/10 text-red-500 border border-red-500/20',
  DRAFT:       'bg-(--surface-muted) text-(--text-muted) border border-(--border)',
  WITHDRAWN:   'bg-(--surface-muted) text-(--text-faint) border border-(--border)',
  WEB:         'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  SLACK:       'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
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
        statusStyles[status] ?? 'bg-(--surface-muted) text-(--text-muted) border border-(--border)',
        className,
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
