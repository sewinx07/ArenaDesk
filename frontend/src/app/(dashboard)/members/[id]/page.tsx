'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Calendar, Star, Wallet, Clock, DollarSign, Trophy, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import LoyaltyBadge from '@/components/members/LoyaltyBadge';
import { Avatar } from '@/components/ui/avatar';
import type { Member, Session, Reservation, Transaction } from '@/types';

const sampleMember: Member = {
  id: '1', cafeId: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 234 567 890',
  dateOfBirth: '1995-06-15', membershipTier: 'diamond', loyaltyPoints: 12500, totalSpent: 2480.50,
  walletBalance: 120.00, totalSessions: 156, totalHours: 312, joinDate: '2025-03-15T10:00:00Z',
  lastVisit: '2026-06-05T14:30:00Z', isActive: true, tags: ['vip', 'regular', 'tournament-player'],
  notes: 'Prefers corner PCs. Usually comes with friends on weekends.', createdAt: '', updatedAt: '',
};

const sampleSessions: Session[] = Array.from({ length: 5 }, (_, i) => ({
  id: `s-${i}`, pcId: 'pc01', cafeId: '1',
  startTime: new Date(Date.now() - i * 86400000).toISOString(),
  endTime: new Date(Date.now() - i * 86400000 + 7200000).toISOString(),
  duration: 120, status: 'completed' as const, cost: 9.00, hourlyRate: 4.50,
  createdBy: 'staff-1', createdAt: '', updatedAt: '',
}));

const sampleReservations: Reservation[] = [
  { id: 'r1', cafeId: '1', resourceType: 'pc', resourceId: 'pc07', resourceName: 'PC #07', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', customerPhone: '+1 234 567 890', startTime: '2026-06-10T16:00:00Z', endTime: '2026-06-10T18:00:00Z', duration: 120, status: 'confirmed', totalAmount: 12.00, paidAmount: 12.00, paymentStatus: 'paid', createdBy: 'staff-1', createdAt: '', updatedAt: '' },
  { id: 'r2', cafeId: '1', resourceType: 'vip_room', resourceId: 'vip_a', resourceName: 'VIP Room A', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', customerPhone: '+1 234 567 890', startTime: '2026-06-15T18:00:00Z', endTime: '2026-06-15T22:00:00Z', duration: 240, status: 'pending', totalAmount: 60.00, paidAmount: 0, paymentStatus: 'pending', createdBy: 'staff-1', createdAt: '', updatedAt: '' },
];

const sampleTransactions: Transaction[] = [
  { id: 't1', cafeId: '1', type: 'session', amount: 9.00, paymentMethod: 'wallet', status: 'completed', description: 'PC #01 - 2h session', memberId: '1', staffId: 'staff-1', staffName: 'Staff', createdAt: '2026-06-05T14:30:00Z' },
  { id: 't2', cafeId: '1', type: 'pos', amount: 5.50, paymentMethod: 'cash', status: 'completed', description: 'Energy Drink + Chips', memberId: '1', staffId: 'staff-1', staffName: 'Staff', createdAt: '2026-06-05T14:35:00Z' },
  { id: 't3', cafeId: '1', type: 'topup', amount: 50.00, paymentMethod: 'card', status: 'completed', description: 'Wallet top-up', memberId: '1', staffId: 'staff-1', staffName: 'Staff', createdAt: '2026-06-04T10:00:00Z' },
  { id: 't4', cafeId: '1', type: 'membership', amount: 35.00, paymentMethod: 'card', status: 'completed', description: 'Monthly membership renewal', memberId: '1', staffId: 'staff-1', staffName: 'Staff', createdAt: '2026-06-01T08:00:00Z' },
  { id: 't5', cafeId: '1', type: 'session', amount: 13.50, paymentMethod: 'wallet', status: 'completed', description: 'PC #01 - 3h session', memberId: '1', staffId: 'staff-1', staffName: 'Staff', createdAt: '2026-06-03T20:00:00Z' },
];

export default function MemberDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Link href="/members">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Member Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Avatar size="xl" alt={sampleMember.name} fallback={sampleMember.name.charAt(0)} className="mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">{sampleMember.name}</h2>
              <div className="flex justify-center mt-2">
                <LoyaltyBadge tier={sampleMember.membershipTier} size="lg" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Mail className="h-4 w-4 text-surface-500" />
                {sampleMember.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Phone className="h-4 w-4 text-surface-500" />
                {sampleMember.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Calendar className="h-4 w-4 text-surface-500" />
                Joined {new Date(sampleMember.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Clock className="h-4 w-4 text-surface-500" />
                Last visit: {sampleMember.lastVisit ? new Date(sampleMember.lastVisit).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            {sampleMember.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sampleMember.tags.map((tag) => (
                  <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                ))}
              </div>
            )}

            {sampleMember.notes && (
              <div className="mt-4 rounded-lg bg-surface-800/30 p-3">
                <p className="text-xs text-surface-500 mb-1">Notes</p>
                <p className="text-sm text-surface-300">{sampleMember.notes}</p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <Button className="w-full" variant="outline">Edit Profile</Button>
              <Button className="w-full" variant="outline">Send Message</Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{sampleMember.loyaltyPoints.toLocaleString()}</p>
                <p className="text-xs text-surface-500">Points</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Wallet className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">${sampleMember.walletBalance.toFixed(2)}</p>
                <p className="text-xs text-surface-500">Wallet</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-5 w-5 text-primary-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">${sampleMember.totalSpent.toFixed(2)}</p>
                <p className="text-xs text-surface-500">Total Spent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{sampleMember.totalSessions}</p>
                <p className="text-xs text-surface-500">Sessions</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value="sessions">
            <TabsList>
              <TabsTrigger value="sessions">Session History</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
              <Card>
                <CardHeader><CardTitle>Gaming Sessions</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleSessions.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="text-white">{new Date(s.startTime).toLocaleDateString()}</TableCell>
                          <TableCell className="text-surface-400">{s.duration} min</TableCell>
                          <TableCell className="text-white">${s.cost.toFixed(2)}</TableCell>
                          <TableCell><Badge variant="success" size="sm">{s.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reservations">
              <Card>
                <CardHeader><CardTitle>Reservations</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleReservations.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-white">{r.resourceName}</TableCell>
                          <TableCell className="text-surface-400">{new Date(r.startTime).toLocaleDateString()}</TableCell>
                          <TableCell className="text-white">${r.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === 'confirmed' ? 'success' : 'warning'} size="sm">{r.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleTransactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="text-white text-xs">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-surface-400 text-xs">{t.description}</TableCell>
                          <TableCell><Badge variant="default" size="sm">{t.type}</Badge></TableCell>
                          <TableCell className="text-surface-400 text-xs">{t.paymentMethod}</TableCell>
                          <TableCell className={`text-right font-medium ${t.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {t.amount > 0 ? '+' : ''}${t.amount.toFixed(2)}
                          </TableCell>
                          <TableCell><Badge variant={t.status === 'completed' ? 'success' : 'warning'} size="sm">{t.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
