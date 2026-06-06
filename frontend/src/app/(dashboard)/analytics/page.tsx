'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Monitor,
  Download,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Activity,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

const revenueForecast = [
  { month: 'Jun', actual: 28500, forecast: 28500 },
  { month: 'Jul', actual: 32000, forecast: 32000 },
  { month: 'Aug', actual: 29800, forecast: 29800 },
  { month: 'Sep', actual: 35000, forecast: 35000 },
  { month: 'Oct', actual: 38000, forecast: 38000 },
  { month: 'Nov', actual: null, forecast: 42000 },
  { month: 'Dec', actual: null, forecast: 48000 },
  { month: 'Jan', actual: null, forecast: 45000 },
];

const peakHoursData = [
  { hour: '8AM', mon: 20, tue: 25, wed: 22, thu: 28, fri: 35, sat: 45, sun: 40 },
  { hour: '10AM', mon: 30, tue: 35, wed: 32, thu: 38, fri: 45, sat: 55, sun: 50 },
  { hour: '12PM', mon: 45, tue: 50, wed: 48, thu: 52, fri: 60, sat: 75, sun: 65 },
  { hour: '2PM', mon: 55, tue: 60, wed: 58, thu: 62, fri: 70, sat: 85, sun: 75 },
  { hour: '4PM', mon: 65, tue: 70, wed: 68, thu: 72, fri: 80, sat: 90, sun: 80 },
  { hour: '6PM', mon: 75, tue: 80, wed: 78, thu: 82, fri: 90, sat: 95, sun: 85 },
  { hour: '8PM', mon: 70, tue: 75, wed: 72, thu: 78, fri: 85, sat: 90, sun: 78 },
  { hour: '10PM', mon: 50, tue: 55, wed: 52, thu: 58, fri: 65, sat: 75, sun: 60 },
];

const retentionData = [
  { month: 'Jan', new: 45, returning: 120, churned: 12 },
  { month: 'Feb', new: 52, returning: 135, churned: 15 },
  { month: 'Mar', new: 48, returning: 140, churned: 18 },
  { month: 'Apr', new: 55, returning: 150, churned: 14 },
  { month: 'May', new: 60, returning: 165, churned: 16 },
  { month: 'Jun', new: 58, returning: 175, churned: 13 },
];

const utilizationData = [
  { name: 'PC #01-05', utilization: 85 },
  { name: 'PC #06-10', utilization: 72 },
  { name: 'PC #11-15', utilization: 90 },
  { name: 'PC #16-20', utilization: 65 },
  { name: 'VIP Rooms', utilization: 55 },
  { name: 'Consoles', utilization: 78 },
];

const revenueByCategory = [
  { name: 'Sessions', value: 65, color: '#8B5CF6' },
  { name: 'POS', value: 18, color: '#06B6D4' },
  { name: 'Memberships', value: 10, color: '#10B981' },
  { name: 'Reservations', value: 7, color: '#F59E0B' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-surface-700 bg-surface-900 p-3 shadow-xl shadow-black/30">
        <p className="text-xs text-surface-400 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-surface-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {entry.name.includes('$') || entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30');

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-surface-400 mt-1">
            AI-powered insights to grow your gaming venue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last year' },
            ]}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
              <TrendingUp className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Projected Revenue</p>
              <p className="text-xl font-bold text-white">$48,000</p>
              <p className="text-xs text-emerald-400">+12.5% next month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600/10">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Peak Utilization</p>
              <p className="text-xl font-bold text-white">95%</p>
              <p className="text-xs text-cyan-400">Fri 6-8 PM</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/10">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Retention Rate</p>
              <p className="text-xl font-bold text-white">85.3%</p>
              <p className="text-xs text-emerald-400">+2.1% this month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600/10">
              <Target className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Avg. Session Value</p>
              <p className="text-xl font-bold text-white">$8.45</p>
              <p className="text-xs text-amber-400">+$0.30 vs last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueForecast}>
                  <defs>
                    <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="forecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span className="text-surface-400 text-sm">{value}</span>} />
                  <Area type="monotone" dataKey="actual" stroke="#8B5CF6" strokeWidth={2} fill="url(#actual)" name="Actual Revenue" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="forecast" stroke="#06B6D4" strokeWidth={2} fill="url(#forecast)" name="Forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-surface-400 text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hour Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span className="text-surface-400 text-sm">{value}</span>} />
                  <Bar dataKey="mon" fill="#64748b" radius={[2, 2, 0, 0]} maxBarSize={8} name="Mon" />
                  <Bar dataKey="wed" fill="#8B5CF6" radius={[2, 2, 0, 0]} maxBarSize={8} name="Wed" />
                  <Bar dataKey="fri" fill="#06B6D4" radius={[2, 2, 0, 0]} maxBarSize={8} name="Fri" />
                  <Bar dataKey="sat" fill="#F59E0B" radius={[2, 2, 0, 0]} maxBarSize={8} name="Sat" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData}>
                  <defs>
                    <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span className="text-surface-400 text-sm">{value}</span>} />
                  <Area type="monotone" dataKey="new" stroke="#8B5CF6" strokeWidth={2} fill="url(#newGrad)" name="New Members" />
                  <Area type="monotone" dataKey="returning" stroke="#06B6D4" strokeWidth={2} fill="url(#returnGrad)" name="Returning" />
                  <Line type="monotone" dataKey="churned" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Churned" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PC Utilization Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="utilization" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {utilizationData.map((entry, index) => (
                    <Cell key={index} fill={entry.utilization > 80 ? '#10B981' : entry.utilization > 60 ? '#8B5CF6' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
