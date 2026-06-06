'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Users, Trophy, DollarSign, Swords } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Tournament } from '@/types';

interface TournamentCardProps {
  tournament: Tournament;
}

const statusVariants: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
  upcoming: 'primary',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'info',
};

const formatVariants: Record<string, string> = {
  single_elimination: 'Single Elim',
  double_elimination: 'Double Elim',
  round_robin: 'Round Robin',
  swiss: 'Swiss',
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <Card className="hover:border-primary-600/30 transition-all duration-200 cursor-pointer group overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-600 to-cyan-600" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 border border-primary-600/20">
                <Swords className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {tournament.name}
                </h3>
                <p className="text-xs text-surface-500">{tournament.game}</p>
              </div>
            </div>
            <Badge variant={statusVariants[tournament.status]} size="sm">
              {tournament.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="default" size="sm">{formatVariants[tournament.format]}</Badge>
            <Badge variant="default" size="sm">${tournament.registrationFee} entry</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-surface-800/30 p-2.5 text-center">
              <Trophy className="h-4 w-4 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">${tournament.prizePool.toLocaleString()}</p>
              <p className="text-[10px] text-surface-500">Prize Pool</p>
            </div>
            <div className="rounded-lg bg-surface-800/30 p-2.5 text-center">
              <Users className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{tournament.maxParticipants}</p>
              <p className="text-[10px] text-surface-500">Players</p>
            </div>
            <div className="rounded-lg bg-surface-800/30 p-2.5 text-center">
              <Calendar className="h-4 w-4 text-primary-400 mx-auto mb-1" />
              <p className="text-xs font-medium text-white">
                {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-surface-500">Start</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
