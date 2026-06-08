'use client';
import { type ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/atoms/Button';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoleGateProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGate({ allowedRoles, fallback, children }: RoleGateProps) {
  const { user, isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 rounded-full border-2 border-current border-t-transparent animate-spin text-[#4F6EF7]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <p className="text-sm text-[var(--text-muted)]">You need to sign in to access this page.</p>
          <Button onClick={() => router.push('/login')} icon={LogIn} className="cursor-pointer">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user?.role ?? '')) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <p className="text-sm text-red-600">Access denied</p>
          <p className="text-xs text-[var(--text-muted)]">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
