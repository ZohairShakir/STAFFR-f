'use client';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Project } from '@/lib/api';
import { ProjectForm } from '@/components/organisms/ProjectForm';
import { RoleGate } from '@/components/organisms/RoleGate';
import { Button } from '@/components/atoms/Button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function NewProjectPage() {
  const qc = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: unknown) => api.projects.create(data),
    onSuccess: (project: Project) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project created', variant: 'success' });
      router.push(`/projects/${project.id}`);
    },
    onError: (err: Error) => {
      toast({ title: 'Could not create project', description: err.message, variant: 'error' });
    },
  });

  const handleSubmit = async (data: unknown) => {
    await mutation.mutateAsync(data);
  };

  return (
    <RoleGate allowedRoles={['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            icon={ArrowLeft}
            className="cursor-pointer"
          />
          <div>
            <h1 className="page-heading">New Project</h1>
            <p className="page-subheading">Create a new project and add roles.</p>
          </div>
        </div>

        <div className="surface-card p-6">
          <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
        </div>
      </div>
    </RoleGate>
  );
}
