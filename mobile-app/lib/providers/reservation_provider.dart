import 'package:flutter/foundation.dart';
import '../models/reservation.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class ReservationProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Reservation> _reservations = [];
  bool _isLoading = false;
  String? _error;
  String _statusFilter = 'all';
  AuthProvider? _auth;

  List<Reservation> get reservations => _reservations;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get statusFilter => _statusFilter;

  List<Reservation> get filteredReservations {
    if (_statusFilter == 'all') return _reservations;
    return _reservations.where((r) => r.status == _statusFilter).toList();
  }

  int get pendingCount => _reservations.where((r) => r.isPending).length;

  void updateAuth(AuthProvider auth) {
    _auth = auth;
  }

  void setFilter(String filter) {
    _statusFilter = filter;
    notifyListeners();
  }

  Future<void> fetchReservations({String? status}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getReservations(status: status);
      if (response is List) {
        _reservations = response.map((e) => Reservation.fromJson(e is Map ? e : {})).toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> approveReservation(String id) async {
    return _updateReservationStatus(id, 'confirmed');
  }

  Future<bool> rejectReservation(String id) async {
    return _updateReservationStatus(id, 'rejected');
  }

  Future<bool> checkInReservation(String id) async {
    return _updateReservationStatus(id, 'checked_in');
  }

  Future<bool> completeReservation(String id) async {
    return _updateReservationStatus(id, 'completed');
  }

  Future<bool> cancelReservation(String id) async {
    return _updateReservationStatus(id, 'cancelled');
  }

  Future<bool> _updateReservationStatus(String id, String status) async {
    try {
      await _api.updateReservationStatus(id, status);
      final index = _reservations.indexWhere((r) => r.id == id);
      if (index != -1) {
        _reservations[index] = _reservations[index].copyWith(status: status);
        notifyListeners();
      }
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> createReservation({
    required String userId,
    required String pcId,
    required DateTime timeSlot,
    String notes = '',
  }) async {
    try {
      final response = await _api.createReservation({
        'userId': userId,
        'pcId': pcId,
        'timeSlot': timeSlot.toIso8601String(),
        'notes': notes,
      });
      if (response is Map) {
        final reservation = Reservation.fromJson(response);
        _reservations.insert(0, reservation);
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
}
