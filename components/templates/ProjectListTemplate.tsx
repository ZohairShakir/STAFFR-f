'use client';
import { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/organisms/ProjectCard';
import { SearchFilter } from '@/components/molecules/SearchFilter';
import { StatusSelect } from '@/components/molecules/StatusSelect';
import { Spinner } from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ProjectStatus } from '@/lib/api';

export function ProjectListContent() {
  const { isManager } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const { data: projects, isLoading, isError, refetch } = useProjects({
    ...(status ? { status } : {}),
  });

  const filtered = projects?.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.manager?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="page-heading">Projects</h1>
          <p className="page-subheading">Browse and manage projects.</p>
        </div>
        {isManager && (
          <Button onClick={() => router.push('/projects/new')} icon={Plus} className="cursor-pointer">
            New Project
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SearchFilter value={query} onChange={setQuery} placeholder="Search projects…" />
        <StatusSelect
          value={status}
          onChange={(v) => setStatus(v as ProjectStatus | '')}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'DRAFT', label: 'Draft' },
            { value: 'OPEN', label: 'Open' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-[#4F6EF7]" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-red-600">Failed to load projects</p>
          <Button variant="ghost" onClick={() => refetch()} className="cursor-pointer">Retry</Button>
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => router.push(`/projects/${project.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state text-center py-16">
          <p className="text-sm text-[var(--text-muted)]">No projects found.</p>
        </div>
      )}
    </div>
  );
}
