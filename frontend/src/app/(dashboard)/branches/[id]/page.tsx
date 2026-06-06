'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Monitor, Users, DollarSign, MapPin, Phone, Mail, Clock, TrendingUp, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Cafe, User, PC } from '@/types';

const sampleCafe: Cafe = {
  id: '1', name: 'Main Cafe Downtown', address: '123 Gaming Street', city: 'New York', country: 'USA',
  phone: '+1 212 555 0101', email: 'main@ArenaDesk.io', status: 'active',
  openingTime: '08:00', closingTime: '02:00', timezone: 'America/New_York',
  pcCount: 20, staffCount: 8, monthlyRevenue: 28500,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
};

const sampleStaff: User[] = [
  { id: 's1', email: 'john@example.com', name: 'John Manager', role: 'manager', cafeId: '1', isActive: true, createdAt: '', updatedAt: '' },
  { id: 's2', email: 'sarah@example.com', name: 'Sarah Staff', role: 'staff', cafeId: '1', isActive: true, createdAt: '', updatedAt: '' },
  { id: 's3', email: 'mike@example.com', name: 'Mike Admin', role: 'admin', cafeId: '1', isActive: true, createdAt: '', updatedAt: '' },
  { id: 's4', email: 'emma@example.com', name: 'Emma Staff', role: 'staff', cafeId: '1', isActive: true, createdAt: '', updatedAt: '' },
];

const weeklyRevenue = [
  { day: 'Mon', revenue: 3200 },
  { day: 'Tue', revenue: 2800 },
  { day: 'Wed', revenue: 3500 },
  { day: 'Thu', revenue: 4100 },
  { day: 'Fri', revenue: 5800 },
  { day: 'Sat', revenue: 7200 },
  { day: 'Sun', revenue: 4800 },
];

export default function CafeDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Link href="/branches">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{sampleCafe.name}</h1>
            <Badge variant="success" size="lg">{sampleCafe.status}</Badge>
          </div>
          <p className="text-sm text-surface-400">{sampleCafe.address}, {sampleCafe.city}</p>
        </div>
        <Button variant="outline">Edit Cafe</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Monitor className="h-10 w-10 p-2 rounded-lg bg-cyan-600/10 text-cyan-400" />
            <div>
              <p className="text-lg font-bold text-white">{sampleCafe.pcCount}</p>
              <p className="text-xs text-surface-500">Total PCs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-10 w-10 p-2 rounded-lg bg-primary-600/10 text-primary-400" />
            <div>
              <p className="text-lg font-bold text-white">{sampleCafe.staffCount}</p>
              <p className="text-xs text-surface-500">Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-10 w-10 p-2 rounded-lg bg-emerald-600/10 text-emerald-400" />
            <div>
              <p className="text-lg font-bold text-white">${sampleCafe.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-surface-500">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="h-10 w-10 p-2 rounded-lg bg-amber-600/10 text-amber-400" />
            <div>
              <p className="text-lg font-bold text-white">78%</p>
              <p className="text-xs text-surface-500">Avg Utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Cafe Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-surface-500" />
                <div>
                  <p className="text-surface-400 text-xs">Address</p>
                  <p className="text-white">{sampleCafe.address}</p>
                  <p className="text-surface-400">{sampleCafe.city}, {sampleCafe.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-surface-500" />
                <div>
                  <p className="text-surface-400 text-xs">Phone</p>
                  <p className="text-white">{sampleCafe.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-surface-500" />
                <div>
                  <p className="text-surface-400 text-xs">Email</p>
                  <p className="text-white">{sampleCafe.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-surface-500" />
                <div>
                  <p className="text-surface-400 text-xs">Hours</p>
                  <p className="text-white">{sampleCafe.openingTime} - {sampleCafe.closingTime}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-surface-800/30 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-surface-500" />
                <div>
                  <p className="text-surface-400 text-xs">Timezone</p>
                  <p className="text-white">{sampleCafe.timezone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Weekly Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weeklyRevenue.map((day) => {
                const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.revenue));
                const pct = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-xs text-surface-400 w-8">{day.day}</span>
                    <div className="flex-1 h-6 rounded bg-surface-800/50 overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-r from-primary-600 to-cyan-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-white font-medium w-16 text-right">
                      ${day.revenue.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value="staff">
        <TabsList>
          <TabsTrigger value="staff">Staff ({sampleStaff.length})</TabsTrigger>
          <TabsTrigger value="pcs">PCs ({sampleCafe.pcCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <Card>
            <CardHeader><CardTitle>Staff Members</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3 rounded-lg bg-surface-800/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600/10">
                      <span className="text-sm font-medium text-primary-400">{staff.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{staff.name}</p>
                      <Badge variant={staff.role === 'admin' ? 'primary' : staff.role === 'manager' ? 'info' : 'warning'} size="sm" className="capitalize mt-0.5">
                        {staff.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pcs">
          <Card>
            <CardHeader><CardTitle>PC Inventory</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-lg bg-surface-800/30 p-4 text-center">
                  <p className="text-2xl font-bold text-white">14</p>
                  <p className="text-xs text-emerald-400">Available</p>
                </div>
                <div className="rounded-lg bg-surface-800/30 p-4 text-center">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-amber-400">In Use</p>
                </div>
                <div className="rounded-lg bg-surface-800/30 p-4 text-center">
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-xs text-red-400">Maintenance</p>
                </div>
                <div className="rounded-lg bg-surface-800/30 p-4 text-center">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-surface-500">Offline</p>
                </div>
              </div>
              <Link href="/pcs">
                <Button variant="outline" className="w-full mt-4">View All PCs</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
