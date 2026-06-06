'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { cn } from '@/lib/utils';

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1e293b',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          color: '#f1f5f9',
          borderRadius: '12px',
          padding: '16px',
        },
        className: cn('text-sm font-medium shadow-xl shadow-black/20'),
      }}
      icons={{
        success: (
          <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ),
        error: (
          <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ),
        warning: (
          <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
          </div>
        ),
        info: (
          <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ),
      }}
    />
  );
}

export { Toaster };
export { toast } from 'sonner';
