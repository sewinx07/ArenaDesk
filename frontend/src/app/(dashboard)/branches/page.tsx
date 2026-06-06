'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Building2, Monitor, Users, DollarSign, MapPin, Phone, Mail, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Cafe } from '@/types';

const sampleCafes: Cafe[] = [
  { id: '1', name: 'Main Cafe Downtown', address: '123 Gaming Street', city: 'New York', country: 'USA', phone: '+1 212 555 0101', email: 'main@ArenaDesk.io', status: 'active', openingTime: '08:00', closingTime: '02:00', timezone: 'America/New_York', pcCount: 20, staffCount: 8, monthlyRevenue: 28500, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z' },
  { id: '2', name: 'Downtown Arena', address: '456 Esports Boulevard', city: 'New York', country: 'USA', phone: '+1 212 555 0202', email: 'arena@ArenaDesk.io', status: 'active', openingTime: '10:00', closingTime: '23:00', timezone: 'America/New_York', pcCount: 35, staffCount: 12, monthlyRevenue: 42000, createdAt: '2025-03-15T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z' },
  { id: '3', name: 'Mall Gaming Zone', address: '789 Shopping Center', city: 'Brooklyn', country: 'USA', phone: '+1 718 555 0303', email: 'mallzone@ArenaDesk.io', status: 'active', openingTime: '09:00', closingTime: '22:00', timezone: 'America/New_York', pcCount: 12, staffCount: 5, monthlyRevenue: 18500, createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-15T00:00:00Z' },
  { id: '4', name: 'Westside Esports Hub', address: '321 Westside Ave', city: 'Newark', country: 'USA', phone: '+1 973 555 0404', email: 'westside@ArenaDesk.io', status: 'inactive', openingTime: '10:00', closingTime: '23:00', timezone: 'America/New_York', pcCount: 18, staffCount: 6, monthlyRevenue: 0, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
];

export default function CafesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const totalPCs = sampleCafes.reduce((s, c) => s + c.pcCount, 0);
  const totalStaff = sampleCafes.reduce((s, c) => s + c.staffCount, 0);
  const totalRevenue = sampleCafes.reduce((s, c) => s + c.monthlyRevenue, 0);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cafes</h1>
          <p className="text-sm text-surface-400 mt-1">
            Manage all your gaming venue locations from one dashboard.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Cafe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cafe</DialogTitle>
              <DialogDescription>Register a new gaming venue location.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input label="Cafe Name" placeholder="e.g. Downtown Arena" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Address" placeholder="Street address" />
                <Input label="City" placeholder="City" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Phone" placeholder="Phone number" />
                <Input label="Email" type="email" placeholder="Email address" />
              </div>
              <Button className="w-full" variant="gradient">Create Cafe</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-10 w-10 p-2 rounded-lg bg-primary-600/10 text-primary-400" />
            <div>
              <p className="text-lg font-bold text-white">{sampleCafes.length}</p>
              <p className="text-xs text-surface-500">Total Cafes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Monitor className="h-10 w-10 p-2 rounded-lg bg-cyan-600/10 text-cyan-400" />
            <div>
              <p className="text-lg font-bold text-white">{totalPCs}</p>
              <p className="text-xs text-surface-500">Total PCs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-10 w-10 p-2 rounded-lg bg-emerald-600/10 text-emerald-400" />
            <div>
              <p className="text-lg font-bold text-white">{totalStaff}</p>
              <p className="text-xs text-surface-500">Total Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-10 w-10 p-2 rounded-lg bg-amber-600/10 text-amber-400" />
            <div>
              <p className="text-lg font-bold text-white">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-surface-500">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleCafes.map((cafe) => (
          <Link key={cafe.id} href={`/branches/${cafe.id}`}>
            <Card className="hover:border-primary-600/30 transition-all duration-200 cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 border border-primary-600/20">
                      <Building2 className="h-6 w-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {cafe.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-surface-500 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {cafe.address}, {cafe.city}
                      </div>
                    </div>
                  </div>
                  <Badge variant={cafe.status === 'active' ? 'success' : 'danger'} size="sm">
                    {cafe.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{cafe.pcCount}</p>
                    <p className="text-xs text-surface-500">PCs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{cafe.staffCount}</p>
                    <p className="text-xs text-surface-500">Staff</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">
                      ${cafe.monthlyRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-surface-500">Monthly</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-surface-500 pt-3 border-t border-surface-700/30">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {cafe.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {cafe.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
