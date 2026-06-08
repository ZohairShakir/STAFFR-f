'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { useApplications } from '@/hooks/useApplications';
import { RoleGate } from '@/components/organisms/RoleGate';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { ArrowLeft } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { SlackChannelSelect } from '@/components/molecules/SlackChannelSelect';

interface FormData {
  title: string;
  description: string;
  deadline: string;
  slackChannelId: string;
  status?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const qc = useQueryClient();
  const router = useRouter();
  const { user, isManager } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [applyingRoleId, setApplyingRoleId] = useState<string | null>(null);
  const [applyNote, setApplyNote] = useState('');

  const { data: project, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => api.projects.get(id),
    enabled: !!id,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.projects.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      router.push('/projects');
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => api.projects.publish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', id] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project published', variant: 'success' });
    },
    onError: (err: Error) => {
      toast({ title: 'Could not publish project', description: err.message, variant: 'error' });
    },
  });

  const { data: myApplications } = useApplications({ projectId: id });

  const appliedByRoleId = new Map(
    (myApplications ?? []).map((app) => [app.roleId, app]),
  );

  const applyMutation = useMutation({
    mutationFn: ({ roleId, note }: { roleId: string; note?: string }) =>
      api.applications.create({ roleId, note, source: 'WEB' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['applications', { projectId: id }] });
      setApplyingRoleId(null);
      setApplyNote('');
      toast({ title: 'Application submitted', variant: 'success' });
    },
    onError: (err: Error) => {
      toast({ title: 'Could not apply', description: err.message, variant: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.projects.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', id] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const { register, handleSubmit, reset, control, formState: { isSubmitting } } = useForm<FormData>({
    values: project
      ? {
          title: project.title,
          description: project.description,
          deadline: project.deadline ? project.deadline.slice(0, 10) : '',
          slackChannelId: project.slackChannelId ?? '',
          status: project.status,
        }
      : undefined,
  });

  const onEditSubmit = handleSubmit(async (data) => {
    const payload: Record<string, unknown> = {
      title: data.title,
      description: data.description,
    };
    if (data.deadline) payload.deadline = new Date(data.deadline).toISOString();
    else payload.deadline = null;
    if (data.slackChannelId) payload.slackChannelId = data.slackChannelId;
    if (data.status) payload.status = data.status;

    await updateMutation.mutateAsync(payload);
    setIsEditing(false);
    await refetch();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-sm text-[#EF4444]">
          {isError ? (error instanceof Error ? error.message : 'Failed to load project') : 'Project not found'}
        </p>
        <div className="flex items-center justify-center gap-2">
          {isError && (
            <Button variant="ghost" onClick={() => refetch()} className="cursor-pointer">
              Retry
            </Button>
          )}
          <Button variant="ghost" onClick={() => router.push('/projects')} className="cursor-pointer">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => { setIsEditing(false); reset(); }} icon={ArrowLeft} className="cursor-pointer" />
          <h1 className="page-heading">Edit Project</h1>
        </div>
        <form onSubmit={onEditSubmit} className="space-y-5 surface-card p-6">
          <div>
            <label className="form-label">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="form-field"
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="form-field form-textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Deadline</label>
              <input type="date" {...register('deadline')} className="form-field" />
            </div>
            <div>
              <Controller
                name="slackChannelId"
                control={control}
                render={({ field }) => (
                  <SlackChannelSelect
                    value={field.value ?? ''}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select {...register('status')} className="form-field">
              <option value="DRAFT">Draft</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); reset(); }} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting || updateMutation.isPending} className="cursor-pointer">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <RoleGate allowedRoles={['TEAM_MEMBER', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/projects')} icon={ArrowLeft} className="cursor-pointer" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="page-heading">{project.title}</h1>
                <Badge status={project.status} />
              </div>
              <p className="page-subheading">
                Manager: {project.manager?.name ?? 'Unassigned'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {project.status === 'DRAFT' && isManager && (
              <Button variant="ghost" onClick={() => publishMutation.mutate()} loading={publishMutation.isPending} className="cursor-pointer">
                Publish
              </Button>
            )}
            {isManager && (
              <>
                <Button variant="ghost" onClick={() => { setIsEditing(true); }} className="cursor-pointer">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteMutation.mutate()} loading={deleteMutation.isPending} className="cursor-pointer">
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="surface-card p-6 space-y-4">
          <div>
            <h2 className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider mb-2">Description</h2>
            <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">{project.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {project.deadline && (
              <div>
                <p className="text-xs text-[var(--text-faint)]">Deadline</p>
                <p className="text-sm text-[var(--text)]">{new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            )}
            {project.slackChannelId && (
              <div>
                <p className="text-xs text-[var(--text-faint)]">Slack Channel</p>
                <p className="text-sm text-[var(--text)] font-mono">{project.slackChannelId}</p>
              </div>
            )}
          </div>
        </div>

        {project.roles && project.roles.length > 0 && (
          <div className="space-y-3">
            <h2 className="section-heading">Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.roles.map((role) => {
                const existingApp = appliedByRoleId.get(role.id);
                const hasOpenings = role.filled < role.openings;
                const canApply =
                  project.status === 'OPEN' &&
                  hasOpenings &&
                  !existingApp &&
                  user?.id !== project.managerId;

                return (
                  <div key={role.id} className="surface-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-[var(--text)]">{role.title}</h3>
                      <span className="text-xs text-[var(--text-muted)]">
                        {role.filled}/{role.openings} filled
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {role.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-medium border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2.5 text-xs text-[var(--text-faint)]">{role.experience}</p>

                    {existingApp && (
                      <div className="mt-3 flex items-center gap-2">
                        <Badge status={existingApp.status} />
                        <span className="text-xs text-[var(--text-faint)]">You applied for this role</span>
                      </div>
                    )}

                    {canApply && applyingRoleId !== role.id && (
                      <Button
                        size="sm"
                        className="mt-3 cursor-pointer"
                        onClick={() => {
                          setApplyingRoleId(role.id);
                          setApplyNote('');
                        }}
                      >
                        Apply
                      </Button>
                    )}

                    {applyingRoleId === role.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={applyNote}
                          onChange={(e) => setApplyNote(e.target.value)}
                          placeholder="Optional note for the manager"
                          rows={2}
                          className="form-field form-textarea text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            loading={applyMutation.isPending}
                            className="cursor-pointer"
                            onClick={() => applyMutation.mutate({
                              roleId: role.id,
                              note: applyNote.trim() || undefined,
                            })}
                          >
                            Submit Application
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => {
                              setApplyingRoleId(null);
                              setApplyNote('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!existingApp && project.status !== 'OPEN' && (
                      <p className="mt-3 text-xs text-[var(--text-faint)]">Applications open when the project is published.</p>
                    )}

                    {!existingApp && project.status === 'OPEN' && !hasOpenings && (
                      <p className="mt-3 text-xs text-[var(--text-faint)]">All openings filled.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
