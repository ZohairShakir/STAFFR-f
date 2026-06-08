'use client';
import { cn } from '@/lib/utils';
import { type HiringFunnelReport } from '@/lib/api';

const STATUSES = [
  { key: 'pending' as const,   label: 'Pending',   color: '#4F6EF7', bg: 'bg-[#4F6EF7]',   muted: 'bg-[#4F6EF7]/10',   text: 'text-[#4F6EF7]'   },
  { key: 'reviewing' as const, label: 'Reviewing', color: '#F59E0B', bg: 'bg-amber-400',    muted: 'bg-amber-400/10',   text: 'text-amber-500'   },
  { key: 'accepted' as const,  label: 'Accepted',  color: '#22C55E', bg: 'bg-emerald-500',  muted: 'bg-emerald-500/10', text: 'text-emerald-600' },
  { key: 'rejected' as const,  label: 'Rejected',  color: '#EF4444', bg: 'bg-red-500',      muted: 'bg-red-500/10',     text: 'text-red-500'     },
  { key: 'withdrawn' as const, label: 'Withdrawn', color: '#94A3B8', bg: 'bg-slate-400',    muted: 'bg-slate-400/10',   text: 'text-slate-500'   },
] as const;

const BAR_H = 160;

export function HiringFunnelChart({ data }: { data: HiringFunnelReport[] }) {
  if (!data.length) {
    return <p className="text-xs text-[var(--text-muted)] py-6 text-center">No hiring data yet</p>;
  }

  const globalMax = Math.max(
    1,
    ...data.flatMap((f) => STATUSES.map((s) => f[s.key])),
  );

  return (
    <div className="space-y-6">
      {data.map((f) => {
        const total = STATUSES.reduce((sum, s) => sum + f[s.key], 0);

        return (
          <div
            key={f.projectId}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/40 px-5 pt-5 pb-4 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text)] truncate">{f.projectTitle}</p>
              <span className="text-xs font-medium text-[var(--text-faint)] shrink-0">
                {total} application{total !== 1 ? 's' : ''}
              </span>
            </div>

            {total > 0 ? (
              <>
                <div className="flex items-end gap-3" style={{ height: BAR_H + 28 }}>
                  {STATUSES.map((s) => {
                    const val = f[s.key];
                    const heightPx = val > 0 ? Math.max(10, Math.round((val / globalMax) * BAR_H)) : 0;
                    const pct = total > 0 ? Math.round((val / total) * 100) : 0;

                    return (
                      <div
                        key={s.key}
                        className="flex-1 flex flex-col items-center justify-end gap-1.5"
                        style={{ height: BAR_H + 28 }}
                      >
                        {val > 0 && (
                          <span className={cn('text-[11px] font-semibold tabular-nums leading-none', s.text)}>
                            {val}
                          </span>
                        )}
                        <div
                          className={cn('w-full rounded-t-xl transition-all duration-500 relative group cursor-default', val > 0 ? s.bg : 'bg-[var(--border)]')}
                          style={{ height: val > 0 ? heightPx : 4, opacity: val === 0 ? 0.35 : 1 }}
                        >
                          {val > 0 && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 hidden group-hover:flex flex-col items-center pointer-events-none">
                              <div className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg whitespace-nowrap"
                                style={{ background: s.color }}>
                                {val} ({pct}%)
                              </div>
                              <div className="w-2 h-1.5 -mt-px" style={{
                                borderLeft: '5px solid transparent',
                                borderRight: '5px solid transparent',
                                borderTop: `5px solid ${s.color}`,
                              }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-1 border-t border-[var(--border)]">
                  {STATUSES.map((s) => (
                    <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                      <div className={cn('h-1.5 w-full rounded-full', f[s.key] > 0 ? s.bg : 'bg-[var(--border)]')} style={{ opacity: f[s.key] === 0 ? 0.3 : 1 }} />
                      <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                className="rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center"
                style={{ height: BAR_H + 28 }}
              >
                <span className="text-[11px] text-[var(--text-faint)]">No applications yet</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
