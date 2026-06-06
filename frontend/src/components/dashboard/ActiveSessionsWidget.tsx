'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Clock, Timer, User, DollarSign, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActiveSession {
  id: string;
  pc: string;
  user: string;
  startTime: string;
  startTimestamp: number;
  rate: number;
  status: 'active' | 'paused';
}

const initialSessions: ActiveSession[] = [
  { id: '1', pc: 'PC #01', user: 'John Doe', startTime: '2:30 PM', startTimestamp: Date.now() - 4500000, rate: 4.50, status: 'active' },
  { id: '2', pc: 'PC #05', user: 'Alice Smith', startTime: '1:00 PM', startTimestamp: Date.now() - 9900000, rate: 5.00, status: 'active' },
  { id: '3', pc: 'PC #08', user: 'Bob Johnson', startTime: '3:15 PM', startTimestamp: Date.now() - 1800000, rate: 4.50, status: 'active' },
  { id: '4', pc: 'PC #12', user: 'Emma Wilson', startTime: '12:00 PM', startTimestamp: Date.now() - 13500000, rate: 5.00, status: 'active' },
  { id: '5', pc: 'PC #03', user: 'Mike Brown', startTime: '3:45 PM', startTimestamp: Date.now() - 900000, rate: 4.50, status: 'paused' },
];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function calculateCost(ms: number, rate: number): string {
  const hours = ms / 3600000;
  return `$${(hours * rate).toFixed(2)}`;
}

function SessionTimer({ session }: { session: ActiveSession }) {
  const [elapsed, setElapsed] = useState(Date.now() - session.startTimestamp);

  useEffect(() => {
    if (session.status !== 'active') return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - session.startTimestamp);
    }, 1000);
    return () => clearInterval(interval);
  }, [session.status, session.startTimestamp]);

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="flex items-center gap-1 text-xs text-surface-400">
          <Clock className="h-3 w-3" />
          <span>{session.startTime}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-cyan-400">
          <Timer className="h-3 w-3" />
          <span className="tabular-nums">{formatTime(elapsed)}</span>
        </div>
      </div>
      <div className="text-right min-w-[5rem]">
        <p className="text-sm font-medium text-white tabular-nums">{calculateCost(elapsed, session.rate)}</p>
        <Badge variant={session.status === 'active' ? 'success' : 'warning'} size="sm" className="mt-0.5">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          {session.status === 'active' ? 'Live' : 'Paused'}
        </Badge>
      </div>
      <div className="flex gap-1">
        {session.status === 'active' ? (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Square className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
            <Play className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ActiveSessionsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Sessions</CardTitle>
          <p className="text-sm text-surface-400 mt-1">Live session tracking</p>
        </div>
        <Badge variant="success">{initialSessions.filter(s => s.status === 'active').length} active</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {initialSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-lg bg-surface-800/30 p-3 hover:bg-surface-800/50 transition-colors border border-surface-700/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600/10">
                  <Monitor className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{session.pc}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-400">
                    <User className="h-3 w-3" />
                    <span>{session.user}</span>
                  </div>
                </div>
              </div>

              <SessionTimer session={session} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
