'use client';
import { cn } from '@/lib/utils';

export type ToastProps = {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'error';
  duration?: number;
};

export function Toast({ title, description, variant = 'info' }: ToastProps) {
  const variantStyles = {
    info:    'border-blue-500/20 bg-blue-500/10',
    success: 'border-emerald-500/20 bg-emerald-500/10',
    error:   'border-red-500/20 bg-red-500/10',
  };

  const titleStyles = {
    info:    'text-blue-500',
    success: 'text-emerald-500',
    error:   'text-red-500',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-80 rounded-xl border p-4 shadow-lg bg-surface',
        'animate-fade-up',
        variantStyles[variant],
      )}
      role="status"
      aria-live="polite"
    >
      <p className={cn('text-sm font-medium', titleStyles[variant])}>{title}</p>
      {description && <p className="mt-1 text-xs text-(--text-muted)">{description}</p>}
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t, i) => (
        <Toast key={i} {...t} />
      ))}
    </div>
  );
}
