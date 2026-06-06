'use client';

import React from 'react';
import { Monitor, Clock, DollarSign, User, Cpu, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PC, Session } from '@/types';

interface PCMonitorProps {
  pc: PC;
  session?: Session;
  compact?: boolean;
}

export default function PCMonitor({ pc, session, compact = false }: PCMonitorProps) {
  const isInUse = pc.status === 'in_use';

  if (compact) {
    return (
      <div className={cn(
        'flex items-center justify-between rounded-lg border p-3 transition-all',
        isInUse ? 'border-amber-600/30 bg-amber-600/5' : 'border-surface-700/30 bg-surface-900/30'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            isInUse ? 'bg-amber-600/10' : 'bg-surface-800'
          )}>
            <Monitor className={cn('h-4 w-4', isInUse ? 'text-amber-400' : 'text-surface-400')} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{pc.name}</p>
            <p className="text-xs text-surface-500">{pc.specs.cpu} | {pc.specs.ram}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInUse && session && (
            <>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Clock className="h-3 w-3" />
                <span>{Math.floor(session.duration / 60)}h {session.duration % 60}m</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <DollarSign className="h-3 w-3" />
                <span>${session.cost.toFixed(2)}</span>
              </div>
              <div className="h-6 w-6 rounded-full bg-surface-800 flex items-center justify-center">
                <User className="h-3 w-3 text-surface-400" />
              </div>
            </>
          )}
          <Badge variant={isInUse ? 'warning' : 'success'} size="sm">
            {isInUse ? 'IN USE' : 'FREE'}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            isInUse ? 'bg-amber-600/10' : 'bg-emerald-600/10'
          )}>
            <Monitor className={cn('h-6 w-6', isInUse ? 'text-amber-400' : 'text-emerald-400')} />
          </div>
          <div>
            <CardTitle>{pc.name}</CardTitle>
            <p className="text-sm text-surface-500">{pc.identifier}</p>
          </div>
        </div>
        <Badge variant={isInUse ? 'warning' : 'success'} size="lg">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          {isInUse ? 'In Use' : 'Available'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg bg-surface-800/30 p-3 border border-surface-700/20">
            <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
              <Cpu className="h-3.5 w-3.5" />
              Processor
            </div>
            <p className="text-sm font-medium text-white">{pc.specs.cpu}</p>
          </div>
          <div className="rounded-lg bg-surface-800/30 p-3 border border-surface-700/20">
            <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
              <Monitor className="h-3.5 w-3.5" />
              Graphics
            </div>
            <p className="text-sm font-medium text-white">{pc.specs.gpu}</p>
          </div>
          <div className="rounded-lg bg-surface-800/30 p-3 border border-surface-700/20">
            <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
              <Monitor className="h-3.5 w-3.5" />
              Memory
            </div>
            <p className="text-sm font-medium text-white">{pc.specs.ram}</p>
          </div>
          <div className="rounded-lg bg-surface-800/30 p-3 border border-surface-700/20">
            <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
              <HardDrive className="h-3.5 w-3.5" />
              Storage
            </div>
            <p className="text-sm font-medium text-white">{pc.specs.storage}</p>
          </div>
        </div>

        {isInUse && session && (
          <div className="rounded-lg bg-surface-800/30 p-4 border border-amber-600/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <User className="h-4 w-4" />
                <span className="font-medium">Current Session</span>
              </div>
              <Badge variant="warning">Live</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-surface-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Started: {new Date(session.startTime).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-1 text-surface-400">
                <DollarSign className="h-3.5 w-3.5" />
                <span>${session.cost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
