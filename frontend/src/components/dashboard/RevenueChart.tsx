'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const data7 = [
  { date: 'Mon', revenue: 1200, sessions: 800 },
  { date: 'Tue', revenue: 1800, sessions: 1100 },
  { date: 'Wed', revenue: 1400, sessions: 900 },
  { date: 'Thu', revenue: 2200, sessions: 1300 },
  { date: 'Fri', revenue: 2800, sessions: 1500 },
  { date: 'Sat', revenue: 2400, sessions: 1200 },
  { date: 'Sun', revenue: 1900, sessions: 1000 },
];

const data30 = [
  { date: 'May 7', revenue: 1200, sessions: 800 },
  { date: 'May 10', revenue: 2200, sessions: 1300 },
  { date: 'May 13', revenue: 2400, sessions: 1200 },
  { date: 'May 16', revenue: 3100, sessions: 1600 },
  { date: 'May 19', revenue: 2000, sessions: 1100 },
  { date: 'May 22', revenue: 2800, sessions: 1400 },
  { date: 'May 25', revenue: 3500, sessions: 1700 },
  { date: 'May 28', revenue: 2600, sessions: 1300 },
  { date: 'May 31', revenue: 2900, sessions: 1500 },
  { date: 'Jun 3', revenue: 3200, sessions: 1600 },
  { date: 'Jun 6', revenue: 2100, sessions: 1100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-surface-700 bg-surface-900 p-3 shadow-xl shadow-black/30">
        <p className="text-sm font-medium text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-surface-400">{entry.name}:</span>
            <span className="text-white font-medium">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const data = period === '7d' ? data7 : data30;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <p className="text-sm text-surface-400 mt-1">Track your venue revenue over time</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-surface-800/50 p-0.5 border border-surface-700/50">
          <button
            onClick={() => setPeriod('7d')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-md transition-all',
              period === '7d' ? 'bg-primary-600 text-white shadow-sm' : 'text-surface-400 hover:text-white'
            )}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-md transition-all',
              period === '30d' ? 'bg-primary-600 text-white shadow-sm' : 'text-surface-400 hover:text-white'
            )}
          >
            30 Days
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                name="Revenue"
                dot={false}
                activeDot={{ r: 5, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#sessionsGrad)"
                name="Sessions"
                dot={false}
                activeDot={{ r: 5, fill: '#06B6D4', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
