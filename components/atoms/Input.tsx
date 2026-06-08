'use client';
import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BaseProps = {
  label?: string;
  error?: string;
  className?: string;
};

type InputAsInput = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type InputAsTextarea = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

type InputProps = InputAsInput | InputAsTextarea;

const fieldClassName = (error?: string, className?: string) =>
  cn(
    'rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm',
    'text-[var(--text)] placeholder:text-[var(--text-faint)]',
    'transition-colors duration-150',
    'focus:outline-none focus:border-[#4F6EF7] focus:ring-1 focus:ring-[#4F6EF7]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
    className,
  );

export function Input({ label, error, className, id, as = 'input', ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  if (as === 'textarea') {
    const { rows = 4, ...rest } = props as TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          rows={rows}
          className={cn(fieldClassName(error, className), 'py-2')}
          {...rest}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  const { type = 'text', ...rest } = props as InputHTMLAttributes<HTMLInputElement>;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <input id={inputId} type={type} className={fieldClassName(error, className)} {...rest} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
