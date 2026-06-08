'use client';
import { ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';

interface AuthPanelProps {
  children: ReactNode;
}

export function AuthPanel({ children }: AuthPanelProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-[980px] min-h-[min(640px,90vh)] rounded-[28px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] flex flex-col md:flex-row animate-fade-up">
        <div className="relative md:w-[44%] min-h-[220px] md:min-h-0 overflow-hidden bg-[var(--surface-muted)] border-b md:border-b-0 md:border-r border-[var(--border)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(79,110,247,0.08),transparent_55%),radial-gradient(ellipse_at_85%_85%,rgba(139,92,246,0.06),transparent_50%)]" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#4F6EF7]/[0.07] blur-3xl" />
          <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-[#8B5CF6]/[0.06] blur-3xl" />

          <div className="relative flex h-full flex-col p-8 sm:p-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F6EF7] shadow-md shadow-[#4F6EF7]/20">
                <MessageSquare className="text-white" size={16} />
              </div>
              <span className="text-sm font-bold font-syne tracking-wide text-[var(--text)]">STAFFR</span>
            </div>

            <div className="flex flex-1" />

            <div className="space-y-1.5">
              <p className="text-lg font-semibold font-syne text-[var(--text)] leading-snug">
                Hire smarter,<br />move faster.
              </p>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-[240px]">
                Post roles, collect applications, and manage your hiring pipeline — all in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-[var(--surface)]">{children}</div>
      </div>
    </div>
  );
}
