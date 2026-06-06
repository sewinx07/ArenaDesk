'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Monitor } from 'lucide-react';

const reservations = [
  { id: '1', customer: 'Sarah Connor', resource: 'PC #07', time: '4:00 PM - 6:00 PM', status: 'confirmed' as const, type: 'PC' as const },
  { id: '2', customer: 'Thomas Anderson', resource: 'VIP Room A', time: '5:00 PM - 8:00 PM', status: 'confirmed' as const, type: 'VIP' as const },
  { id: '3', customer: 'Diana Prince', resource: 'Console #03', time: '6:00 PM - 7:30 PM', status: 'pending' as const, type: 'Console' as const },
  { id: '4', customer: 'Bruce Wayne', resource: 'PC #15', time: '7:00 PM - 10:00 PM', status: 'confirmed' as const, type: 'PC' as const },
  { id: '5', customer: 'Clark Kent', resource: 'PC #22', time: '8:00 PM - 11:00 PM', status: 'pending' as const, type: 'PC' as const },
];

export default function UpcomingReservationsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Reservations</CardTitle>
          <p className="text-sm text-surface-400 mt-1">Today&apos;s bookings</p>
        </div>
        <Badge variant="info">Today</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="flex items-center justify-between rounded-lg bg-surface-800/30 p-3 hover:bg-surface-800/50 transition-colors border border-surface-700/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600/10">
                  <Monitor className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{res.customer}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-400">
                    <Monitor className="h-3 w-3" />
                    <span>{res.resource}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-surface-400">
                  <div className="flex items-center gap-1 justify-end">
                    <Calendar className="h-3 w-3" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{res.time}</span>
                  </div>
                </div>
                <Badge variant={res.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                  {res.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
