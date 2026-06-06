import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../providers/pc_provider.dart';
import '../providers/session_provider.dart';
import '../widgets/status_badge.dart';
import '../widgets/custom_app_bar.dart';

class PCDetailScreen extends StatefulWidget {
  const PCDetailScreen({super.key});

  @override
  State<PCDetailScreen> createState() => _PCDetailScreenState();
}

class _PCDetailScreenState extends State<PCDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return Consumer2<PCProvider, SessionProvider>(
      builder: (context, pcProvider, sessionProvider, _) {
        final pc = pcProvider.selectedPC;
        if (pc == null) {
          return Scaffold(
            appBar: CustomAppBar(title: 'PC Detail', showBack: true),
            body: const Center(child: Text('PC not found')),
          );
        }

        final activeSession = sessionProvider.activeSessions
            .where((s) => s.pcId == pc.id)
            .toList();

        return Scaffold(
          appBar: CustomAppBar(title: pc.name, showBack: true),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // PC Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.cardBorder),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: pc.isAvailable
                              ? AppTheme.success
                              : pc.isInUse
                                  ? AppTheme.secondary
                                  : pc.isMaintenance
                                      ? AppTheme.warning
                                      : AppTheme.error,
                          boxShadow: [
                            BoxShadow(
                              color: (pc.isAvailable
                                      ? AppTheme.success
                                      : pc.isInUse
                                          ? AppTheme.secondary
                                          : pc.isMaintenance
                                              ? AppTheme.warning
                                              : AppTheme.error)
                                  .withOpacity(0.5),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              pc.name,
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                            const SizedBox(height: 4),
                            StatusBadge(status: pc.status),
                          ],
                        ),
                      ),
                      if (pc.hourlyRate > 0)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '\$${pc.hourlyRate.toStringAsFixed(2)}/hr',
                            style: const TextStyle(
                              color: AppTheme.primary,
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Specs section
                if (pc.specs.isNotEmpty) ...[
                  Text('Specifications', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.cardBorder),
                    ),
                    child: Column(
                      children: pc.specs.entries.map((e) {
                        IconData icon;
                        switch (e.key.toLowerCase()) {
                          case 'cpu':
                          case 'processor':
                            icon = Icons.memory;
                            break;
                          case 'gpu':
                          case 'graphics':
                            icon = Icons.videogame_asset;
                            break;
                          case 'ram':
                          case 'memory':
                            icon = Icons.storage;
                            break;
                          case 'storage':
                            icon = Icons.disc_full;
                            break;
                          default:
                            icon = Icons.info;
                        }
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Row(
                            children: [
                              Icon(icon, size: 18, color: AppTheme.primary),
                              const SizedBox(width: 12),
                              Text(
                                e.key,
                                style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                              const Spacer(),
                              Text(
                                e.value,
                                style: const TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Active session info
                if (activeSession.isNotEmpty) ...[
                  Text('Current Session', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.secondary.withOpacity(0.3)),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.timer, color: AppTheme.secondary),
                            const SizedBox(width: 8),
                            Text(
                              activeSession.first.formattedDuration,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.secondary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.attach_money, color: AppTheme.success),
                            const SizedBox(width: 8),
                            Text(
                              '\$${activeSession.first.totalPrice.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.success,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Action buttons
                Text('Actions', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _ActionButton(
                        icon: Icons.play_arrow,
                        label: 'Start Session',
                        color: AppTheme.success,
                        enabled: pc.isAvailable,
                        onTap: () {
                          if (pc.isAvailable) {
                            sessionProvider.startSession(pc.id);
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _ActionButton(
                        icon: Icons.stop,
                        label: 'End Session',
                        color: AppTheme.error,
                        enabled: pc.isInUse,
                        onTap: () {
                          if (activeSession.isNotEmpty) {
                            sessionProvider.endSession(activeSession.first.id);
                          }
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _ActionButton(
                        icon: Icons.lock_outline,
                        label: 'Lock PC',
                        color: AppTheme.warning,
                        enabled: pc.isInUse || pc.isAvailable,
                        onTap: () {
                          pcProvider.updatePCStatus(pc.id, 'maintenance');
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _ActionButton(
                        icon: Icons.lock_open,
                        label: 'Unlock PC',
                        color: AppTheme.secondary,
                        enabled: pc.isMaintenance,
                        onTap: () {
                          pcProvider.updatePCStatus(pc.id, 'available');
                        },
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Usage statistics placeholder
                Text('Usage Statistics', style: Theme.of(context).textTheme.titleMedium),
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
                      Row(
                        children: [
                          _UsageStat(label: 'Today', value: '3.5h', color: AppTheme.primary),
                          _UsageStat(label: 'This Week', value: '18.2h', color: AppTheme.secondary),
                          _UsageStat(label: 'This Month', value: '72h', color: AppTheme.success),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Mini bar chart for daily usage
                      SizedBox(
                        height: 60,
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [4.0, 6.0, 3.5, 7.0, 5.5, 4.5, 3.0].map((v) {
                            return Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 3),
                                child: Container(
                                  height: (v / 7.0) * 50,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(4),
                                    color: AppTheme.primary.withOpacity(0.6),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) {
                          return Expanded(
                            child: Text(
                              d,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 9, color: AppTheme.textSecondary),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final bool enabled;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: enabled ? color.withOpacity(0.15) : AppTheme.surfaceLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: enabled ? color.withOpacity(0.4) : AppTheme.cardBorder,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: enabled ? color : AppTheme.textSecondary, size: 22),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: enabled ? color : AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _UsageStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _UsageStat({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: color)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
        ],
      ),
    );
  }
}
