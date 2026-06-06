'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  borderColor?: string;
}

function AnimatedValue({ value, prefix = '' }: { value: string | number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const target = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : value;
    const start = prevValue.current;
    const duration = 800;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      setDisplayValue(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  const formatted = typeof value === 'string' && value.startsWith('$')
    ? `$${displayValue.toFixed(2)}`
    : value.toString().endsWith('%')
      ? `${displayValue.toFixed(0)}%`
      : `${Math.round(displayValue)}`;

  return <>{formatted}</>;
}

export default function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary-400',
  iconBg = 'bg-primary-600/10',
  borderColor = 'border-l-primary-500',
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-surface-700/50 bg-surface-900/50 backdrop-blur-sm p-6 hover:border-surface-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 border-l-4',
        borderColor
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-600/5 to-cyan-600/5 rounded-bl-full pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-surface-400">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight tabular-nums">
            <AnimatedValue value={value} />
          </p>

          {(change !== undefined || changeLabel) && (
            <div className="flex items-center gap-1.5">
              {change !== undefined && (
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    isPositive ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
              {changeLabel && (
                <span className="text-xs text-surface-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        <div className={cn('rounded-lg p-3', iconBg)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
