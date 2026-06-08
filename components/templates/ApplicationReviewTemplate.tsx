'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApplications } from '@/hooks/useApplications';
import { api } from '@/lib/api';
import { RoleGate } from '@/components/organisms/RoleGate';
import { StatusSelect } from '@/components/molecules/StatusSelect';
import { SearchFilter } from '@/components/molecules/SearchFilter';
import { Badge } from '@/components/atoms/Badge';
import { Spinner } from '@/components/atoms/Spinner';
import { type ApplicationStatus } from '@/lib/api';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

export function ApplicationReviewContent() {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const { data: applications, isLoading } = useApplications({
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.applications.updateStatus(id, status as ApplicationStatus),
    onSuccess: (_data, { status }) => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Status updated', description: `Application marked as ${status.toLowerCase()}`, variant: 'success' });
    },
    onError: (err: Error) => {
      toast({ title: 'Status update failed', description: err.message, variant: 'error' });
    },
  });

  const filtered = applications?.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.user?.name.toLowerCase().includes(q) ||
      a.role?.title.toLowerCase().includes(q) ||
      a.role?.project?.title.toLowerCase().includes(q)
    );
  });

  return (
    <RoleGate allowedRoles={['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <SearchFilter value={query} onChange={setQuery} placeholder="Search applications…" />
          <StatusSelect
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as ApplicationStatus | '')}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'REVIEWING', label: 'Reviewing' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'WITHDRAWN', label: 'Withdrawn' },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-[#4F6EF7]" />
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="space-y-2.5">
            {filtered.map((app, idx) => (
              <div
                key={app.id}
                className={cn(
                  'list-row flex items-center gap-4 px-5 py-4',
                  updateMutation.variables && (updateMutation.variables as { id?: string }).id === app.id && 'border-[#4F6EF7]/30',
                  idx === 0 && 'animate-fade-up',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] font-semibold text-[var(--text)]">{app.user?.name}</span>
                    <Badge status={app.status} />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                    {app.role?.title} · {app.role?.project?.title}
                  </p>
                </div>
                <StatusSelect
                  value={app.status}
                  onChange={(value) => updateMutation.mutate({ id: app.id, status: value })}
                  options={[
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'REVIEWING', label: 'Reviewing' },
                    { value: 'ACCEPTED', label: 'Accepted' },
                    { value: 'REJECTED', label: 'Rejected' },
                    { value: 'WITHDRAWN', label: 'Withdrawn' },
                  ]}
                  disabled={updateMutation.isPending}
                  className="h-8 w-[130px]"
                />
                <span className="text-[11px] text-[var(--text-faint)] font-mono shrink-0">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state p-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No applications found.</p>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
