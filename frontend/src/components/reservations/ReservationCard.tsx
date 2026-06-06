'use client';

import React from 'react';
import { Calendar, Clock, Monitor, User, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Reservation } from '@/types';

interface ReservationCardProps {
  reservation: Reservation;
}

const statusVariants: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
  pending: 'warning',
  confirmed: 'primary',
  checked_in: 'info',
  completed: 'success',
  cancelled: 'danger',
};

export default function ReservationCard({ reservation }: ReservationCardProps) {
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);

  return (
    <div className="group rounded-xl border border-surface-700/50 bg-surface-900/50 p-4 hover:border-surface-600/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600/10">
            <Monitor className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{reservation.resourceName}</h3>
            <p className="text-xs text-surface-500">{reservation.resourceType.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[reservation.status]} size="sm">
            {reservation.status.replace('_', ' ')}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-surface-300">
          <User className="h-4 w-4 text-surface-500" />
          <span>{reservation.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-300">
          <Calendar className="h-4 w-4 text-surface-500" />
          <span>
            {startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-300">
          <Clock className="h-4 w-4 text-surface-500" />
          <span>
            {startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} -{' '}
            {endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-700/30">
        <span className={cn(
          'text-sm font-medium',
          reservation.paymentStatus === 'paid' ? 'text-emerald-400' :
          reservation.paymentStatus === 'partial' ? 'text-amber-400' : 'text-surface-400'
        )}>
          ${reservation.paidAmount.toFixed(2)} / ${reservation.totalAmount.toFixed(2)}
        </span>
        <Badge variant="default" size="sm">
          {reservation.paymentStatus}
        </Badge>
      </div>
    </div>
  );
}
