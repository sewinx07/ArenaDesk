import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../models/tournament.dart';
import '../providers/tournament_provider.dart';
import '../widgets/status_badge.dart';
import '../widgets/loading_indicator.dart';
import '../widgets/empty_state.dart';
import '../widgets/custom_app_bar.dart';
import 'tournament_detail_screen.dart';

class TournamentsScreen extends StatefulWidget {
  const TournamentsScreen({super.key});

  @override
  State<TournamentsScreen> createState() => _TournamentsScreenState();
}

class _TournamentsScreenState extends State<TournamentsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TournamentProvider>().fetchTournaments();
    });
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('MMM d, yyyy');

    return Scaffold(
      appBar: CustomAppBar(title: 'Tournaments'),
      body: Consumer<TournamentProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.tournaments.isEmpty) {
            return const LoadingIndicator(message: 'Loading tournaments...');
          }

          if (provider.tournaments.isEmpty) {
            return const EmptyState(
              icon: Icons.emoji_events,
              title: 'No tournaments',
              subtitle: 'Create a tournament to get started',
            );
          }

          return RefreshIndicator(
            onRefresh: provider.fetchTournaments,
            color: AppTheme.primary,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.tournaments.length,
              itemBuilder: (context, index) {
                final tournament = provider.tournaments[index];
                return _TournamentCard(
                  tournament: tournament,
                  dateFormat: dateFormat,
                  onTap: () {
                    provider.selectTournament(tournament);
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const TournamentDetailScreen(),
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Create tournament dialog
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _TournamentCard extends StatelessWidget {
  final Tournament tournament;
  final DateFormat dateFormat;
  final VoidCallback onTap;

  const _TournamentCard({
    required this.tournament,
    required this.dateFormat,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.cardBorder),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.warning.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.emoji_events, color: AppTheme.warning, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        tournament.name,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        tournament.game,
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                StatusBadge(status: tournament.status, fontSize: 10),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                _InfoChip(
                  icon: Icons.people,
                  label: '${tournament.participants}/${tournament.maxParticipants}',
                ),
                const SizedBox(width: 16),
                _InfoChip(
                  icon: Icons.attach_money,
                  label: '\$${tournament.prizePool.toStringAsFixed(0)}',
                ),
                const SizedBox(width: 16),
                _InfoChip(
                  icon: Icons.calendar_today,
                  label: dateFormat.format(tournament.startDate),
                ),
              ],
            ),
            if (tournament.format.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  tournament.formatLabel,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppTheme.primary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: AppTheme.textSecondary),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
        ),
      ],
    );
  }
}
