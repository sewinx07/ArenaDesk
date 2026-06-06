class DashboardStats {
  final double revenueToday;
  final double revenueYesterday;
  final double revenueThisWeek;
  final double revenueLastWeek;
  final int activePCs;
  final int totalPCs;
  final int totalSessions;
  final int activeSessions;
  final int pendingReservations;
  final List<double> dailyRevenue;
  final List<String> dailyLabels;
  final Map<String, double> paymentBreakdown;

  const DashboardStats({
    this.revenueToday = 0.0,
    this.revenueYesterday = 0.0,
    this.revenueThisWeek = 0.0,
    this.revenueLastWeek = 0.0,
    this.activePCs = 0,
    this.totalPCs = 0,
    this.totalSessions = 0,
    this.activeSessions = 0,
    this.pendingReservations = 0,
    this.dailyRevenue = const [],
    this.dailyLabels = const [],
    this.paymentBreakdown = const {},
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      revenueToday: (json['revenueToday'] ?? json['revenue_today'] ?? 0).toDouble(),
      revenueYesterday: (json['revenueYesterday'] ?? json['revenue_yesterday'] ?? 0).toDouble(),
      revenueThisWeek: (json['revenueThisWeek'] ?? json['revenue_this_week'] ?? 0).toDouble(),
      revenueLastWeek: (json['revenueLastWeek'] ?? json['revenue_last_week'] ?? 0).toDouble(),
      activePCs: (json['activePCs'] ?? json['active_pcs'] ?? 0).toInt(),
      totalPCs: (json['totalPCs'] ?? json['total_pcs'] ?? 0).toInt(),
      totalSessions: (json['totalSessions'] ?? json['total_sessions'] ?? 0).toInt(),
      activeSessions: (json['activeSessions'] ?? json['active_sessions'] ?? 0).toInt(),
      pendingReservations: (json['pendingReservations'] ?? json['pending_reservations'] ?? 0).toInt(),
      dailyRevenue: json['dailyRevenue'] is List
          ? (json['dailyRevenue'] as List).map((e) => (e ?? 0).toDouble()).toList()
          : json['daily_revenue'] is List
              ? (json['daily_revenue'] as List).map((e) => (e ?? 0).toDouble()).toList()
              : [],
      dailyLabels: json['dailyLabels'] is List
          ? (json['dailyLabels'] as List).map((e) => e.toString()).toList()
          : json['daily_labels'] is List
              ? (json['daily_labels'] as List).map((e) => e.toString()).toList()
              : [],
      paymentBreakdown: json['paymentBreakdown'] is Map
          ? (json['paymentBreakdown'] as Map).map((k, v) => MapEntry(k.toString(), (v ?? 0).toDouble()))
          : json['payment_breakdown'] is Map
              ? (json['payment_breakdown'] as Map).map((k, v) => MapEntry(k.toString(), (v ?? 0).toDouble()))
              : {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'revenueToday': revenueToday,
      'revenueYesterday': revenueYesterday,
      'revenueThisWeek': revenueThisWeek,
      'revenueLastWeek': revenueLastWeek,
      'activePCs': activePCs,
      'totalPCs': totalPCs,
      'totalSessions': totalSessions,
      'activeSessions': activeSessions,
      'pendingReservations': pendingReservations,
      'dailyRevenue': dailyRevenue,
      'dailyLabels': dailyLabels,
      'paymentBreakdown': paymentBreakdown,
    };
  }

  double get revenueChange {
    if (revenueYesterday == 0) return 0;
    return ((revenueToday - revenueYesterday) / revenueYesterday) * 100;
  }

  double get weekChange {
    if (revenueLastWeek == 0) return 0;
    return ((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100;
  }
}
