'use client';
import { useQuery } from '@tanstack/react-query';
import { api, type HiringFunnelReport } from '@/lib/api';

export function useDashboardStats(enabled = true) {
  return useQuery<HiringFunnelReport[]>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.reports.hiring(),
    staleTime: 30_000,
    enabled,
  });
}
