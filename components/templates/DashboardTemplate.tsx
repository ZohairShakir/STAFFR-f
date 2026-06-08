'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { useProjects } from '@/hooks/useProjects';
import { useApplications } from '@/hooks/useApplications';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { api } from '@/lib/api';
import { StatCard } from '@/components/organisms/StatCard';
import { HiringFunnelChart } from '@/components/organisms/HiringFunnelChart';
import { ProjectCard } from '@/components/organisms/ProjectCard';
import { Badge } from '@/components/atoms/Badge';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/lib/utils';
import { Users, FolderOpen, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function countOpenRoles(projects: ReturnType<typeof useProjects>['data']) {
  return (
    projects?.reduce(
      (acc, p) => acc + (p.roles?.filter((r) => r.openings > r.filled).length ?? 0),
      0,
    ) ?? 0
  );
}

function computeFillRate(stats: Awaited<ReturnType<typeof api.reports.hiring>>) {
  const accepted = stats.reduce((a, b) => a + (b.accepted ?? 0), 0);
  const total = stats.reduce(
    (a, b) => a + b.pending + b.reviewing + b.accepted + b.rejected + b.withdrawn,
    0,
  );
  if (total === 0) return null;
  return Math.round((accepted / total) * 100);
}

export function DashboardContent() {
  const { isAdmin, isManager, user } = useSession();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: stats, isLoading: statsLoading } = useDashboardStats(isManager);
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.users.list(),
    enabled: isAdmin,
    staleTime: 60_000,
  });
  const { data: recentApps } = useQuery({
    queryKey: ['applications', { _sort: 'createdAt', _order: 'desc', _limit: 5 }],
    queryFn: () =>
      api.applications.list().then((apps) =>
        [...apps]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5),
      ),
    staleTime: 15_000,
  });

  const openProjects = projects?.filter((p) => p.status === 'OPEN' || p.status === 'IN_PROGRESS') ?? [];
  const openRoles = countOpenRoles(projects);
  const recentActivity = recentApps ?? [];
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const fillRate = stats && stats.length > 0 ? computeFillRate(stats) : null;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold font-syne text-[var(--text)] leading-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-[13px] text-[var(--text-muted)] leading-relaxed">
            Here&apos;s what&apos;s happening across your projects.
          </p>
        </div>
        <span className="hidden sm:block text-[11px] font-medium text-[var(--text-faint)] uppercase tracking-wider">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value={openProjects.length.toString()} icon={FolderOpen} iconColor="text-[#4F6EF7]" iconBg="bg-[#4F6EF7]/10" />
        <StatCard title="Total Applications" value={(applications?.length ?? 0).toString()} icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard title="Pending Review" value={(applications?.filter((a) => a.status === 'PENDING').length ?? 0).toString()} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Open Roles" value={openRoles.toString()} change={openRoles === 1 ? '1 unfilled role' : `${openRoles} unfilled roles`} icon={TrendingUp} iconColor="text-purple-600" iconBg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isManager ? (
            statsLoading ? (
              <div className="surface-card p-10 flex items-center justify-center min-h-[380px]">
                <Spinner size="lg" className="text-[#4F6EF7]" />
              </div>
            ) : stats && stats.length > 0 ? (
              <div className="surface-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-heading">Hiring Funnel</h2>
                  <Link href="/reports" className="link-accent">View reports →</Link>
                </div>
                <HiringFunnelChart data={stats} bare />
              </div>
            ) : (
              <div className="empty-state p-10 text-center min-h-[380px] flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-3 border border-[var(--border)]">
                  <ArrowUpRight size={18} className="text-[var(--text-faint)]" />
                </div>
                <p className="text-sm text-[var(--text-muted)]">No hiring data yet</p>
                <p className="text-xs text-[var(--text-faint)] mt-1">Publish a project to start tracking applications.</p>
              </div>
            )
          ) : (
            <div className="empty-state p-10 text-center min-h-[380px] flex flex-col items-center justify-center">
              <p className="text-sm text-[var(--text-muted)]">Browse open projects and apply to roles that match your skills.</p>
              <Link href="/projects" className="mt-4 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                View projects →
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-heading">Recent Activity</h2>
            <Link href="/applications" className="link-accent">View all</Link>
          </div>
          {appsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="md" className="text-[#4F6EF7]" />
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="surface-card divide-y divide-[var(--border)]">
              {recentActivity.map((app, idx) => (
                <div
                  key={app.id}
                  className={cn(
                    'flex items-center gap-3 p-3.5 transition-colors hover:bg-[var(--surface-2)]',
                    idx === 0 && 'animate-fade-up',
                  )}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs text-[var(--text)] truncate">
                      <span className="font-semibold">{app.user?.name}</span>
                      <span className="text-[var(--text-muted)] ml-1.5">applied to</span>
                      <span className="text-[var(--accent)] font-medium ml-1.5">{app.role?.title}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge status={app.status} />
                      <span className="text-[10px] text-[var(--text-faint)]">
                        {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state p-8 text-center">
              <p className="text-[13px] text-[var(--text-muted)]">No recent activity yet</p>
            </div>
          )}
        </div>
      </div>

      {isManager && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-heading">Your Projects</h2>
            <Link href="/projects" className="link-accent">View all →</Link>
          </div>
          {projectsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" className="text-[#4F6EF7]" />
            </div>
          ) : openProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="empty-state p-8 text-center">
              <p className="text-[13px] text-[var(--text-muted)]">No active projects.</p>
              <Link href="/projects/new" className="inline-block mt-3 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                Create your first project →
              </Link>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading">Admin Overview</h2>
            <Link href="/admin" className="link-accent">Manage users →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">Users</p>
              <p className="text-[28px] font-bold font-syne text-[var(--text)] tracking-tight">{users?.length ?? '—'}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">Open Roles</p>
              <p className="text-[28px] font-bold font-syne text-[var(--text)] tracking-tight">{openRoles}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">Accept Rate</p>
              <p className="text-[28px] font-bold font-syne text-emerald-600 tracking-tight">
                {fillRate !== null ? `${fillRate}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
