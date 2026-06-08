'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'error';
  duration?: number;
}

export function Toast({ title, description, variant = 'info' }: ToastProps) {
  const variantStyles = {
    info: 'border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10',
    success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10',
    error: 'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10',
  };

  const titleStyles = {
    info: 'text-blue-900 dark:text-blue-100',
    success: 'text-emerald-900 dark:text-emerald-100',
    error: 'text-red-900 dark:text-red-100',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-80 rounded-xl border p-4 shadow-lg bg-[var(--surface)]',
        'animate-fade-up',
        variantStyles[variant],
      )}
      role="status"
      aria-live="polite"
    >
      <p className={cn('text-sm font-medium', titleStyles[variant])}>{title}</p>
      {description && <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handler = (props: ToastProps) => {
      setToasts((prev) => [...prev, props]);
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, props.duration ?? 4000);
    };
    (window as unknown as Record<string, (p: ToastProps) => void>).__staffrToast = handler;
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t, i) => (
          <Toast key={i} {...t} />
        ))}
      </div>
    </>
  );
}
