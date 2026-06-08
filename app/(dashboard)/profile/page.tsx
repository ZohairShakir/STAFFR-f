'use client';
import { useSession } from '@/hooks/useSession';
import { useApplications } from '@/hooks/useApplications';
import { Avatar } from '@/components/atoms/Avatar';
import { Spinner } from '@/components/atoms/Spinner';
import { Mail, Calendar, Briefcase, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useSession();
  const { data: applications } = useApplications();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-[#4F6EF7]" />
      </div>
    );
  }

  const pendingApps = applications?.filter((a) => a.status === 'PENDING' || a.status === 'REVIEWING').length ?? 0;
  const acceptedApps = applications?.filter((a) => a.status === 'ACCEPTED').length ?? 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-heading">Profile</h1>
        <p className="page-subheading">Your account details and activity.</p>
      </div>

      <div className="surface-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text)]">{user.name}</h2>
            <p className="text-[10px] text-[var(--text-faint)] font-medium uppercase tracking-wider mt-1">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3">
            <Mail size={16} className="text-[var(--text-faint)] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-medium">Email</p>
              <p className="text-sm text-[var(--text)] truncate">{user.email ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3">
            <Calendar size={16} className="text-[var(--text-faint)] shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-medium">Member since</p>
              <p className="text-sm text-[var(--text)]">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3">
            <FileText size={16} className="text-[var(--text-faint)] shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-medium">Active applications</p>
              <p className="text-sm text-[var(--text)]">{pendingApps}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-4 py-3">
            <Briefcase size={16} className="text-[var(--text-faint)] shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-medium">Accepted roles</p>
              <p className="text-sm text-[var(--text)]">{acceptedApps}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
