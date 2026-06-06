import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950',
  {
    variants: {
      variant: {
        default: 'bg-surface-800 text-surface-200 border border-surface-700',
        primary: 'bg-primary-600/20 text-primary-400 border border-primary-600/30',
        secondary: 'bg-surface-700 text-surface-300',
        success: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 shadow-sm shadow-emerald-600/10',
        warning: 'bg-amber-600/20 text-amber-400 border border-amber-600/30 shadow-sm shadow-amber-600/10',
        danger: 'bg-red-600/20 text-red-400 border border-red-600/30 shadow-sm shadow-red-600/10',
        info: 'bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 shadow-sm shadow-cyan-600/10',
        purple: 'bg-purple-600/20 text-purple-400 border border-purple-600/30 shadow-sm shadow-purple-600/10',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
