'use client';

import React from 'react';
import Link from 'next/link';
import { User, Wallet, Star, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoyaltyBadge from './LoyaltyBadge';
import type { Member } from '@/types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member.id}`}>
      <Card className="hover:border-primary-600/30 transition-all duration-200 cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600/20 to-cyan-600/20 border border-primary-600/20">
                <User className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-surface-500">{member.email}</p>
              </div>
            </div>
            <LoyaltyBadge tier={member.membershipTier} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mb-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                Points
              </div>
              <p className="text-sm font-medium text-white">{member.loyaltyPoints.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-surface-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mb-1">
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                Wallet
              </div>
              <p className="text-sm font-medium text-white">${member.walletBalance.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-surface-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mb-1">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                Sessions
              </div>
              <p className="text-sm font-medium text-white">{member.totalSessions}</p>
            </div>
            <div className="rounded-lg bg-surface-800/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary-400" />
                Spent
              </div>
              <p className="text-sm font-medium text-white">${member.totalSpent.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-700/30 flex items-center justify-between">
            <span className="text-xs text-surface-500">
              Member since {new Date(member.joinDate).toLocaleDateString()}
            </span>
            {member.lastVisit && (
              <span className="text-xs text-surface-400">
                Last: {new Date(member.lastVisit).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
