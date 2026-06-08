'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    const justLoggedOut = typeof window !== 'undefined' && sessionStorage.getItem('justLoggedOut') === 'true';
    if (!isLoading && isAuthenticated && !justLoggedOut) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin text-[#4F6EF7]" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
