'use client';
import { useQuery } from '@tanstack/react-query';
import { api, type Application } from '@/lib/api';

export function useApplications(params?: { status?: string; projectId?: string; roleId?: string }) {
  return useQuery<Application[]>({
    queryKey: ['applications', params],
    queryFn: () => api.applications.list(params),
    staleTime: 15_000,
  });
}

export function useApplication(id: string) {
  return useQuery<Application>({
    queryKey: ['applications', id],
    queryFn: () => api.applications.get(id),
    staleTime: 15_000,
    enabled: !!id,
  });
}
