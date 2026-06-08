'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthPanel } from '@/components/organisms/AuthPanel';
import { SlackLogo } from '@/components/atoms/SlackLogo';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/lib/utils';

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSlackLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    setIsLoading(true);
    window.location.href = `${base}/auth/slack`;
  };

  const errorMessage =
    error === 'no_code'
      ? 'Slack sign-in was cancelled. Please try again.'
      : error === 'auth_failed'
        ? 'Sign-in failed. Make sure you are in the correct Slack workspace.'
        : null;

  return (
    <AuthPanel>
      <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 sm:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-[360px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold font-syne text-[var(--text)] leading-tight tracking-tight">
              Sign in
            </h1>
            <p className="text-[14px] text-[var(--text-muted)] leading-relaxed">
              Use your Slack workspace account to access STAFFR.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="space-y-5">
            <p className="text-[12px] font-medium text-[var(--text-faint)] uppercase tracking-wider">
              Continue with
            </p>

            <button
              type="button"
              onClick={handleSlackLogin}
              disabled={isLoading}
              className={cn(
                'group flex w-full items-center justify-center gap-3 rounded-2xl',
                'border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5',
                'text-[15px] font-semibold text-[var(--text)]',
                'transition-all duration-200 cursor-pointer',
                'hover:bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:shadow-[var(--shadow-md)]',
                'active:scale-[0.99]',
                'disabled:opacity-60 disabled:cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <Spinner size="sm" className="text-[#4F6EF7]" />
              ) : (
                <SlackLogo size={22} />
              )}
              <span>{isLoading ? 'Redirecting…' : 'Sign in with Slack'}</span>
            </button>

            <p className="text-center text-[12px] text-[var(--text-faint)] leading-relaxed">
              You must be a member of your company&apos;s Slack workspace to sign in.
            </p>
          </div>
        </div>
      </div>
    </AuthPanel>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
          <Spinner size="lg" className="text-[#4F6EF7]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
