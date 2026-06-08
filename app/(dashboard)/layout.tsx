'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { NavSidebar } from '@/components/organisms/NavSidebar';
import { Spinner } from '@/components/atoms/Spinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('justLoggedOut') === 'true') {
      sessionStorage.removeItem('justLoggedOut');
      window.location.href = '/login';
      return;
    }
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="dashboard-shell flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-[#4F6EF7]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-shell flex min-h-screen">
      <NavSidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
