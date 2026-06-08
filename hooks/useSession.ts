'use client';
import { useQuery } from '@tanstack/react-query';
import { api, type User } from '@/lib/api';
import { isAdmin, isManager } from '@/lib/auth';

export function useSession() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['session'],
    queryFn: async () => {
      try { return await api.auth.me(); }
      catch { return null; }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    isAdmin: user ? isAdmin(user.role) : false,
    isManager: user ? isManager(user.role) : false,
    error,
  };
}
