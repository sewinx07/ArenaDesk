'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, CalendarDays, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReservationCard from '@/components/reservations/ReservationCard';
import ReservationCalendar from '@/components/reservations/ReservationCalendar';
import type { Reservation, ReservationStatus } from '@/types';

const sampleReservations: Reservation[] = [
  { id: '1', cafeId: '1', resourceType: 'pc', resourceId: 'pc07', resourceName: 'PC #07', customerName: 'Sarah Connor', customerEmail: 'sarah@example.com', customerPhone: '+1 234 567 890', startTime: '2026-06-06T16:00:00Z', endTime: '2026-06-06T18:00:00Z', duration: 120, status: 'confirmed', totalAmount: 12.00, paidAmount: 12.00, paymentStatus: 'paid', createdBy: 'staff-1', createdAt: '2026-06-05T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z' },
  { id: '2', cafeId: '1', resourceType: 'vip_room', resourceId: 'vip_a', resourceName: 'VIP Room A', customerName: 'Thomas Anderson', customerEmail: 'thomas@example.com', customerPhone: '+1 234 567 891', startTime: '2026-06-06T17:00:00Z', endTime: '2026-06-06T20:00:00Z', duration: 180, status: 'confirmed', totalAmount: 45.00, paidAmount: 22.50, paymentStatus: 'partial', createdBy: 'staff-1', createdAt: '2026-06-04T14:00:00Z', updatedAt: '2026-06-04T14:00:00Z' },
  { id: '3', cafeId: '1', resourceType: 'console', resourceId: 'con03', resourceName: 'Console #03', customerName: 'Diana Prince', customerEmail: 'diana@example.com', customerPhone: '+1 234 567 892', startTime: '2026-06-06T18:00:00Z', endTime: '2026-06-06T19:30:00Z', duration: 90, status: 'pending', totalAmount: 8.00, paidAmount: 0, paymentStatus: 'pending', createdBy: 'staff-1', createdAt: '2026-06-06T09:00:00Z', updatedAt: '2026-06-06T09:00:00Z' },
  { id: '4', cafeId: '1', resourceType: 'pc', resourceId: 'pc15', resourceName: 'PC #15', customerName: 'Bruce Wayne', customerEmail: 'bruce@example.com', customerPhone: '+1 234 567 893', startTime: '2026-06-06T19:00:00Z', endTime: '2026-06-06T22:00:00Z', duration: 180, status: 'confirmed', totalAmount: 18.00, paidAmount: 18.00, paymentStatus: 'paid', createdBy: 'staff-1', createdAt: '2026-06-03T11:00:00Z', updatedAt: '2026-06-03T11:00:00Z' },
  { id: '5', cafeId: '1', resourceType: 'pc', resourceId: 'pc12', resourceName: 'PC #12', customerName: 'Clark Kent', customerEmail: 'clark@example.com', customerPhone: '+1 234 567 894', startTime: '2026-06-07T14:00:00Z', endTime: '2026-06-07T17:00:00Z', duration: 180, status: 'confirmed', totalAmount: 18.00, paidAmount: 18.00, paymentStatus: 'paid', createdBy: 'staff-1', createdAt: '2026-06-05T16:00:00Z', updatedAt: '2026-06-05T16:00:00Z' },
  { id: '6', cafeId: '1', resourceType: 'vip_room', resourceId: 'vip_b', resourceName: 'VIP Room B', customerName: 'Tony Stark', customerEmail: 'tony@example.com', customerPhone: '+1 234 567 895', startTime: '2026-06-07T20:00:00Z', endTime: '2026-06-08T02:00:00Z', duration: 360, status: 'pending', totalAmount: 90.00, paidAmount: 0, paymentStatus: 'pending', createdBy: 'staff-1', createdAt: '2026-06-06T08:00:00Z', updatedAt: '2026-06-06T08:00:00Z' },
];

const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'checked_in', label: 'Checked In' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function ReservationsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReservations = sampleReservations.filter(
    (res) =>
      (statusFilter === 'all' || res.status === statusFilter) &&
      (searchQuery === '' ||
        res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.resourceName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservations</h1>
          <p className="text-sm text-surface-400 mt-1">
            Manage bookings for PCs, consoles, and VIP rooms.
          </p>
        </div>
        <Link href="/reservations/new">
          <Button variant="gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search by customer or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex rounded-lg border border-surface-700/50 p-0.5 bg-surface-800/50">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-surface-700 text-white' : 'text-surface-400 hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`rounded-md px-3 py-1.5 text-sm ${viewMode === 'calendar' ? 'bg-surface-700 text-white' : 'text-surface-400 hover:text-white'}`}
          >
            <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === f.id
                ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                : 'bg-surface-800/50 text-surface-400 border border-transparent hover:text-surface-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <ReservationCalendar />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReservations.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <p className="text-surface-500">No reservations found</p>
            </div>
          ) : (
            filteredReservations.map((res) => (
              <ReservationCard key={res.id} reservation={res} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
