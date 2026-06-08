'use client';
import { type FieldValues, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  as?: 'input' | 'textarea' | 'select';
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  error,
  required,
  disabled,
  className,
  options,
  as = 'input',
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const fieldError = errors[name]?.message as string | undefined;

  const baseFieldClassName = cn(
    'h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm',
    'text-white placeholder-white/30',
    'transition-colors duration-150',
    'focus:outline-none focus:border-[#4F6EF7] focus:ring-1 focus:ring-[#4F6EF7]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    (error || fieldError) && 'border-[#EF4444]',
  );

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className="text-xs font-medium text-white/70">
        {label}
        {required && <span className="ml-1 text-[#EF4444]">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={cn(baseFieldClassName, 'py-2')}
          {...(register as (n: string) => Record<string, unknown>)(name)}
        />
      ) : as === 'select' && options ? (
        <select
          disabled={disabled}
          className={cn(baseFieldClassName, 'appearance-none pr-8')}
          {...(register as (n: string) => Record<string, unknown>)(name)}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={baseFieldClassName}
          {...(register as (n: string) => Record<string, unknown>)(name)}
        />
      )}
      {(error || fieldError) && (
        <p className="text-xs text-[#EF4444]">{error || fieldError}</p>
      )}
    </div>
  );
}
