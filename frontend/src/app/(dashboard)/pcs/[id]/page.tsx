'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Monitor, Cpu, HardDrive, MemoryStick, Clock, DollarSign, Play, Square, Lock, Unlock, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import PCMonitor from '@/components/pcs/PCMonitor';
import type { PC, Session } from '@/types';

const samplePC: PC = {
  id: 'pc-01',
  cafeId: 'cafe-1',
  name: 'PC #01',
  identifier: 'DESKTOP-001',
  status: 'in_use',
  specs: { cpu: 'Intel Core i7-13700K', gpu: 'NVIDIA RTX 4070', ram: '32GB DDR5', storage: '1TB NVMe SSD', os: 'Windows 11 Pro' },
  hourlyRate: 4.50,
  isLocked: false,
  totalHoursUsed: 1245,
  totalRevenue: 5602.50,
  createdAt: '2025-01-15T08:00:00Z',
  updatedAt: '2026-06-06T14:30:00Z',
};

const currentSession: Session = {
  id: 'session-active',
  pcId: 'pc-01',
  cafeId: 'cafe-1',
  startTime: new Date(Date.now() - 5400000).toISOString(),
  duration: 90,
  status: 'active',
  cost: 6.75,
  hourlyRate: 4.50,
  createdBy: 'staff-1',
  createdAt: new Date(Date.now() - 5400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const sampleSessions: Session[] = Array.from({ length: 10 }, (_, i) => ({
  id: `session-${i}`,
  pcId: 'pc-01',
  cafeId: 'cafe-1',
  startTime: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  endTime: new Date(Date.now() - (i + 1) * 86400000 + 7200000).toISOString(),
  duration: 120,
  status: 'completed' as const,
  cost: 9.00,
  hourlyRate: 4.50,
  createdBy: 'staff-1',
  createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - (i + 1) * 86400000 + 7200000).toISOString(),
}));

function LiveTimer({ startTime, rate }: { startTime: string; rate: number }) {
  const [elapsed, setElapsed] = useState(Date.now() - new Date(startTime).getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - new Date(startTime).getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const totalSeconds = Math.floor(elapsed / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const cost = (elapsed / 3600000) * rate;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-400" />
        <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
          {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-emerald-400" />
        <span className="text-xl font-bold text-emerald-400 tabular-nums">${cost.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function PCDetailPage() {
  const params = useParams();
  const pcId = params.id as string;
  const [pcLocked, setPcLocked] = useState(samplePC.isLocked);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Link href="/pcs">
          <Button variant="ghost" size="icon" className="hover:bg-surface-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{samplePC.name}</h1>
            <Badge variant={samplePC.status === 'in_use' ? 'warning' : samplePC.status === 'available' ? 'success' : 'danger'} size="lg">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {samplePC.status.replace('_', ' ')}
            </Badge>
            <Button variant="ghost" size="sm" className="ml-auto">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
          <p className="text-sm text-surface-400">{samplePC.identifier}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-800/30 p-4 border border-surface-700/20">
                  <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
                    <Cpu className="h-3.5 w-3.5" />
                    Processor
                  </div>
                  <p className="text-sm font-medium text-white">{samplePC.specs.cpu}</p>
                </div>
                <div className="rounded-lg bg-surface-800/30 p-4 border border-surface-700/20">
                  <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
                    <Monitor className="h-3.5 w-3.5" />
                    Graphics
                  </div>
                  <p className="text-sm font-medium text-white">{samplePC.specs.gpu}</p>
                </div>
                <div className="rounded-lg bg-surface-800/30 p-4 border border-surface-700/20">
                  <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
                    <MemoryStick className="h-3.5 w-3.5" />
                    Memory
                  </div>
                  <p className="text-sm font-medium text-white">{samplePC.specs.ram}</p>
                </div>
                <div className="rounded-lg bg-surface-800/30 p-4 border border-surface-700/20">
                  <div className="flex items-center gap-2 text-surface-400 text-xs mb-1">
                    <HardDrive className="h-3.5 w-3.5" />
                    Storage
                  </div>
                  <p className="text-sm font-medium text-white">{samplePC.specs.storage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {samplePC.status === 'in_use' && (
            <Card className="border-amber-600/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Session</CardTitle>
                  <p className="text-sm text-surface-400 mt-1">Started at {new Date(currentSession.startTime).toLocaleTimeString()}</p>
                </div>
                <Badge variant="warning" size="lg">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Live
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <LiveTimer startTime={currentSession.startTime} rate={samplePC.hourlyRate} />
                  <Button variant="destructive" className="h-12 px-8">
                    <Square className="h-5 w-5 mr-2" />
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {samplePC.status === 'available' ? (
                <Button className="w-full" variant="cyan" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button className="w-full" variant="destructive" size="lg">
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              )}
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={() => setPcLocked(!pcLocked)}
              >
                {pcLocked ? (
                  <><Unlock className="h-4 w-4 mr-2" /> Unlock PC</>
                ) : (
                  <><Lock className="h-4 w-4 mr-2" /> Lock PC</>
                )}
              </Button>
              <Button className="w-full" variant="outline" size="lg">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-2 rounded-lg bg-surface-800/30">
                  <span className="text-surface-400">Total Hours</span>
                  <span className="text-white font-medium">{samplePC.totalHoursUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm p-2 rounded-lg bg-surface-800/30">
                  <span className="text-surface-400">Total Revenue</span>
                  <span className="text-emerald-400 font-medium">${samplePC.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm p-2 rounded-lg bg-surface-800/30">
                  <span className="text-surface-400">Hourly Rate</span>
                  <span className="text-white font-medium">${samplePC.hourlyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm p-2 rounded-lg bg-surface-800/30">
                  <span className="text-surface-400">Status</span>
                  <span className="text-amber-400 font-medium capitalize">{samplePC.status.replace('_', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="text-white font-medium">
                    {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-surface-400">
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-surface-400">
                    {session.endTime
                      ? new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </TableCell>
                  <TableCell className="text-surface-400">{session.duration} min</TableCell>
                  <TableCell className="text-surface-400">${session.hourlyRate.toFixed(2)}/hr</TableCell>
                  <TableCell className="text-white font-medium">${session.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === 'completed' ? 'success' : session.status === 'active' ? 'warning' : 'default'} size="sm">
                      {session.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
