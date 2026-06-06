'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Monitor,
  CalendarCheck,
  Users,
  Swords,
  ShoppingCart,
  BarChart3,
  Users2,
  Building2,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  ChevronDown,
  CreditCard,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'PCs', href: '/pcs', icon: Monitor },
      { name: 'Sessions', href: '/pcs', icon: Monitor },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Reservations', href: '/reservations', icon: CalendarCheck },
      { name: 'Members', href: '/members', icon: Users },
      { name: 'Tournaments', href: '/tournaments', icon: Swords },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'POS', href: '/pos', icon: ShoppingCart },
      { name: 'Billing', href: '/billing', icon: CreditCard },
      { name: 'Reports', href: '/reports', icon: FileText },
    ],
  },
  {
    label: 'Settings',
    items: [
      { name: 'Staff', href: '/staff', icon: Users2 },
      { name: 'Cafes', href: '/branches', icon: Building2 },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-surface-700/50 bg-surface-950 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-surface-700/50', collapsed ? 'justify-center px-2' : 'justify-between px-4')}>
        <Link href="/dashboard" className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-cyan-600 shadow-lg shadow-primary-600/20">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white">
              ArenaDesk <span className="text-cyan-400">OS</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-surface-500 mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative',
                      active
                        ? 'text-primary-400 bg-primary-600/10 border-l-2 border-primary-500 shadow-sm shadow-primary-600/5'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800/50',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    {active && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-full shadow-sm shadow-primary-500/50" />
                    )}
                    <item.icon className={cn('h-5 w-5 shrink-0', active && 'text-primary-400')} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-surface-700/50 p-3 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-surface-800/30">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-cyan-600 text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-surface-500 truncate">Owner</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!collapsed && <span className="ml-3 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
