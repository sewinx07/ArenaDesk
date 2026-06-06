import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/session.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class SessionProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Session> _activeSessions = [];
  List<Session> _sessionHistory = [];
  bool _isLoading = false;
  String? _error;
  Timer? _timer;
  AuthProvider? _auth;

  List<Session> get activeSessions => _activeSessions;
  List<Session> get sessionHistory => _sessionHistory;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void updateAuth(AuthProvider auth) {
    _auth = auth;
  }

  Future<void> fetchActiveSessions() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.getActiveSessions();
      if (response is List) {
        _activeSessions = response.map((e) => Session.fromJson(e is Map ? e : {})).toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchSessionHistory() async {
    try {
      final response = await _api.getSessionHistory();
      if (response is List) {
        _sessionHistory = response.map((e) => Session.fromJson(e is Map ? e : {})).toList();
      }
    } catch (e) {
      _error = e.toString();
    }
    notifyListeners();
  }

  Future<bool> startSession(String pcId) async {
    try {
      final response = await _api.startSession(pcId);
      if (response is Map) {
        final session = Session.fromJson(response);
        _activeSessions.insert(0, session);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> endSession(String sessionId) async {
    try {
      await _api.endSession(sessionId);
      _activeSessions.removeWhere((s) => s.id == sessionId);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  void startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      notifyListeners();
    });
  }

  void stopTimer() {
    _timer?.cancel();
  }

  void addSessionFromSocket(Map<String, dynamic> data) {
    final session = Session.fromJson(data);
    _activeSessions.insert(0, session);
    notifyListeners();
  }

  void removeSessionFromSocket(String sessionId) {
    _activeSessions.removeWhere((s) => s.id == sessionId);
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
