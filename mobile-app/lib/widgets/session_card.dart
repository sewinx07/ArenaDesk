import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/session.dart';
import '../theme/app_theme.dart';
import 'status_badge.dart';

class SessionCard extends StatefulWidget {
  final Session session;
  final VoidCallback? onTap;

  const SessionCard({super.key, required this.session, this.onTap});

  @override
  State<SessionCard> createState() => _SessionCardState();
}

class _SessionCardState extends State<SessionCard> {
  late DateTime _now;

  @override
  void initState() {
    super.initState();
    _now = DateTime.now();
  }

  @override
  Widget build(BuildContext context) {
    final session = widget.session;
    final duration = session.duration;
    final hours = duration.inMinutes / 60.0;
    final estimatedCost = session.totalPrice > 0
        ? session.totalPrice
        : hours * 5.0; // Default rate estimation

    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: session.isActive
                ? AppTheme.secondary.withOpacity(0.3)
                : AppTheme.cardBorder,
          ),
        ),
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: session.isActive
                    ? AppTheme.secondary.withOpacity(0.15)
                    : AppTheme.surfaceLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.desktop_windows, color: AppTheme.secondary, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          session.pcName.isNotEmpty ? session.pcName : 'PC ${session.pcId}',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 15),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      StatusBadge(status: session.status, fontSize: 10),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.timer, size: 14, color: AppTheme.textSecondary),
                      const SizedBox(width: 4),
                      Text(
                        session.formattedDuration,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: session.isActive ? AppTheme.secondary : AppTheme.textSecondary,
                          fontFamily: 'monospace',
                        ),
                      ),
                      const Spacer(),
                      if (session.isActive) ...[
                        const Icon(Icons.attach_money, size: 14, color: AppTheme.success),
                        const SizedBox(width: 2),
                        Text(
                          '\$${estimatedCost.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.success,
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (session.userName.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.person, size: 12, color: AppTheme.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          session.userName,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            if (widget.onTap != null) ...[
              const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
            ],
          ],
        ),
      ),
    );
  }
}
