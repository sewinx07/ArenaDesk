'use client';

import React, { useState } from 'react';
import { Plus, Search, Users, Shield, Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { User, UserRole } from '@/types';

const sampleStaff: User[] = [
  { id: '1', email: 'john@example.com', name: 'John Manager', role: 'manager', cafeId: '1', isActive: true, lastLogin: '2026-06-06T09:00:00Z', createdAt: '', updatedAt: '' },
  { id: '2', email: 'sarah@example.com', name: 'Sarah Staff', role: 'staff', cafeId: '1', isActive: true, lastLogin: '2026-06-06T08:30:00Z', createdAt: '', updatedAt: '' },
  { id: '3', email: 'mike@example.com', name: 'Mike Admin', role: 'admin', cafeId: '1', isActive: true, lastLogin: '2026-06-05T18:00:00Z', createdAt: '', updatedAt: '' },
  { id: '4', email: 'emma@example.com', name: 'Emma Staff', role: 'staff', cafeId: '1', isActive: true, lastLogin: '2026-06-04T22:00:00Z', createdAt: '', updatedAt: '' },
  { id: '5', email: 'david@example.com', name: 'David Owner', role: 'owner', cafeId: '1', isActive: true, lastLogin: '2026-06-06T12:00:00Z', createdAt: '', updatedAt: '' },
  { id: '6', email: 'lisa@example.com', name: 'Lisa Staff', role: 'staff', cafeId: '1', isActive: false, lastLogin: '2026-05-20T14:00:00Z', createdAt: '', updatedAt: '' },
];

const roleColors: Record<UserRole, 'primary' | 'success' | 'warning' | 'info'> = {
  admin: 'primary',
  manager: 'info',
  staff: 'warning',
  owner: 'success',
};

const activityLog = [
  { id: 'a1', userName: 'John Manager', action: 'Started session', resource: 'PC #05', details: 'Member: Alice Johnson', createdAt: '2026-06-06T12:30:00Z' },
  { id: 'a2', userName: 'Sarah Staff', action: 'Processed POS sale', resource: 'Order #1245', details: '$15.50 - Snacks & Drinks', createdAt: '2026-06-06T12:15:00Z' },
  { id: 'a3', userName: 'Mike Admin', action: 'Created reservation', resource: 'VIP Room A', details: 'Customer: Thomas Anderson', createdAt: '2026-06-06T11:45:00Z' },
  { id: 'a4', userName: 'Emma Staff', action: 'Ended session', resource: 'PC #12', details: 'Duration: 2h 30m, $11.25', createdAt: '2026-06-06T11:30:00Z' },
  { id: 'a5', userName: 'John Manager', action: 'Updated member', resource: 'Member #42', details: 'Changed tier to Gold', createdAt: '2026-06-06T11:00:00Z' },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredStaff = sampleStaff.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management</h1>
          <p className="text-sm text-surface-400 mt-1">
            Manage your team, roles, and permissions.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>Invite a new team member to manage your venue.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input label="Full Name" placeholder="Enter name" />
              <Input label="Email" type="email" placeholder="email@example.com" />
              <Select label="Role" options={[
                { value: 'staff', label: 'Staff' },
                { value: 'manager', label: 'Manager' },
                { value: 'admin', label: 'Admin' },
                { value: 'owner', label: 'Owner' },
              ]} placeholder="Select role" />
              <Input label="Password" type="password" placeholder="Set temporary password" />
              <Button className="w-full" variant="gradient">Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600/10">
              <Users className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{sampleStaff.length}</p>
              <p className="text-xs text-surface-500">Total Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{sampleStaff.filter((s) => s.isActive).length}</p>
              <p className="text-xs text-surface-500">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/10">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{sampleStaff.filter((s) => s.role === 'staff').length}</p>
              <p className="text-xs text-surface-500">Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600/10">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{sampleStaff.filter((s) => s.role === 'admin' || s.role === 'manager').length}</p>
              <p className="text-xs text-surface-500">Admins & Managers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value="staff">
        <TabsList>
          <TabsTrigger value="staff">Staff List</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar size="sm" alt={staff.name} fallback={staff.name.charAt(0)} />
                          <span className="font-medium text-white">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-surface-400">{staff.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleColors[staff.role]} size="sm" className="capitalize">
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={staff.isActive ? 'success' : 'default'} size="sm">
                          {staff.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-surface-400 text-sm">
                        {staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg bg-surface-800/30 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600/10 shrink-0">
                      <Shield className="h-4 w-4 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{log.userName}</span>
                        <span className="text-sm text-surface-400">{log.action}</span>
                        <span className="text-sm text-cyan-400">{log.resource}</span>
                      </div>
                      <p className="text-xs text-surface-500 mt-0.5">{log.details}</p>
                    </div>
                    <span className="text-xs text-surface-600 shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
