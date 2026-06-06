import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  final double fontSize;

  const StatusBadge({super.key, required this.status, this.fontSize = 12});

  Color get _color {
    switch (status.toLowerCase()) {
      case 'available':
      case 'active':
      case 'confirmed':
      case 'completed':
      case 'success':
        return AppTheme.success;
      case 'in_use':
      case 'in-use':
      case 'in progress':
      case 'in_progress':
      case 'checked_in':
      case 'checked-in':
        return AppTheme.secondary;
      case 'offline':
      case 'cancelled':
      case 'rejected':
      case 'error':
        return AppTheme.error;
      case 'maintenance':
      case 'reserved':
        return AppTheme.warning;
      case 'pending':
      case 'registration':
        return AppTheme.warning;
      default:
        return AppTheme.textSecondary;
    }
  }

  IconData? get _icon {
    switch (status.toLowerCase()) {
      case 'available':
        return Icons.check_circle;
      case 'in_use':
      case 'in-use':
        return Icons.play_circle;
      case 'offline':
        return Icons.cancel;
      case 'maintenance':
        return Icons.build;
      case 'reserved':
        return Icons.bookmark;
      case 'pending':
      case 'registration':
        return Icons.schedule;
      case 'confirmed':
        return Icons.check_circle;
      case 'completed':
        return Icons.done_all;
      case 'cancelled':
      case 'rejected':
        return Icons.cancel;
      case 'checked_in':
      case 'checked-in':
        return Icons.login;
      default:
        return null;
    }
  }

  String get _label {
    switch (status.toLowerCase()) {
      case 'available':
        return 'Available';
      case 'in_use':
      case 'in-use':
        return 'In Use';
      case 'offline':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      case 'reserved':
        return 'Reserved';
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'checked_in':
      case 'checked-in':
        return 'Checked In';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      case 'registration':
        return 'Registration';
      case 'in_progress':
      case 'in progress':
        return 'In Progress';
      case 'active':
        return 'Active';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _color.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: _color,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: _color.withOpacity(0.5),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
          const SizedBox(width: 6),
          if (_icon != null) ...[
            Icon(_icon, size: fontSize + 2, color: _color),
            const SizedBox(width: 4),
          ],
          Text(
            _label,
            style: TextStyle(
              color: _color,
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
