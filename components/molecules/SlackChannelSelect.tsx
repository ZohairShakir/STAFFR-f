'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/atoms/Spinner';

interface SlackChannelSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function SlackChannelSelect({
  value,
  onChange,
  label = 'Slack Channel',
  className,
  disabled,
}: SlackChannelSelectProps) {
  const { data: channels, isLoading, isError } = useQuery({
    queryKey: ['slack', 'channels'],
    queryFn: () => api.slack.channels(),
    staleTime: 5 * 60 * 1000,
  });

  const knownIds = new Set(channels?.map((ch) => ch.id) ?? []);
  const showSavedFallback = !!value && !knownIds.has(value);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-xs font-medium text-[var(--text-muted)]">{label}</label>
      {isLoading ? (
        <div className="flex h-9 items-center">
          <Spinner size="sm" />
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isError}
          className={cn(
            'h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm',
            'text-[var(--text)] transition-colors duration-150',
            'focus:outline-none focus:border-[#4F6EF7] focus:ring-1 focus:ring-[#4F6EF7]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <option value="">No channel (skip Slack announcement)</option>
          {channels?.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.is_private ? '🔒' : '#'} {ch.name}
              {ch.num_members > 0 ? ` (${ch.num_members} members)` : ''}
            </option>
          ))}
          {showSavedFallback && (
            <option value={value}>Saved channel ({value})</option>
          )}
        </select>
      )}
      {isError && (
        <p className="text-xs text-[#EF4444]">Could not load Slack channels. Try again later.</p>
      )}
      {!isLoading && !isError && channels?.length === 0 && (
        <p className="text-xs text-[var(--text-faint)]">
          No channels found. Invite the bot to a channel in Slack first.
        </p>
      )}
    </div>
  );
}
