'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { NavSidebar } from '@/components/organisms/NavSidebar';
import { Spinner } from '@/components/atoms/Spinner';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 h-14 flex items-center px-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-black/[0.04] cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="ml-3 text-sm font-bold font-syne text-[var(--text)] tracking-wide">STAFFR</span>
      </header>

      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <NavSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 sm:px-6 md:px-8 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
