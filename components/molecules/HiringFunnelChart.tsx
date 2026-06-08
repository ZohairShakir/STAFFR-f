'use client';
import { cn } from '@/lib/utils';
import { type HiringFunnelReport } from '@/lib/api';

const SEGMENTS = [
  { key: 'pending' as const, label: 'Pending', color: 'bg-[#4F6EF7]', text: 'text-[#4F6EF7]' },
  { key: 'reviewing' as const, label: 'Reviewing', color: 'bg-amber-500', text: 'text-amber-600' },
  { key: 'accepted' as const, label: 'Accepted', color: 'bg-emerald-500', text: 'text-emerald-600' },
  { key: 'rejected' as const, label: 'Rejected', color: 'bg-[#EF4444]', text: 'text-red-600' },
  { key: 'withdrawn' as const, label: 'Withdrawn', color: 'bg-slate-400', text: 'text-(--text-muted)' },
];

function funnelTotal(f: HiringFunnelReport) {
  return f.pending + f.reviewing + f.accepted + f.rejected + f.withdrawn;
}

export function HiringFunnelChart({ data }: { data: HiringFunnelReport[] }) {
  if (!data.length) {
    return <p className="text-xs text-[var(--text-muted)] py-4 text-center">No hiring data yet</p>;
  }

  return (
    <div className="space-y-5">
      {data.map((f) => {
        const total = funnelTotal(f);
        const activeSegments = SEGMENTS
          .map((s) => ({ ...s, value: f[s.key] }))
          .filter((s) => s.value > 0);

        return (
          <div key={f.projectId} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text)] truncate">{f.projectTitle}</p>
              <span className="text-xs font-medium text-[var(--text-faint)] shrink-0">
                {total} application{total !== 1 ? 's' : ''}
              </span>
            </div>

            {total > 0 ? (
              <>
                <div className="flex h-7 w-full overflow-hidden rounded-lg shadow-inner bg-[var(--surface-2)]">
                  {activeSegments.map((seg, idx) => (
                    <div
                      key={seg.key}
                      className={cn(
                        seg.color,
                        'relative min-w-[6px] transition-all',
                        idx === 0 && 'rounded-l-lg',
                        idx === activeSegments.length - 1 && 'rounded-r-lg',
                      )}
                      style={{ width: `${(seg.value / total) * 100}%` }}
                      title={`${seg.label}: ${seg.value}`}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {SEGMENTS.map((seg) => {
                    const value = f[seg.key];
                    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                    return (
                      <div
                        key={seg.key}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-lg border border-(--border) bg-surface px-2.5 py-1',
                          value === 0 && 'opacity-40',
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full shrink-0', seg.color)} />
                        <span className="text-[11px] text-[var(--text-muted)]">{seg.label}</span>
                        <span className={cn('text-[11px] font-semibold tabular-nums', seg.text)}>
                          {value}
                          {total > 0 && value > 0 && (
                            <span className="font-normal text-[var(--text-faint)] ml-0.5">({pct}%)</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-7 rounded-lg bg-[var(--surface-2)] border border-dashed border-[var(--border)] flex items-center justify-center">
                <span className="text-[11px] text-[var(--text-faint)]">No applications yet</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
