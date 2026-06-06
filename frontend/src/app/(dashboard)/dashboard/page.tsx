'use client';

import React from 'react';
import {
  DollarSign,
  Monitor,
  Users,
  Clock,
  Plus,
  CalendarPlus,
  UserPlus,
  TrendingUp,
  Gamepad2,
} from 'lucide-react';
import Link from 'next/link';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import ActiveSessionsWidget from '@/components/dashboard/ActiveSessionsWidget';
import UpcomingReservationsWidget from '@/components/dashboard/UpcomingReservationsWidget';
import PeakHoursChart from '@/components/dashboard/PeakHoursChart';
import RecentTransactionsWidget from '@/components/dashboard/RecentTransactionsWidget';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const stats = [
    { title: "Today's Revenue", value: '$847.50', change: 12.5, changeLabel: 'vs yesterday', icon: DollarSign, iconColor: 'text-cyan-400', iconBg: 'bg-cyan-600/10', borderColor: 'border-l-cyan-500' },
    { title: 'Active PCs', value: '12', change: 8, changeLabel: 'vs yesterday', icon: Monitor, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-600/10', borderColor: 'border-l-emerald-500' },
    { title: 'Total Sessions', value: '156', change: 15, changeLabel: 'vs last week', icon: Users, iconColor: 'text-primary-400', iconBg: 'bg-primary-600/10', borderColor: 'border-l-primary-500' },
    { title: 'Peak Hour', value: '6 PM', change: 5, changeLabel: '95% utilization', icon: Clock, iconColor: 'text-amber-400', iconBg: 'bg-amber-600/10', borderColor: 'border-l-amber-500' },
  ];

  const quickActions = [
    { label: 'Start Session', icon: Monitor, href: '/pcs', color: 'from-cyan-600 to-teal-600', desc: 'Begin new PC session' },
    { label: 'New Reservation', icon: CalendarPlus, href: '/reservations', color: 'from-primary-600 to-purple-600', desc: 'Book a PC or room' },
    { label: 'Register Customer', icon: UserPlus, href: '/members', color: 'from-emerald-600 to-teal-600', desc: 'Add new member' },
    { label: 'Create Tournament', icon: Gamepad2, href: '/tournaments', color: 'from-amber-600 to-red-600', desc: 'Start new event' },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-surface-400 mt-1">
            Welcome back! Here is what is happening at your venue today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="group rounded-xl border border-surface-700/50 bg-surface-900/50 p-4 hover:border-surface-600/50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-black/20">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} mb-3 shadow-lg`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ActiveSessionsWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <UpcomingReservationsWidget />
        </div>
        <div>
          <PeakHoursChart />
        </div>
        <div>
          <RecentTransactionsWidget />
        </div>
      </div>
    </div>
  );
}
