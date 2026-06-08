'use client';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-[#4F6EF7]',
  iconBg = 'bg-[#4F6EF7]/10',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'surface-card surface-card-hover p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-[0.12em]">
            {title}
          </p>
          <p className="mt-3 text-[28px] font-bold leading-none tracking-tight font-syne text-[var(--text)]">
            {value}
          </p>
          {change && (
            <p className="mt-2.5 text-[11px] font-semibold text-emerald-600">{change}</p>
          )}
        </div>
        {Icon && (
          <div className={cn('rounded-xl p-2.5', iconBg, iconColor)}>
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}
