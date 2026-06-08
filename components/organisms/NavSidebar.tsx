'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileBarChart,
  ClipboardList,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';
import { api } from '@/lib/api';
import { Avatar } from '@/components/atoms/Avatar';
import { Moon, Sun } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/applications', label: 'Applications', icon: Users },
  {
    href: '/reports',
    label: 'Reports',
    icon: FileBarChart,
    roles: ['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'] as const,
  },
  {
    href: '/audit-logs',
    label: 'Audit Logs',
    icon: ClipboardList,
    roles: ['ADMIN', 'SUPER_ADMIN'] as const,
  },
  { href: '/admin', label: 'Admin', icon: Settings, roles: ['SUPER_ADMIN'] as const },
];

export function NavSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { theme, toggleTheme } = useTheme();

  const filteredNav = nav.filter(
    (item) => !item.roles || item.roles.some((r) => user?.role === r),
  );

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      /* no-op */
    }
    sessionStorage.setItem('justLoggedOut', 'true');
    queryClient.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar flex flex-col h-screen sticky top-0 z-10">
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[var(--border)]">
          <div className="w-7 h-7 rounded-lg bg-[#4F6EF7] flex items-center justify-center shadow-sm shadow-[#4F6EF7]/20">
            <MessageSquare className="text-white" size={14} />
          </div>
          <span className="text-sm font-bold font-syne text-[var(--text)] tracking-wide flex-1">STAFFR</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-black/[0.04] transition-colors cursor-pointer"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] font-medium',
                'transition-all duration-150 cursor-pointer relative',
                active
                  ? 'bg-[var(--accent-dim)] text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-black/[0.03]',
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[var(--accent)]" />
              )}
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 space-y-1 border-t border-[var(--border)]">
        {user && (
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]',
              'transition-all duration-150 cursor-pointer text-left',
              pathname === '/profile'
                ? 'border-[#4F6EF7]/30 bg-[var(--accent-dim)]'
                : 'hover:border-(--border-2) hover:bg-(--surface-2)',
            )}
          >
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--text)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-faint)] font-medium uppercase tracking-wider">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
