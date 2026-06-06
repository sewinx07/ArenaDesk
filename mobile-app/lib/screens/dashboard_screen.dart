import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/dashboard_provider.dart';
import '../providers/session_provider.dart';
import '../widgets/stats_card.dart';
import '../widgets/session_card.dart';
import '../widgets/loading_indicator.dart';
import '../widgets/custom_app_bar.dart';
import 'login_screen.dart';
import 'pcs_screen.dart';
import 'revenue_screen.dart';
import 'reservations_screen.dart';
import 'tournaments_screen.dart';
import 'profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    _DashboardTab(),
    PCsScreen(),
    ReservationsScreen(),
    TournamentsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardProvider>().fetchDashboard();
      context.read<SessionProvider>().fetchActiveSessions();
      context.read<SessionProvider>().startTimer();
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.desktop_windows), label: 'PCs'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Reservations'),
          BottomNavigationBarItem(icon: Icon(Icons.emoji_events), label: 'Tournaments'),
        ],
      ),
    );
  }
}

class _DashboardTab extends StatefulWidget {
  const _DashboardTab();

  @override
  State<_DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<_DashboardTab> {
  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 0);

    return Scaffold(
      appBar: CustomAppBar(
        title: 'ArenaDesk OS',
        notificationCount: 3,
        onNotificationTap: () {},
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ProfileScreen()),
              );
            },
          ),
        ],
      ),
      body: Consumer2<DashboardProvider, SessionProvider>(
        builder: (context, dashboard, sessionProvider, _) {
          if (dashboard.isLoading && dashboard.stats.revenueToday == 0) {
            return const LoadingIndicator(message: 'Loading dashboard...');
          }

          return RefreshIndicator(
            onRefresh: dashboard.refreshData,
            color: AppTheme.primary,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats row
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        Expanded(
                          child: StatsCard(
                            icon: Icons.attach_money,
                            label: 'Revenue Today',
                            value: currencyFormat.format(dashboard.stats.revenueToday),
                            trend: dashboard.stats.revenueChange,
                            accentColor: AppTheme.success,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: StatsCard(
                            icon: Icons.desktop_windows,
                            label: 'Active PCs',
                            value: '${dashboard.stats.activePCs}/${dashboard.stats.totalPCs}',
                            accentColor: AppTheme.secondary,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: StatsCard(
                            icon: Icons.videogame_asset,
                            label: 'Sessions',
                            value: '${dashboard.stats.activeSessions}',
                            accentColor: AppTheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Active Sessions section
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Row(
                      children: [
                        Text(
                          'Active Sessions',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const Spacer(),
                        if (sessionProvider.activeSessions.isNotEmpty)
                          Text(
                            '${sessionProvider.activeSessions.length} running',
                            style: const TextStyle(
                              color: AppTheme.secondary,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (sessionProvider.activeSessions.isEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
                      child: Center(
                        child: Column(
                          children: [
                            Icon(Icons.power_off, size: 48, color: AppTheme.textSecondary.withOpacity(0.5)),
                            const SizedBox(height: 8),
                            Text('No active sessions', style: Theme.of(context).textTheme.bodyMedium),
                          ],
                        ),
                      ),
                    )
                  else
                    ...sessionProvider.activeSessions.map(
                      (session) => SessionCard(session: session),
                    ),

                  const SizedBox(height: 24),

                  // Quick actions
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Text(
                      'Quick Actions',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        _QuickAction(
                          icon: Icons.add_circle_outline,
                          label: 'New Session',
                          color: AppTheme.primary,
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const PCsScreen()),
                          ),
                        ),
                        const SizedBox(width: 8),
                        _QuickAction(
                          icon: Icons.checklist,
                          label: 'Approve Reservations',
                          color: AppTheme.warning,
                          onTap: () {},
                        ),
                        const SizedBox(width: 8),
                        _QuickAction(
                          icon: Icons.emoji_events,
                          label: 'Tournaments',
                          color: AppTheme.secondary,
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Peak hours / mini chart
                  if (dashboard.stats.dailyRevenue.isNotEmpty) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        children: [
                          Text(
                            'Weekly Revenue',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const Spacer(),
                          Text(
                            '\$${dashboard.stats.revenueThisWeek.toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: AppTheme.success,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: _WeeklyRevenueChart(
                        data: dashboard.stats.dailyRevenue,
                        labels: dashboard.stats.dailyLabels,
                      ),
                    ),
                  ],

                  const SizedBox(height: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppTheme.cardBorder),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textPrimary,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _WeeklyRevenueChart extends StatelessWidget {
  final List<double> data;
  final List<String> labels;

  const _WeeklyRevenueChart({required this.data, required this.labels});

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const SizedBox.shrink();

    final maxValue = data.reduce((a, b) => a > b ? a : b);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.cardBorder),
      ),
      child: SizedBox(
        height: 120,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(data.length, (index) {
            final value = data[index];
            final barHeight = maxValue > 0 ? (value / maxValue) * 100 : 4.0;

            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 3),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (value > 0)
                      Text(
                        '\$${value.toInt()}',
                        style: const TextStyle(fontSize: 9, color: AppTheme.textSecondary),
                      ),
                    const SizedBox(height: 4),
                    Container(
                      height: barHeight.clamp(4.0, 100.0),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        gradient: const LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [AppTheme.primary, AppTheme.secondary],
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      labels.length > index ? labels[index] : '',
                      style: const TextStyle(fontSize: 9, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}
