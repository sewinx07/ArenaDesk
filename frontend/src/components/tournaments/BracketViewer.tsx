'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { TournamentMatch, TournamentParticipant } from '@/types';

interface BracketViewerProps {
  matches: TournamentMatch[];
  participants: TournamentParticipant[];
}

function BracketMatch({ match, round, maxRound }: { match: TournamentMatch; round: number; maxRound: number }) {
  const isFinal = round === maxRound;
  const isBye = !match.player2Id;

  return (
    <div className={cn(
      'rounded-lg border p-3 min-w-[180px] transition-colors',
      match.status === 'completed' ? 'border-emerald-600/30 bg-emerald-600/5' :
      match.status === 'in_progress' ? 'border-amber-600/30 bg-amber-600/5' :
      'border-surface-700/30 bg-surface-800/30',
      isFinal && 'border-primary-600/50 bg-primary-600/5',
    )}>
      <div className={cn(
        'text-[10px] font-medium uppercase tracking-wider mb-2',
        isFinal ? 'text-primary-400' : 'text-surface-500'
      )}>
        {isFinal ? 'Final' : `Round ${round}`} {isFinal && '🏆'}
      </div>

      <div className={cn(
        'flex items-center justify-between px-2 py-1.5 rounded text-sm',
        match.winnerId === match.player1Id ? 'bg-emerald-600/10 text-emerald-300' : 'text-surface-300'
      )}>
        <span className="truncate max-w-[100px]">{match.player1?.playerName || 'TBD'}</span>
        {match.score1 !== undefined && (
          <span className={cn('ml-2 font-bold', match.winnerId === match.player1Id && 'text-emerald-400')}>
            {match.score1}
          </span>
        )}
      </div>

      <div className="border-t border-surface-700/30 my-1" />

      <div className={cn(
        'flex items-center justify-between px-2 py-1.5 rounded text-sm',
        match.winnerId === match.player2Id ? 'bg-emerald-600/10 text-emerald-300' : 'text-surface-300'
      )}>
        <span className="truncate max-w-[100px]">
          {isBye ? '—' : (match.player2?.playerName || 'TBD')}
        </span>
        {match.score2 !== undefined && (
          <span className={cn('ml-2 font-bold', match.winnerId === match.player2Id && 'text-emerald-400')}>
            {match.score2}
          </span>
        )}
      </div>

      {match.status === 'scheduled' && match.scheduledTime && (
        <div className="mt-2 text-[10px] text-surface-500 text-center">
          {new Date(match.scheduledTime).toLocaleString()}
        </div>
      )}

      <div className="mt-2 flex justify-center">
        <Badge
          variant={
            match.status === 'completed' ? 'success' :
            match.status === 'in_progress' ? 'warning' :
            'default'
          }
          size="sm"
        >
          {match.status.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}

export default function BracketViewer({ matches, participants }: BracketViewerProps) {
  const maxRound = Math.max(...matches.map((m) => m.round), 1);

  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => ({
    round,
    matches: matches.filter((m) => m.round === round),
  }));

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-surface-500">
        <p>No matches have been created yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max px-4">
        {rounds.map(({ round, matches: roundMatches }) => (
          <div key={round} className="flex flex-col justify-around gap-6">
            <div className="text-center mb-2">
              <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                {round === maxRound ? 'Finals' : `Round ${round}`}
              </span>
            </div>
            {roundMatches.map((match) => (
              <BracketMatch key={match.id} match={match} round={round} maxRound={maxRound} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
