'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import type { PC, PCStatus } from '@/types';

interface PCMonitorState {
  pcs: PC[];
  selectedPC: PC | null;
  isLocked: boolean;
  cpuUsage: number;
  sessionTime: number;
}

export function usePCMonitor(cafeId?: string) {
  const { socket, isConnected, subscribe } = useSocket({
    autoConnect: !!cafeId,
  });

  const [state, setState] = useState<PCMonitorState>({
    pcs: [],
    selectedPC: null,
    isLocked: false,
    cpuUsage: 0,
    sessionTime: 0,
  });

  useEffect(() => {
    if (!socket || !cafeId) return;

    socket.emit('join-cafe', cafeId);

    const unsubPCStatus = subscribe('pc:status-update', (data: { pcId: string; status: PCStatus }) => {
      setState((prev) => ({
        ...prev,
        pcs: prev.pcs.map((pc) =>
          pc.id === data.pcId ? { ...pc, status: data.status } : pc
        ),
      }));
    });

    const unsubLock = subscribe('pc:lock', (data: { pcId: string; locked: boolean }) => {
      setState((prev) => ({
        ...prev,
        pcs: prev.pcs.map((pc) =>
          pc.id === data.pcId ? { ...pc, isLocked: data.locked } : pc
        ),
      }));
    });

    const unsubCPU = subscribe('pc:cpu-usage', (data: { pcId: string; usage: number }) => {
      if (state.selectedPC?.id === data.pcId) {
        setState((prev) => ({ ...prev, cpuUsage: data.usage }));
      }
    });

    return () => {
      unsubPCStatus();
      unsubLock();
      unsubCPU();
      socket.emit('leave-cafe', cafeId);

    };
  }, [socket, cafeId]);
  const lockPC = useCallback((pcId: string) => {
    socket?.emit('pc:lock', { pcId });
  }, [socket]);

  const unlockPC = useCallback((pcId: string) => {
    socket?.emit('pc:unlock', { pcId });
  }, [socket]);

  const startSession = useCallback((pcId: string, memberId?: string) => {
    socket?.emit('session:start', { pcId, memberId });
  }, [socket]);

  const endSession = useCallback((pcId: string) => {
    socket?.emit('session:end', { pcId });
  }, [socket]);

  const selectPC = useCallback((pc: PC | null) => {
    setState((prev) => ({ ...prev, selectedPC: pc }));
  }, []);

  return {
    ...state,
    isConnected,
    lockPC,
    unlockPC,
    startSession,
    endSession,
    selectPC,
  };
}
