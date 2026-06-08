'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/hooks/useSession';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const qc = useQueryClient();

  // Always do a fresh session check when the login page loads — prevents stale
  // React Query cache from falsely reporting isAuthenticated = true
  useEffect(() => {
    qc.invalidateQueries({ queryKey: ['session'] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const justLoggedOut =
      typeof window !== 'undefined' && sessionStorage.getItem('justLoggedOut') === 'true';
    if (!isLoading && isAuthenticated && !justLoggedOut) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show spinner while checking session or during redirect — never return null
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin text-[#4F6EF7]" />
      </div>
    );
  }

  return <>{children}</>;
}
