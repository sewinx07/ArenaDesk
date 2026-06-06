import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../models/reservation.dart';
import '../providers/reservation_provider.dart';
import '../widgets/status_badge.dart';
import '../widgets/custom_app_bar.dart';

class ReservationDetailScreen extends StatelessWidget {
  final Reservation reservation;

  const ReservationDetailScreen({super.key, required this.reservation});

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('EEEE, MMMM d, yyyy');
    final timeFormat = DateFormat('h:mm a');

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Reservation Details',
        showBack: true,
      ),
      body: Consumer<ReservationProvider>(
        builder: (context, provider, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Customer info card
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
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Icon(Icons.person, color: AppTheme.primary, size: 28),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              reservation.userName.isNotEmpty
                                  ? reservation.userName
                                  : 'Guest',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 4),
                            StatusBadge(status: reservation.status),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Reservation details
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.cardBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Details', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 16),
                      _DetailRow(
                        icon: Icons.desktop_windows,
                        label: 'PC',
                        value: reservation.pcName.isNotEmpty
                            ? reservation.pcName
                            : 'PC ${reservation.pcId}',
                      ),
                      const SizedBox(height: 12),
                      _DetailRow(
                        icon: Icons.calendar_today,
                        label: 'Date',
                        value: dateFormat.format(reservation.timeSlot),
                      ),
                      const SizedBox(height: 12),
                      _DetailRow(
                        icon: Icons.schedule,
                        label: 'Time',
                        value: timeFormat.format(reservation.timeSlot),
                      ),
                      const SizedBox(height: 12),
                      _DetailRow(
                        icon: Icons.timer,
                        label: 'Duration',
                        value: '2 hours',
                      ),
                      const SizedBox(height: 12),
                      _DetailRow(
                        icon: Icons.attach_money,
                        label: 'Estimated Cost',
                        value: '\$10.00',
                        valueColor: AppTheme.success,
                      ),
                      if (reservation.notes.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        _DetailRow(
                          icon: Icons.notes,
                          label: 'Notes',
                          value: reservation.notes,
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Action buttons based on status
                Text('Actions', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),

                if (reservation.isPending) ...[
                  Row(
                    children: [
                      Expanded(
                        child: _ActionBtn(
                          icon: Icons.check,
                          label: 'Approve',
                          color: AppTheme.success,
                          onTap: () {
                            provider.approveReservation(reservation.id);
                            Navigator.pop(context);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ActionBtn(
                          icon: Icons.close,
                          label: 'Reject',
                          color: AppTheme.error,
                          onTap: () {
                            provider.rejectReservation(reservation.id);
                            Navigator.pop(context);
                          },
                        ),
                      ),
                    ],
                  ),
                ],

                if (reservation.isConfirmed) ...[
                  _ActionBtn(
                    icon: Icons.login,
                    label: 'Check In',
                    color: AppTheme.secondary,
                    fullWidth: true,
                    onTap: () {
                      provider.checkInReservation(reservation.id);
                      Navigator.pop(context);
                    },
                  ),
                  const SizedBox(height: 8),
                  _ActionBtn(
                    icon: Icons.cancel_outlined,
                    label: 'Cancel Reservation',
                    color: AppTheme.error,
                    fullWidth: true,
                    onTap: () {
                      provider.cancelReservation(reservation.id);
                      Navigator.pop(context);
                    },
                  ),
                ],

                if (reservation.isCheckedIn) ...[
                  _ActionBtn(
                    icon: Icons.done_all,
                    label: 'Complete',
                    color: AppTheme.success,
                    fullWidth: true,
                    onTap: () {
                      provider.completeReservation(reservation.id);
                      Navigator.pop(context);
                    },
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppTheme.primary),
        const SizedBox(width: 12),
        SizedBox(
          width: 80,
          child: Text(
            label,
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              color: valueColor ?? AppTheme.textPrimary,
              fontWeight: FontWeight.w500,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  final bool fullWidth;

  const _ActionBtn({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
    this.fullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.4)),
          ),
          child: Row(
            mainAxisAlignment: fullWidth ? MainAxisAlignment.center : MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
