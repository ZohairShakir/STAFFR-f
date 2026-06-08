'use client';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-[#4F6EF7] hover:bg-[#3d5ce0] text-white border-transparent shadow-sm shadow-[#4F6EF7]/20',
  ghost:   'bg-surface border border-(--border) text-(--text-muted) hover:text-(--text) hover:bg-(--surface-2) hover:border-(--border-2)',
  danger:  'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 15} />
      ) : null}
      {children}
    </button>
  );
}
