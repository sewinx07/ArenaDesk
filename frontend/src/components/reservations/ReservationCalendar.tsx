'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const daysInMonth = 31;
const firstDayOfMonth = 3;
const today = 15;

const reservations: Record<number, { count: number; color: string }> = {
  5: { count: 2, color: 'bg-primary-600/20 text-primary-400 border-primary-600/30' },
  8: { count: 1, color: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30' },
  12: { count: 3, color: 'bg-amber-600/20 text-amber-400 border-amber-600/30' },
  15: { count: 4, color: 'bg-primary-600/20 text-primary-400 border-primary-600/30' },
  18: { count: 2, color: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30' },
  22: { count: 1, color: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30' },
  25: { count: 3, color: 'bg-primary-600/20 text-primary-400 border-primary-600/30' },
  28: { count: 2, color: 'bg-amber-600/20 text-amber-400 border-amber-600/30' },
};

export default function ReservationCalendar() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-xl border border-surface-700/50 bg-surface-900/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold text-white">June 2026</h3>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-surface-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 rounded-lg" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const res = reservations[day];
          const isToday = day === today;

          return (
            <div
              key={day}
              className={cn(
                'h-20 rounded-lg border p-1.5 transition-colors hover:bg-surface-800/50 cursor-pointer',
                isToday
                  ? 'border-primary-600/50 bg-primary-600/10'
                  : 'border-surface-700/30 bg-surface-800/20',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  isToday && 'bg-primary-600 text-white font-bold',
                  !isToday && 'text-surface-400'
                )}
              >
                {day}
              </span>
              {res && (
                <div className={cn('mt-1 rounded border px-1 py-0.5 text-[10px] font-medium', res.color)}>
                  {res.count} booking{res.count > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
