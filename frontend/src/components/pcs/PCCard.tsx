'use client';

import React from 'react';
import Link from 'next/link';
import { Monitor, Cpu, HardDrive, MemoryStick, Lock, Unlock, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PCStatusBadge from './PCStatusBadge';
import { cn } from '@/lib/utils';
import type { PC } from '@/types';

interface PCCardProps {
  pc: PC;
  compact?: boolean;
}

export default function PCCard({ pc, compact = false }: PCCardProps) {
  return (
    <Link href={`/pcs/${pc.id}`}>
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-xl hover:shadow-black/20 cursor-pointer hover:-translate-y-0.5',
          pc.status === 'available' && 'border-emerald-600/30 bg-surface-900/50 hover:border-emerald-500/50 hover:shadow-emerald-600/5',
          pc.status === 'in_use' && 'border-amber-600/30 bg-surface-900/50 hover:border-amber-500/50 hover:shadow-amber-600/5',
          pc.status === 'maintenance' && 'border-red-600/30 bg-surface-900/50 hover:border-red-500/50 hover:shadow-red-600/5',
          pc.status === 'offline' && 'border-surface-700/50 bg-surface-900/30 hover:border-surface-600/50',
        )}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  pc.status === 'available' && 'bg-emerald-600/10',
                  pc.status === 'in_use' && 'bg-amber-600/10',
                  pc.status === 'maintenance' && 'bg-red-600/10',
                  pc.status === 'offline' && 'bg-surface-800',
                )}
              >
                <Monitor
                  className={cn(
                    'h-5 w-5',
                    pc.status === 'available' && 'text-emerald-400',
                    pc.status === 'in_use' && 'text-amber-400',
                    pc.status === 'maintenance' && 'text-red-400',
                    pc.status === 'offline' && 'text-surface-500',
                  )}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{pc.name}</h3>
                <p className="text-xs text-surface-500">{pc.identifier}</p>
              </div>
            </div>
            <PCStatusBadge status={pc.status} size="sm" />
          </div>

          {!compact && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-surface-400">
                <Cpu className="h-3.5 w-3.5 text-surface-500" />
                <span>{pc.specs.cpu}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-400">
                <HardDrive className="h-3.5 w-3.5 text-surface-500" />
                <span>{pc.specs.gpu}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-400">
                <MemoryStick className="h-3.5 w-3.5 text-surface-500" />
                <span>{pc.specs.ram} | {pc.specs.storage}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-surface-700/30">
            <div className="text-sm font-medium text-white">
              ${pc.hourlyRate.toFixed(2)}<span className="text-surface-500 text-xs">/hr</span>
            </div>
            <div className="flex gap-1">
              {pc.isLocked ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-surface-400" onClick={(e) => { e.preventDefault(); }}>
                  <Lock className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-surface-400 hover:text-emerald-400" onClick={(e) => { e.preventDefault(); }}>
                  <Unlock className="h-4 w-4" />
                </Button>
              )}
              {pc.status === 'available' && (
                <Button variant="cyan" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); }}>
                  <Play className="h-4 w-4" />
                </Button>
              )}
              {pc.status === 'in_use' && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={(e) => { e.preventDefault(); }}>
                  <Square className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
