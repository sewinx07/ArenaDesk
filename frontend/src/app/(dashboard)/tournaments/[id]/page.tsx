'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Swords, Calendar, Users, Trophy, DollarSign, Clock, Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import BracketViewer from '@/components/tournaments/BracketViewer';
import MatchResultForm from '@/components/tournaments/MatchResultForm';
import type { Tournament, TournamentParticipant, TournamentMatch } from '@/types';

const sampleTournament: Tournament = {
  id: '1', cafeId: '1', name: 'Valorant Summer Cup', game: 'Valorant', format: 'double_elimination',
  status: 'in_progress', maxParticipants: 32, minParticipants: 8, registrationFee: 10, prizePool: 500,
  prizeDistribution: '1st: $300, 2nd: $150, 3rd: $50',
  startDate: '2026-06-01T10:00:00Z', endDate: '2026-06-07T22:00:00Z',
  registrationDeadline: '2026-05-30T23:59:00Z', description: 'The ultimate Valorant tournament.',
  rules: 'Standard Valorant competitive rules apply. All matches are BO3. Grand finals are BO5.',
  createdBy: 'staff-1', createdAt: '', updatedAt: '',
};

const sampleParticipants: TournamentParticipant[] = Array.from({ length: 8 }, (_, i) => ({
  id: `p-${i}`, tournamentId: '1',
  playerName: `Player ${i + 1}`, playerEmail: `player${i + 1}@example.com`,
  seed: i + 1, status: i < 6 ? 'confirmed' : i === 6 ? 'eliminated' : 'winner',
  paid: true, registeredAt: new Date().toISOString(),
}));

const sampleMatches: TournamentMatch[] = [
  { id: 'm1', tournamentId: '1', round: 1, matchNumber: 1, player1Id: 'p-0', player2Id: 'p-1', player1: sampleParticipants[0], player2: sampleParticipants[1], score1: 2, score2: 1, winnerId: 'p-0', status: 'completed', createdAt: '', updatedAt: '' },
  { id: 'm2', tournamentId: '1', round: 1, matchNumber: 2, player1Id: 'p-2', player2Id: 'p-3', player1: sampleParticipants[2], player2: sampleParticipants[3], score1: 0, score2: 2, winnerId: 'p-3', status: 'completed', createdAt: '', updatedAt: '' },
  { id: 'm3', tournamentId: '1', round: 1, matchNumber: 3, player1Id: 'p-4', player2Id: 'p-5', player1: sampleParticipants[4], player2: sampleParticipants[5], status: 'scheduled', scheduledTime: '2026-06-06T16:00:00Z', createdAt: '', updatedAt: '' },
  { id: 'm4', tournamentId: '1', round: 2, matchNumber: 4, player1Id: 'p-0', player2Id: 'p-3', player1: sampleParticipants[0], player2: sampleParticipants[3], status: 'scheduled', createdAt: '', updatedAt: '' },
];

export default function TournamentDetailPage() {
  const params = useParams();
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handleSubmitResult = (data: { winnerId: string; score1: number; score2: number }) => {
    setShowResultDialog(false);
    setSelectedMatch(null);
  };

  const confirmedPlayers = sampleParticipants.filter((p) => p.status === 'confirmed');
  const registeredCount = sampleParticipants.filter((p) => p.status === 'registered' || p.status === 'confirmed').length;
  const daysUntilEnd = Math.ceil((new Date(sampleTournament.endDate).getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Link href="/tournaments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{sampleTournament.name}</h1>
            <Badge variant={sampleTournament.status === 'in_progress' ? 'warning' : sampleTournament.status === 'upcoming' ? 'primary' : 'success'} size="lg">
              {sampleTournament.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-surface-400">{sampleTournament.game}</p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add Match
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <Card><CardContent className="p-4 text-center">
          <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">${sampleTournament.prizePool}</p>
          <p className="text-xs text-surface-500">Prize Pool</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Users className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{registeredCount}/{sampleTournament.maxParticipants}</p>
          <p className="text-xs text-surface-500">Players</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Calendar className="h-5 w-5 text-primary-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{daysUntilEnd}d</p>
          <p className="text-xs text-surface-500">Remaining</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <DollarSign className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">${sampleTournament.registrationFee}</p>
          <p className="text-xs text-surface-500">Entry Fee</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Swords className="h-5 w-5 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white capitalize">{sampleTournament.format.replace('_', ' ')}</p>
          <p className="text-xs text-surface-500">Format</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value="bracket">
            <TabsList>
              <TabsTrigger value="bracket">Bracket</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>

            <TabsContent value="bracket">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Bracket</CardTitle>
                  <CardDescription>Double elimination bracket - {sampleMatches.length} matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <BracketViewer matches={sampleMatches} participants={sampleParticipants} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matches">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Matches</CardTitle>
                  <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
                    <DialogTrigger asChild>
                      <Button variant="cyan" size="sm">Submit Result</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Match Result</DialogTitle>
                        <DialogDescription>Enter the scores and select winner</DialogDescription>
                      </DialogHeader>
                      {selectedMatch && (
                        <MatchResultForm match={selectedMatch} participants={sampleParticipants} onSubmit={handleSubmitResult} />
                      )}
                      {!selectedMatch && (
                        <MatchResultForm
                          match={sampleMatches[2]}
                          participants={sampleParticipants}
                          onSubmit={handleSubmitResult}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleMatches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between rounded-lg border border-surface-700/30 bg-surface-800/30 p-3 cursor-pointer hover:bg-surface-800/50 transition-colors"
                        onClick={() => { setSelectedMatch(match); setShowResultDialog(true); }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center min-w-[120px]">
                            <p className={`text-sm font-medium ${match.winnerId === match.player1Id ? 'text-emerald-400' : 'text-white'}`}>
                              {match.player1?.playerName || 'TBD'}
                            </p>
                          </div>
                          <div className="text-center">
                            {match.score1 !== undefined ? (
                              <span className="text-lg font-bold text-white">
                                {match.score1} - {match.score2}
                              </span>
                            ) : (
                              <span className="text-sm text-surface-500">vs</span>
                            )}
                          </div>
                          <div className="text-center min-w-[120px]">
                            <p className={`text-sm font-medium ${match.winnerId === match.player2Id ? 'text-emerald-400' : 'text-white'}`}>
                              {match.player2?.playerName || 'TBD'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={match.status === 'completed' ? 'success' : match.status === 'in_progress' ? 'warning' : 'default'} size="sm">
                          {match.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Participants ({sampleParticipants.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {sampleParticipants.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-surface-800/30 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-surface-500 w-5">#{p.seed}</span>
                      <span className="text-sm text-white">{p.playerName}</span>
                    </div>
                    <Badge variant={p.status === 'winner' ? 'success' : p.status === 'eliminated' ? 'danger' : 'primary'} size="sm">
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tournament Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-surface-500 text-xs">Description</p>
                <p className="text-surface-300">{sampleTournament.description}</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Prize Distribution</p>
                <p className="text-surface-300">{sampleTournament.prizeDistribution}</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Registration Deadline</p>
                <p className="text-surface-300">
                  {new Date(sampleTournament.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Rules</p>
                <p className="text-surface-300 text-xs">{sampleTournament.rules}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
