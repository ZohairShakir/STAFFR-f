'use client';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { type Project } from '@/lib/api';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';
import { Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  const openRoles = useMemo(
    () => project.roles?.filter((r) => r.openings > r.filled).length ?? 0,
    [project.roles],
  );

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left surface-card surface-card-hover p-5 cursor-pointer',
        'hover:border-[#4F6EF7]/25 hover:shadow-[0_8px_24px_rgba(79,110,247,0.08)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="text-[13px] font-semibold font-syne text-[var(--text)] truncate">
              {project.title}
            </h3>
            <Badge status={project.status} />
          </div>
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
          <div className="mt-3.5 flex items-center gap-3 text-xs text-[var(--text-faint)] flex-wrap">
            {project.manager && (
              <div className="flex items-center gap-1.5">
                <Avatar src={project.manager.avatar} name={project.manager.name} size="xs" />
                <span className="text-[var(--text-muted)] font-medium">{project.manager.name}</span>
              </div>
            )}
            {project.manager && openRoles > 0 && <span className="text-[var(--border-2)]">|</span>}
            {openRoles > 0 && (
              <span className="inline-flex items-center gap-1 text-[#4F6EF7] font-medium">
                <Users size={11} strokeWidth={2.2} />
                {openRoles} open role{openRoles !== 1 ? 's' : ''}
              </span>
            )}
            {project.deadline && (
              <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
                <Calendar size={11} strokeWidth={2} />
                {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
