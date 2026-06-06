'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import PCCard from './PCCard';
import type { PC, PCStatus } from '@/types';

interface PCGridProps {
  pcs: PC[];
  filter?: PCStatus | 'all';
}

export default function PCGrid({ pcs, filter = 'all' }: PCGridProps) {
  const filtered = filter === 'all' ? pcs : pcs.filter((pc) => pc.status === filter);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-800 mb-4">
          <Monitor className="h-8 w-8 text-surface-500" />
        </div>
        <h3 className="text-lg font-medium text-surface-300 mb-1">No PCs found</h3>
        <p className="text-sm text-surface-500">No PCs match the current filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((pc) => (
        <PCCard key={pc.id} pc={pc} />
      ))}
    </div>
  );
}
