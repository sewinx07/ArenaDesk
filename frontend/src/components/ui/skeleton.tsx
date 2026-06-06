import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-700/50 rounded-lg',
        variant === 'text' && 'h-4 w-full',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'h-32 w-full',
        className
      )}
      {...props}
    />
  );
}
Skeleton.displayName = 'Skeleton';

export { Skeleton };
