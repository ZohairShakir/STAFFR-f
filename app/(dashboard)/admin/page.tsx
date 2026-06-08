'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type User, type UserRole } from '@/lib/api';
import { RoleGate } from '@/components/organisms/RoleGate';
import { StatusSelect } from '@/components/molecules/StatusSelect';
import { Spinner } from '@/components/atoms/Spinner';
import { Avatar } from '@/components/atoms/Avatar';
import { toast } from '@/lib/toast';

const ROLE_OPTIONS: UserRole[] = ['TEAM_MEMBER', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'];

export default function AdminPage() {
  const qc = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.users.list(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => api.users.updateRole(id, role),
    onMutate: async ({ id, role }) => {
      await qc.cancelQueries({ queryKey: ['users'] });
      const previous = qc.getQueryData<User[]>(['users']);
      qc.setQueryData<User[]>(['users'], (old) =>
        old?.map((u) => (u.id === id ? { ...u, role } : u)),
      );
      setUpdatingId(id);
      return { previous };
    },
    onSuccess: (_data, { role }) => {
      toast({ title: 'Role updated', description: `User role set to ${role.replace('_', ' ')}`, variant: 'success' });
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: Error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['users'], context.previous);
      }
      toast({ title: 'Role update failed', description: err.message, variant: 'error' });
    },
    onSettled: () => setUpdatingId(null),
  });

  return (
    <RoleGate allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="page-heading">Admin</h1>
          <p className="page-subheading">Manage users and roles.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" className="text-[#4F6EF7]" /></div>
        ) : users && users.length > 0 ? (
          <div className="data-table-wrap">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs uppercase bg-[var(--surface-2)]">
                  <th className="py-3 px-4 font-medium">User</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium w-44">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={u.avatar} name={u.name} size="sm" />
                        <span className="font-medium text-[var(--text)] truncate">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{u.email ?? '—'}</td>
                    <td className="py-3 px-4">
                      <StatusSelect
                        key={`${u.id}-${u.role}`}
                        value={u.role}
                        onChange={(value) => {
                          if (value === u.role) return;
                          updateRoleMutation.mutate({ id: u.id, role: value as UserRole });
                        }}
                        options={ROLE_OPTIONS.map((r) => ({ value: r, label: r.replace('_', ' ') }))}
                        disabled={updatingId === u.id}
                        className="h-8 w-full text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No users found.</p>
        )}
      </div>
    </RoleGate>
  );
}
