'use client';

import React, { useState } from 'react';
import { Download, FileText, BarChart3, DollarSign, Users, Monitor, Calendar, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';

const salesData = [
  { date: 'Jun 1', sessions: 45, pos: 32, memberships: 3, total: 1280.50 },
  { date: 'Jun 2', sessions: 52, pos: 28, memberships: 2, total: 1420.00 },
  { date: 'Jun 3', sessions: 48, pos: 35, memberships: 5, total: 1560.75 },
  { date: 'Jun 4', sessions: 55, pos: 40, memberships: 4, total: 1720.25 },
  { date: 'Jun 5', sessions: 62, pos: 45, memberships: 6, total: 2100.00 },
  { date: 'Jun 6', sessions: 38, pos: 22, memberships: 2, total: 980.50 },
];

const sessionReport = [
  { pc: 'PC #01', sessions: 45, hours: 90, revenue: 405.00, utilization: '85%' },
  { pc: 'PC #02', sessions: 38, hours: 76, revenue: 342.00, utilization: '72%' },
  { pc: 'PC #03', sessions: 52, hours: 104, revenue: 468.00, utilization: '91%' },
  { pc: 'PC #04', sessions: 41, hours: 82, revenue: 369.00, utilization: '78%' },
  { pc: 'PC #05', sessions: 35, hours: 70, revenue: 315.00, utilization: '65%' },
];

const memberReport = [
  { tier: 'Diamond', count: 12, totalSpent: 24800, avgSpent: 2066.67, retention: '98%' },
  { tier: 'Platinum', count: 28, totalSpent: 42000, avgSpent: 1500.00, retention: '95%' },
  { tier: 'Gold', count: 45, totalSpent: 45000, avgSpent: 1000.00, retention: '88%' },
  { tier: 'Silver', count: 68, totalSpent: 34000, avgSpent: 500.00, retention: '75%' },
  { tier: 'Bronze', count: 120, totalSpent: 24000, avgSpent: 200.00, retention: '60%' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this-month');

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const totalRevenue = salesData.reduce((s, d) => s + d.total, 0);
  const totalSessions = salesData.reduce((s, d) => s + d.sessions, 0);
  const totalPOS = salesData.reduce((s, d) => s + d.pos, 0);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-surface-400 mt-1">View and export detailed reports for your venue.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-surface-700/50 bg-surface-800/50 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/10">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Total Revenue</p>
              <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-400">+8.3% vs last period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
              <Monitor className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Total Sessions</p>
              <p className="text-xl font-bold text-white">{totalSessions}</p>
              <p className="text-xs text-primary-400">+12 sessions vs last period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600/10">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-surface-500">Avg. Daily Revenue</p>
              <p className="text-xl font-bold text-white">
                ${(totalRevenue / salesData.length).toLocaleString()}
              </p>
              <p className="text-xs text-cyan-400">${(totalRevenue / totalSessions).toFixed(2)} per session</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="sessions">Session Report</TabsTrigger>
          <TabsTrigger value="members">Member Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Sales Breakdown</CardTitle>
                <CardDescription>Revenue from sessions, POS, and memberships.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>POS Orders</TableHead>
                    <TableHead>Memberships</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell className="text-white font-medium">{row.date}</TableCell>
                      <TableCell className="text-surface-400">{row.sessions}</TableCell>
                      <TableCell className="text-surface-400">{row.pos}</TableCell>
                      <TableCell className="text-surface-400">{row.memberships}</TableCell>
                      <TableCell className="text-right text-white font-medium">
                        ${row.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-surface-400 font-medium">Total</span>
                <span className="text-lg font-bold text-white">
                  ${salesData.reduce((s, r) => s + r.total, 0).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>PC Session Report</CardTitle>
                <CardDescription>Usage statistics for each workstation.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PC</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionReport.map((row) => (
                    <TableRow key={row.pc}>
                      <TableCell className="text-white font-medium">{row.pc}</TableCell>
                      <TableCell className="text-surface-400">{row.sessions}</TableCell>
                      <TableCell className="text-surface-400">{row.hours}</TableCell>
                      <TableCell className="text-white">${row.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-surface-800 overflow-hidden max-w-[100px]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan-600"
                              style={{ width: row.utilization }}
                            />
                          </div>
                          <span className="text-xs text-surface-400">{row.utilization}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Member Segmentation Report</CardTitle>
                <CardDescription>Breakdown by membership tier.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Avg. Spend</TableHead>
                    <TableHead>Retention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberReport.map((row) => (
                    <TableRow key={row.tier}>
                      <TableCell>
                        <Badge variant={row.tier === 'Diamond' ? 'purple' : row.tier === 'Platinum' ? 'info' : row.tier === 'Gold' ? 'primary' : row.tier === 'Silver' ? 'default' : 'secondary'} size="sm">
                          {row.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-surface-400">{row.count}</TableCell>
                      <TableCell className="text-white">${row.totalSpent.toLocaleString()}</TableCell>
                      <TableCell className="text-white">${row.avgSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={parseInt(row.retention) >= 90 ? 'success' : parseInt(row.retention) >= 75 ? 'warning' : 'danger'} size="sm">
                          {row.retention}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-surface-400">Total Members</span>
                <span className="text-lg font-bold text-white">
                  {memberReport.reduce((s, r) => s + r.count, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
