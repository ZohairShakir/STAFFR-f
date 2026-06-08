'use client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/ws';

export function useSocket() {
  const qc = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('application.created', () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    });

    socket.on('application.statusChanged', (data: { id: string }) => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['applications', data?.id] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    });

    socket.on('project.updated', () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    });

    socket.on('audit.created', () => {
      qc.invalidateQueries({ queryKey: ['audit-logs'] });
    });

    socket.on('user.created', (data: { name: string; role: string }) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      console.log(`[WS] New user joined: ${data.name} (${data.role})`);
    });

    socket.on('user.roleUpdated', () => {
      // Refresh session when user's role is updated
      qc.invalidateQueries({ queryKey: ['session'] });
      qc.invalidateQueries({ queryKey: ['users'] });
    });

    return () => {
      socket.off('application.created');
      socket.off('application.statusChanged');
      socket.off('project.updated');
      socket.off('audit.created');
      socket.off('user.created');
      socket.off('user.roleUpdated');
    };
  }, [qc]);
}
