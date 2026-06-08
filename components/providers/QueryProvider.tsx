'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSocket } from '@/hooks/useSocket';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function SocketListener() {
  useSocket();
  return null;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketListener />
      {children}
    </QueryClientProvider>
  );
}
