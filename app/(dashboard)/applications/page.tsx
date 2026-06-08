'use client';
import { useSession } from '@/hooks/useSession';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationReviewContent } from '@/components/templates/ApplicationReviewTemplate';
import { Spinner } from '@/components/atoms/Spinner';
import { Badge } from '@/components/atoms/Badge';
import { Users } from 'lucide-react';

export default function ApplicationsPage() {
  const { isManager } = useSession();
  const { data: applications, isLoading } = useApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-heading">Applications</h1>
        <p className="page-subheading">
          {isManager ? 'Review and manage team applications.' : 'Track your submitted applications.'}
        </p>
      </div>

      {isManager ? (
        <ApplicationReviewContent />
      ) : (
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" className="text-[#4F6EF7]" />
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-2">
              {applications.map((app) => (
                <div key={app.id} className="list-row flex items-center gap-4 px-4 py-3">
                  <Users size={16} className="text-[var(--text-faint)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{app.role?.title}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{app.role?.project?.title}</p>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-12">
              <p className="text-sm text-[var(--text-muted)]">No applications yet.</p>
              <p className="text-xs text-[var(--text-faint)] mt-1">Apply to open roles from the Projects page.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
