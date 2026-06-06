import 'package:flutter/foundation.dart';
import '../models/dashboard_stats.dart';
import '../models/session.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class DashboardProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  DashboardStats _stats = const DashboardStats();
  List<Session> _activeSessions = [];
  bool _isLoading = false;
  String? _error;
  AuthProvider? _auth;

  DashboardStats get stats => _stats;
  List<Session> get activeSessions => _activeSessions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void updateAuth(AuthProvider auth) {
    _auth = auth;
  }

  Future<void> fetchDashboard() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final statsResponse = await _api.getDashboardStats();
      if (statsResponse is Map) {
        _stats = DashboardStats.fromJson(statsResponse);
      }

      final sessionsResponse = await _api.getActiveSessions();
      if (sessionsResponse is List) {
        _activeSessions = sessionsResponse.map((e) => Session.fromJson(e is Map ? e : {})).toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void updateFromSocket(Map<String, dynamic> data) {
    // Handle real-time socket updates
    final type = data['type']?.toString() ?? '';
    final payload = data['data'] is Map ? data['data'] as Map<String, dynamic> : data;

    switch (type) {
      case 'session_started':
        final session = Session.fromJson(payload);
        _activeSessions.insert(0, session);
        notifyListeners();
        break;
      case 'session_ended':
        final sessionId = payload['id']?.toString() ?? '';
        _activeSessions.removeWhere((s) => s.id == sessionId);
        notifyListeners();
        break;
      case 'stats_update':
        _stats = DashboardStats.fromJson(payload);
        notifyListeners();
        break;
    }
  }

  Future<void> refreshData() async {
    await fetchDashboard();
  }
}
