'use client';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const colors = [
    'bg-[#4F6EF7]',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-cyan-500',
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0',
        sizeClasses[size],
        bgColor,
        className,
      )}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover', sizeClasses[size])}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
