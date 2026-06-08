type ToastInput = {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'error';
  duration?: number;
};

export function toast(input: ToastInput) {
  if (typeof window === 'undefined') return;
  const handler = (window as unknown as Record<string, (p: ToastInput) => void>).__staffrToast;
  handler?.(input);
}
