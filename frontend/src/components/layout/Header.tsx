'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Building2,
  Menu,
  Monitor,
  CalendarPlus,
  TrendingUp,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCafeSelector, setShowCafeSelector] = useState(false);

  const notifications = [
    { id: '1', title: 'PC #12 session ending soon', message: 'Session will end in 5 minutes', type: 'warning' as const, time: '5 min ago' },
    { id: '2', title: 'New reservation for VIP Room', message: 'VIP Room booked for 4 hours', type: 'info' as const, time: '15 min ago' },
    { id: '3', title: 'Payment received: $45.00', message: 'Payment from John Doe', type: 'success' as const, time: '1 hour ago' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-700/50 bg-surface-950/80 backdrop-blur-xl px-4 lg:px-6">
      <button
        onClick={onMenuToggle}
        className="lg:hidden rounded-lg p-2 text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          type="text"
          placeholder="Search PCs, members, reservations..."
          className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-surface-600 bg-surface-800 px-1.5 text-[10px] font-medium text-surface-400">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9" title="Quick Session">
          <Monitor className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9" title="New Reservation">
          <CalendarPlus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9" title="Reports">
          <TrendingUp className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-surface-700/50 mx-1 hidden sm:block" />

        <div className="relative">
          <button
            onClick={() => setShowCafeSelector(!showCafeSelector)}
            className="flex items-center gap-2 rounded-lg border border-surface-700/50 bg-surface-800/50 px-3 py-1.5 text-sm text-surface-200 hover:bg-surface-800 hover:border-surface-600/50 transition-all"
          >
            <Building2 className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Main Cafe</span>
            <ChevronDown className="h-3 w-3 text-surface-500" />
          </button>
          {showCafeSelector && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-surface-700 bg-surface-900 p-1 shadow-xl shadow-black/30 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-3 py-2 text-xs text-surface-400 font-medium uppercase tracking-wider">Select Cafe</div>
              <button className="w-full rounded-md px-3 py-2 text-left text-sm text-white bg-surface-800 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Main Cafe
              </button>
              <button className="w-full rounded-md px-3 py-2 text-left text-sm text-surface-300 hover:bg-surface-800 hover:text-white flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-surface-500" />
                Downtown Arena
              </button>
              <button className="w-full rounded-md px-3 py-2 text-left text-sm text-surface-300 hover:bg-surface-800 hover:text-white flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-surface-500" />
                Mall Gaming Zone
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm shadow-red-600/50">
              3
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-surface-700 bg-surface-900 shadow-xl shadow-black/30 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50">
                <span className="text-sm font-medium text-white">Notifications</span>
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className="w-full px-4 py-3 text-left hover:bg-surface-800/50 transition-colors border-b border-surface-700/30 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'mt-1 h-2 w-2 rounded-full shrink-0',
                        n.type === 'warning' && 'bg-amber-400 shadow-sm shadow-amber-400/30',
                        n.type === 'info' && 'bg-cyan-400 shadow-sm shadow-cyan-400/30',
                        n.type === 'success' && 'bg-emerald-400 shadow-sm shadow-emerald-400/30',
                      )} />
                      <div className="flex-1">
                        <p className="text-sm text-surface-200">{n.title}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{n.message}</p>
                        <p className="text-xs text-surface-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-surface-700/50">
                <button className="w-full text-center text-xs text-surface-400 hover:text-white transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-800 transition-all"
          >
            <Avatar
              size="sm"
              alt={session?.user?.name || 'User'}
              fallback={session?.user?.name?.charAt(0) || 'U'}
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-tight">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-surface-500 capitalize">{session?.user?.role || 'Owner'}</p>
            </div>
            <ChevronDown className="hidden sm:block h-3 w-3 text-surface-500" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-surface-700 bg-surface-900 p-1 shadow-xl shadow-black/30 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="flex items-center gap-3 px-3 py-3 border-b border-surface-700/50">
                <Avatar size="sm" alt={session?.user?.name || 'User'} fallback={session?.user?.name?.charAt(0) || 'U'} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'Admin'}</p>
                  <p className="text-xs text-surface-500 truncate">{session?.user?.email || 'admin@ArenaDesk.com'}</p>
                </div>
              </div>
              <div className="py-1">
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-surface-200 hover:bg-surface-800">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-surface-200 hover:bg-surface-800">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-surface-700/50 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
