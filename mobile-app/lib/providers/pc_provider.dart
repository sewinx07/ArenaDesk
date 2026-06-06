import 'package:flutter/foundation.dart';
import '../models/pc.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class PCProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<PC> _pcs = [];
  PC? _selectedPC;
  bool _isLoading = false;
  String? _error;
  String _statusFilter = 'all';
  AuthProvider? _auth;

  List<PC> get pcs => _pcs;
  PC? get selectedPC => _selectedPC;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get statusFilter => _statusFilter;

  List<PC> get filteredPCs {
    if (_statusFilter == 'all') return _pcs;
    return _pcs.where((pc) => pc.status == _statusFilter).toList();
  }

  Map<String, int> get statusCounts {
    return {
      'all': _pcs.length,
      'available': _pcs.where((pc) => pc.isAvailable).length,
      'in_use': _pcs.where((pc) => pc.isInUse).length,
      'offline': _pcs.where((pc) => pc.isOffline).length,
      'maintenance': _pcs.where((pc) => pc.isMaintenance).length,
      'reserved': _pcs.where((pc) => pc.isReserved).length,
    };
  }

  void updateAuth(AuthProvider auth) {
    _auth = auth;
  }

  Future<void> fetchPCs() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getPCs();
      if (response is List) {
        _pcs = response.map((e) => PC.fromJson(e is Map ? e : {})).toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectPC(PC pc) {
    _selectedPC = pc;
    notifyListeners();
  }

  void clearSelection() {
    _selectedPC = null;
    notifyListeners();
  }

  void setFilter(String filter) {
    _statusFilter = filter;
    notifyListeners();
  }

  Future<void> updatePCStatus(String id, String status) async {
    try {
      await _api.updatePCStatus(id, status);
      final index = _pcs.indexWhere((pc) => pc.id == id);
      if (index != -1) {
        _pcs[index] = _pcs[index].copyWith(status: status);
        if (_selectedPC?.id == id) {
          _selectedPC = _pcs[index];
        }
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void updatePCFromSocket(Map<String, dynamic> data) {
    final pcId = data['id']?.toString() ?? '';
    final status = data['status']?.toString() ?? '';
    if (pcId.isNotEmpty && status.isNotEmpty) {
      final index = _pcs.indexWhere((pc) => pc.id == pcId);
      if (index != -1) {
        _pcs[index] = _pcs[index].copyWith(status: status);
        if (_selectedPC?.id == pcId) {
          _selectedPC = _pcs[index];
        }
        notifyListeners();
      }
    }
  }
}
