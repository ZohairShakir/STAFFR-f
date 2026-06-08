'use client';
import { cn } from '@/lib/utils';

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

export function StatusSelect({
  value,
  onChange,
  options,
  className,
  disabled,
}: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'h-9 rounded-xl border border-[var(--border)] bg-white px-3 pr-8 text-sm relative',
        'text-[var(--text)] appearance-none shadow-sm',
        'transition-colors duration-150',
        'focus:outline-none focus:border-[#4F6EF7] focus:ring-1 focus:ring-[#4F6EF7]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
