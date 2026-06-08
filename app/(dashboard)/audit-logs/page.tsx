'use client';
import { RoleGate } from '@/components/organisms/RoleGate';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Spinner } from '@/components/atoms/Spinner';
import { format } from 'date-fns';

export default function AuditLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.auditLogs.list({ limit: 100 }),
  });

  const logs = data?.data ?? [];

  return (
    <RoleGate allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="page-heading">Audit Logs</h1>
          <p className="page-subheading">Track all system activity.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-[#4F6EF7]" />
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs uppercase bg-[var(--surface-2)]">
                  <th className="py-3 px-4 font-medium">Timestamp</th>
                  <th className="py-3 px-4 font-medium">Actor</th>
                  <th className="py-3 px-4 font-medium">Action</th>
                  <th className="py-3 px-4 font-medium">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--surface-2)]">
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">
                      {format(new Date(log.createdAt), 'MMM d, HH:mm')}
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--text)]">
                      {log.actor?.name ?? log.actorId.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--accent)] font-medium">{log.action}</td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">
                      {log.entity}/{log.entityId.slice(0, 8)}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[var(--text-muted)]">
                      No audit logs
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
