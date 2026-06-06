'use client';

import React, { useState } from 'react';
import { Plus, Swords, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TournamentCard from '@/components/tournaments/TournamentCard';
import type { Tournament, TournamentStatus } from '@/types';

const sampleTournaments: Tournament[] = [
  { id: '1', cafeId: '1', name: 'Valorant Summer Cup', game: 'Valorant', format: 'double_elimination', status: 'in_progress', maxParticipants: 32, minParticipants: 8, registrationFee: 10, prizePool: 500, prizeDistribution: '1st: $300, 2nd: $150, 3rd: $50', startDate: '2026-06-01T10:00:00Z', endDate: '2026-06-07T22:00:00Z', registrationDeadline: '2026-05-30T23:59:00Z', description: 'The ultimate Valorant tournament. Open to all skill levels.', rules: 'Standard Valorant competitive rules apply.', createdBy: 'staff-1', createdAt: '2026-05-15T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
  { id: '2', cafeId: '1', name: 'CS2 Friday Night Showdown', game: 'Counter-Strike 2', format: 'single_elimination', status: 'upcoming', maxParticipants: 16, minParticipants: 4, registrationFee: 5, prizePool: 250, prizeDistribution: '1st: $150, 2nd: $75, 3rd: $25', startDate: '2026-06-12T18:00:00Z', endDate: '2026-06-12T23:00:00Z', registrationDeadline: '2026-06-11T23:59:00Z', description: 'Weekly CS2 tournament. Bring your A-game!', rules: 'Standard competitive rules. Anti-cheat enabled.', createdBy: 'staff-1', createdAt: '2026-05-20T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z' },
  { id: '3', cafeId: '1', name: 'League of Legends Championship', game: 'League of Legends', format: 'round_robin', status: 'upcoming', maxParticipants: 24, minParticipants: 6, registrationFee: 15, prizePool: 1000, prizeDistribution: '1st: $500, 2nd: $300, 3rd: $150, 4th: $50', startDate: '2026-07-01T10:00:00Z', endDate: '2026-07-14T22:00:00Z', registrationDeadline: '2026-06-28T23:59:00Z', description: 'Major LoL tournament with big prizes!', rules: 'Standard tournament rules. 5v5 teams only.', createdBy: 'staff-1', createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
  { id: '4', cafeId: '1', name: 'FIFA 25 Cup', game: 'FIFA 25', format: 'single_elimination', status: 'completed', maxParticipants: 8, minParticipants: 4, registrationFee: 5, prizePool: 100, prizeDistribution: '1st: $60, 2nd: $40', startDate: '2026-05-20T14:00:00Z', endDate: '2026-05-20T20:00:00Z', registrationDeadline: '2026-05-19T23:59:00Z', description: 'FIFA tournament for all football fans!', rules: 'Standard FIFA rules. 5 min halves.', createdBy: 'staff-1', createdAt: '2026-05-10T10:00:00Z', updatedAt: '2026-05-20T20:00:00Z' },
  { id: '5', cafeId: '1', name: 'Tekken 8 Battle Arena', game: 'Tekken 8', format: 'double_elimination', status: 'completed', maxParticipants: 16, minParticipants: 4, registrationFee: 5, prizePool: 200, prizeDistribution: '1st: $120, 2nd: $60, 3rd: $20', startDate: '2026-05-15T16:00:00Z', endDate: '2026-05-15T22:00:00Z', registrationDeadline: '2026-05-14T23:59:00Z', description: 'Fighting game tournament!', rules: 'Standard Tekken 8 competitive rules.', createdBy: 'staff-1', createdAt: '2026-05-01T10:00:00Z', updatedAt: '2026-05-15T22:00:00Z' },
];

const statusSections = [
  { id: 'in_progress', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = sampleTournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournaments</h1>
          <p className="text-sm text-surface-400 mt-1">
            Create and manage esports tournaments, brackets, and matches.
          </p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          type="text"
          placeholder="Search tournaments by name or game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {statusSections.map((section) => {
        const sectionTournaments = filtered.filter((t) => t.status === section.id);
        if (sectionTournaments.length === 0) return null;
        return (
          <div key={section.id}>
            <h2 className="text-lg font-semibold text-white mb-4">{section.label} Tournaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sectionTournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Swords className="h-12 w-12 text-surface-600 mb-3" />
          <p className="text-surface-500">No tournaments found</p>
          <Button variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create your first tournament
          </Button>
        </div>
      )}
    </div>
  );
}
