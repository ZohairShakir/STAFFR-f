'use client';
import { useQuery } from '@tanstack/react-query';
import { api, type Project } from '@/lib/api';

export function useProjects(params?: { status?: string; skill?: string; managerId?: string }) {
  return useQuery<Project[]>({
    queryKey: ['projects', params],
    queryFn: () => api.projects.list(params),
    staleTime: 30_000,
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => api.projects.get(id),
    staleTime: 30_000,
    enabled: !!id,
  });
}
