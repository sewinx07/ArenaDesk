import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../providers/dashboard_provider.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/loading_indicator.dart';

class RevenueScreen extends StatefulWidget {
  const RevenueScreen({super.key});

  @override
  State<RevenueScreen> createState() => _RevenueScreenState();
}

class _RevenueScreenState extends State<RevenueScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardProvider>().fetchDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 2);

    return Scaffold(
      appBar: CustomAppBar(title: 'Revenue'),
      body: Consumer<DashboardProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.stats.revenueToday == 0) {
            return const LoadingIndicator(message: 'Loading revenue data...');
          }

          final stats = provider.stats;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Today's revenue big number
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.primary,
                        AppTheme.primaryDark,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primary.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Today's Revenue",
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        currencyFormat.format(stats.revenueToday),
                        style: const TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          fontFamily: 'monospace',
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Icon(
                            stats.revenueChange >= 0
                                ? Icons.trending_up
                                : Icons.trending_down,
                            color: stats.revenueChange >= 0
                                ? AppTheme.success
                                : AppTheme.error,
                            size: 20,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${stats.revenueChange.toStringAsFixed(1)}% vs yesterday',
                            style: TextStyle(
                              color: stats.revenueChange >= 0
                                  ? AppTheme.success
                                  : AppTheme.error,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Week comparison
                Row(
                  children: [
                    Expanded(
                      child: _ComparisonCard(
                        label: 'This Week',
                        value: currencyFormat.format(stats.revenueThisWeek),
                        trend: stats.weekChange,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _ComparisonCard(
                        label: 'Last Week',
                        value: currencyFormat.format(stats.revenueLastWeek),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Revenue chart section
                Text(
                  'Last 7 Days',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.cardBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 160,
                        child: stats.dailyRevenue.isEmpty
                            ? const Center(
                                child: Text(
                                  'No data available',
                                  style: TextStyle(color: AppTheme.textSecondary),
                                ),
                              )
                            : Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: List.generate(stats.dailyRevenue.length, (index) {
                                  final maxVal = stats.dailyRevenue.reduce(
                                    (a, b) => a > b ? a : b,
                                  );
                                  final value = stats.dailyRevenue[index];
                                  final height = maxVal > 0 ? (value / maxVal) * 130 : 4.0;

                                  return Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.end,
                                        children: [
                                          if (value > 0)
                                            Text(
                                              '\$${value.toInt()}',
                                              style: const TextStyle(
                                                fontSize: 8,
                                                color: AppTheme.textSecondary,
                                              ),
                                            ),
                                          const SizedBox(height: 4),
                                          Container(
                                            height: height.clamp(4.0, 130.0),
                                            decoration: BoxDecoration(
                                              borderRadius: const BorderRadius.vertical(
                                                top: Radius.circular(4),
                                              ),
                                              gradient: const LinearGradient(
                                                begin: Alignment.bottomCenter,
                                                end: Alignment.topCenter,
                                                colors: [
                                                  AppTheme.primary,
                                                  AppTheme.secondary,
                                                ],
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            stats.dailyLabels.length > index
                                                ? stats.dailyLabels[index]
                                                : '',
                                            style: const TextStyle(
                                              fontSize: 9,
                                              color: AppTheme.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }),
                              ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Payment method breakdown
                Text(
                  'Payment Methods',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.cardBorder),
                  ),
                  child: stats.paymentBreakdown.isEmpty
                      ? const Center(
                          child: Text(
                            'No payment data',
                            style: TextStyle(color: AppTheme.textSecondary),
                          ),
                        )
                      : Column(
                          children: stats.paymentBreakdown.entries.map((entry) {
                            final total = stats.paymentBreakdown.values.fold(0.0, (a, b) => a + b);
                            final pct = total > 0 ? (entry.value / total) * 100 : 0.0;
                            final icons = {
                              'cash': Icons.money,
                              'card': Icons.credit_card,
                              'mobile': Icons.phone_android,
                            };

                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      Icon(
                                        icons[entry.key] ?? Icons.payment,
                                        size: 20,
                                        color: AppTheme.primary,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          entry.key[0].toUpperCase() + entry.key.substring(1),
                                          style: const TextStyle(color: AppTheme.textPrimary),
                                        ),
                                      ),
                                      Text(
                                        currencyFormat.format(entry.value),
                                        style: const TextStyle(
                                          color: AppTheme.textPrimary,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      SizedBox(
                                        width: 48,
                                        child: Text(
                                          '${pct.toStringAsFixed(0)}%',
                                          style: const TextStyle(
                                            color: AppTheme.textSecondary,
                                            fontSize: 12,
                                          ),
                                          textAlign: TextAlign.right,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: LinearProgressIndicator(
                                      value: pct / 100,
                                      backgroundColor: AppTheme.surfaceLight,
                                      valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primary),
                                      minHeight: 6,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                ),

                const SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ComparisonCard extends StatelessWidget {
  final String label;
  final String value;
  final double? trend;

  const _ComparisonCard({
    required this.label,
    required this.value,
    this.trend,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: trend != null && trend! >= 0 ? AppTheme.success : AppTheme.textPrimary,
              fontFamily: 'monospace',
            ),
          ),
          if (trend != null) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(
                  trend! >= 0 ? Icons.trending_up : Icons.trending_down,
                  size: 14,
                  color: trend! >= 0 ? AppTheme.success : AppTheme.error,
                ),
                const SizedBox(width: 2),
                Text(
                  '${trend!.toStringAsFixed(1)}%',
                  style: TextStyle(
                    fontSize: 11,
                    color: trend! >= 0 ? AppTheme.success : AppTheme.error,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
