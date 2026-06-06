import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20 neon-glow-primary',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20',
        outline: 'border border-surface-700 bg-transparent text-surface-200 hover:bg-surface-800 hover:text-white hover:border-primary-500/50',
        secondary: 'bg-surface-800 text-surface-200 hover:bg-surface-700',
        ghost: 'text-surface-400 hover:text-white hover:bg-surface-800',
        link: 'text-primary-400 underline-offset-4 hover:underline',
        cyan: 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-600/20 neon-glow-cyan',
        gradient: 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white hover:from-primary-700 hover:to-cyan-700 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-lg px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
      glowing: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glowing: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glowing, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, glowing, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
