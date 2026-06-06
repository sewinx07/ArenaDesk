'use client';

import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-primary-950/20 via-surface-950 to-cyan-950/20 pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-cyan-600 shadow-lg shadow-primary-600/30">
              <Gamepad2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              ArenaDesk <span className="text-cyan-400">OS</span>
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-surface-400">{subtitle}</p>
          )}
        </div>

        <div className="rounded-xl border border-surface-700/50 bg-surface-900/50 backdrop-blur-sm p-6 shadow-xl shadow-black/20">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-surface-600">
          &copy; {new Date().getFullYear()} ArenaDesk OS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
