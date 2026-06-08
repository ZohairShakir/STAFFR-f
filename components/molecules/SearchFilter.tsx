'use client';
import { type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: SearchFilterProps) {
  return (
    <div className={cn('relative', className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-64 rounded-xl border border-[var(--border)] bg-white pl-9 pr-3 text-sm',
          'text-[var(--text)] placeholder:text-[var(--text-faint)]',
          'transition-colors duration-150 shadow-sm',
          'focus:outline-none focus:border-[#4F6EF7] focus:ring-1 focus:ring-[#4F6EF7]',
        )}
      />
    </div>
  );
}
