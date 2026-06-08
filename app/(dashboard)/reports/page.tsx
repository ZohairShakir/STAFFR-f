'use client';
import { RoleGate } from '@/components/organisms/RoleGate';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Spinner } from '@/components/atoms/Spinner';
import { HiringFunnelChart } from '@/components/molecules/HiringFunnelChart';

export default function ReportsPage() {
  const { data: hiring, isLoading: hiringLoading } = useQuery({
    queryKey: ['reports', 'hiring'],
    queryFn: () => api.reports.hiring(),
  });
  const { data: fillRate, isLoading: fillLoading } = useQuery({
    queryKey: ['reports', 'fill-rate'],
    queryFn: () => api.reports.fillRate(),
  });
  const { data: timeToHire, isLoading: timeLoading } = useQuery({
    queryKey: ['reports', 'time-to-hire'],
    queryFn: () => api.reports.timeToHire(),
  });

  return (
    <RoleGate allowedRoles={['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="page-heading">Reports</h1>
          <p className="page-subheading">Hiring metrics and analytics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="surface-card p-5 space-y-4">
            <h3 className="section-heading">Hiring Funnel</h3>
            {hiringLoading ? (
              <div className="flex justify-center py-8"><Spinner className="text-[#4F6EF7]" /></div>
            ) : (
              <HiringFunnelChart data={hiring ?? []} />
            )}
          </div>

          <div className="surface-card p-5 space-y-3">
            <h3 className="section-heading">Time to Hire</h3>
            {timeLoading ? (
              <div className="flex justify-center py-8"><Spinner className="text-[#4F6EF7]" /></div>
            ) : (
              <div className="space-y-2">
                {timeToHire?.map((r) => (
                  <div key={r.projectId} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--text-muted)]">{r.projectTitle}</span>
                    <span className="text-sm font-mono text-[var(--text)]">
                      {r.avgDaysToHire > 0 ? `${r.avgDaysToHire}d` : '—'}
                    </span>
                  </div>
                ))}
                {(!timeToHire || timeToHire.length === 0) && (
                  <p className="text-xs text-[var(--text-muted)]">No data</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="surface-card p-5 space-y-3">
          <h3 className="section-heading">Fill Rate</h3>
          {fillLoading ? (
            <div className="flex justify-center py-8"><Spinner className="text-[#4F6EF7]" /></div>
          ) : (
            <div className="space-y-2">
              {fillRate?.map((r) => (
                <div key={r.roleId} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                  <div>
                    <span className="text-sm text-[var(--text)]">{r.roleTitle}</span>
                    <span className="text-xs text-[var(--text-faint)] ml-2">{r.projectTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">{r.filled}/{r.openings}</span>
                    <span className="text-xs font-mono text-emerald-600 font-medium">
                      {Math.round(r.fillRate)}%
                    </span>
                  </div>
                </div>
              ))}
              {(!fillRate || fillRate.length === 0) && (
                <p className="text-xs text-[var(--text-muted)]">No data</p>
              )}
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
