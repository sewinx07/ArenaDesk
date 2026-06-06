'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Swords, Check } from 'lucide-react';
import type { TournamentMatch, TournamentParticipant } from '@/types';

interface MatchResultFormProps {
  match: TournamentMatch;
  participants: TournamentParticipant[];
  onSubmit: (data: { winnerId: string; score1: number; score2: number }) => void;
}

export default function MatchResultForm({ match, participants, onSubmit }: MatchResultFormProps) {
  const [winnerId, setWinnerId] = useState(match.winnerId || '');
  const [score1, setScore1] = useState(match.score1?.toString() || '0');
  const [score2, setScore2] = useState(match.score2?.toString() || '0');

  const playerOptions = [
    ...(match.player1 ? [{ value: match.player1.id, label: match.player1.playerName }] : []),
    ...(match.player2 ? [{ value: match.player2.id, label: match.player2.playerName }] : []),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      winnerId,
      score1: parseInt(score1) || 0,
      score2: parseInt(score2) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-surface-800/30 p-4 border border-surface-700/30">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary-400" />
          Match Result
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-surface-400">Player 1 Score</label>
            <Input
              type="number"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              placeholder={match.player1?.playerName || 'Player 1'}
              min="0"
            />
            {match.player1 && (
              <p className="text-xs text-surface-500">{match.player1.playerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-surface-400">Player 2 Score</label>
            <Input
              type="number"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              placeholder={match.player2?.playerName || 'Player 2'}
              min="0"
            />
            {match.player2 && (
              <p className="text-xs text-surface-500">{match.player2.playerName}</p>
            )}
          </div>
        </div>

        {playerOptions.length > 0 && (
          <div className="mt-4">
            <Select
              label="Winner"
              options={playerOptions}
              value={winnerId}
              onChange={(e) => setWinnerId(e.target.value)}
              placeholder="Select winner"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" variant="gradient">
          <Check className="h-4 w-4 mr-2" />
          Submit Result
        </Button>
      </div>
    </form>
  );
}
