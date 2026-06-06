'use client';

import React, { useState } from 'react';
import { Plus, Search, Users, Star, Wallet, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MemberCard from '@/components/members/MemberCard';
import type { Member, MembershipTier } from '@/types';

const sampleMembers: Member[] = [
  { id: '1', cafeId: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 234 567 890', membershipTier: 'diamond', loyaltyPoints: 12500, totalSpent: 2480.50, walletBalance: 120.00, totalSessions: 156, totalHours: 312, joinDate: '2025-03-15T10:00:00Z', lastVisit: '2026-06-05T14:30:00Z', isActive: true, tags: ['vip', 'regular'], createdAt: '', updatedAt: '' },
  { id: '2', cafeId: '1', name: 'Bob Smith', email: 'bob@example.com', phone: '+1 234 567 891', membershipTier: 'gold', loyaltyPoints: 8500, totalSpent: 1560.00, walletBalance: 45.00, totalSessions: 89, totalHours: 178, joinDate: '2025-06-20T10:00:00Z', lastVisit: '2026-06-04T18:00:00Z', isActive: true, tags: ['regular'], createdAt: '', updatedAt: '' },
  { id: '3', cafeId: '1', name: 'Carol White', email: 'carol@example.com', phone: '+1 234 567 892', membershipTier: 'silver', loyaltyPoints: 3200, totalSpent: 780.00, walletBalance: 25.50, totalSessions: 45, totalHours: 90, joinDate: '2025-09-10T10:00:00Z', lastVisit: '2026-06-03T20:00:00Z', isActive: true, tags: [], createdAt: '', updatedAt: '' },
  { id: '4', cafeId: '1', name: 'David Brown', email: 'david@example.com', phone: '+1 234 567 893', membershipTier: 'bronze', loyaltyPoints: 800, totalSpent: 240.00, walletBalance: 10.00, totalSessions: 12, totalHours: 24, joinDate: '2026-01-05T10:00:00Z', lastVisit: '2026-05-28T16:00:00Z', isActive: true, tags: ['new'], createdAt: '', updatedAt: '' },
  { id: '5', cafeId: '1', name: 'Eve Davis', email: 'eve@example.com', phone: '+1 234 567 894', membershipTier: 'platinum', loyaltyPoints: 15000, totalSpent: 3200.00, walletBalance: 200.00, totalSessions: 200, totalHours: 400, joinDate: '2025-01-01T10:00:00Z', lastVisit: '2026-06-06T12:00:00Z', isActive: true, tags: ['vip', 'regular', 'sponsor'], createdAt: '', updatedAt: '' },
];

const tierFilters = [
  { id: 'all', label: 'All Members', count: sampleMembers.length },
  { id: 'diamond', label: 'Diamond', count: sampleMembers.filter((m) => m.membershipTier === 'diamond').length },
  { id: 'platinum', label: 'Platinum', count: sampleMembers.filter((m) => m.membershipTier === 'platinum').length },
  { id: 'gold', label: 'Gold', count: sampleMembers.filter((m) => m.membershipTier === 'gold').length },
  { id: 'silver', label: 'Silver', count: sampleMembers.filter((m) => m.membershipTier === 'silver').length },
  { id: 'bronze', label: 'Bronze', count: sampleMembers.filter((m) => m.membershipTier === 'bronze').length },
];

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = sampleMembers.filter(
    (m) =>
      (activeTab === 'all' || m.membershipTier === activeTab) &&
      (searchQuery === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPoints = sampleMembers.reduce((sum, m) => sum + m.loyaltyPoints, 0);
  const totalWallet = sampleMembers.reduce((sum, m) => sum + m.walletBalance, 0);
  const avgSpent = sampleMembers.reduce((sum, m) => sum + m.totalSpent, 0) / sampleMembers.length;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-sm text-surface-400 mt-1">
            Manage customer profiles, loyalty points, and memberships.
          </p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600/10">
              <Star className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</p>
              <p className="text-xs text-surface-400">Total Loyalty Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/10">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${totalWallet.toFixed(2)}</p>
              <p className="text-xs text-surface-400">Total Wallet Balance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
              <TrendingUp className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${avgSpent.toFixed(2)}</p>
              <p className="text-xs text-surface-400">Avg. Spend per Member</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tierFilters.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
              <span className="ml-2 text-xs text-surface-500">({tab.count})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tierFilters.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Users className="h-12 w-12 text-surface-600 mb-3" />
                <p className="text-surface-500">No members found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
