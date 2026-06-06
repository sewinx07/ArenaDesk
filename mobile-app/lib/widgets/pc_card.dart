import 'package:flutter/material.dart';
import '../models/pc.dart';
import '../theme/app_theme.dart';
import 'status_badge.dart';

class PCCard extends StatelessWidget {
  final PC pc;
  final VoidCallback? onTap;

  const PCCard({super.key, required this.pc, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: pc.isAvailable
                ? AppTheme.success.withOpacity(0.3)
                : pc.isInUse
                    ? AppTheme.secondary.withOpacity(0.3)
                    : AppTheme.cardBorder,
          ),
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Container(
                  width: 10,
                  height: 10,
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
                        blurRadius: 6,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    pc.name,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontSize: 14,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            StatusBadge(status: pc.status, fontSize: 10),
            if (pc.specs.isNotEmpty) ...[
              const SizedBox(height: 8),
              ...pc.specs.entries.take(2).map(
                (e) => Padding(
                  padding: const EdgeInsets.only(bottom: 2),
                  child: Row(
                    children: [
                      Text(
                        '${e.key}: ',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppTheme.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          e.value,
                          style: TextStyle(
                            fontSize: 10,
                            color: AppTheme.textPrimary,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            if (pc.hourlyRate > 0) ...[
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '\$${pc.hourlyRate.toStringAsFixed(2)}/hr',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.primary,
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
