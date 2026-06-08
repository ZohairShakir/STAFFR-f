'use client';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      className={cn(
        'block rounded-full border-2 border-current border-t-transparent animate-spin',
        sizes[size],
        className,
      )}
      aria-label="Loading"
    />
  );
}
