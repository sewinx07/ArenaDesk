import 'package:flutter/foundation.dart';
import '../models/tournament.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class TournamentProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Tournament> _tournaments = [];
  Tournament? _selectedTournament;
  bool _isLoading = false;
  String? _error;
  AuthProvider? _auth;

  List<Tournament> get tournaments => _tournaments;
  Tournament? get selectedTournament => _selectedTournament;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void updateAuth(AuthProvider auth) {
    _auth = auth;
  }

  Future<void> fetchTournaments() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getTournaments();
      if (response is List) {
        _tournaments = response.map((e) => Tournament.fromJson(e is Map ? e : {})).toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchTournamentDetails(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getTournament(id);
      if (response is Map) {
        _selectedTournament = Tournament.fromJson(response);
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectTournament(Tournament tournament) {
    _selectedTournament = tournament;
    notifyListeners();
  }

  void clearSelection() {
    _selectedTournament = null;
    notifyListeners();
  }

  Future<bool> registerParticipant(String tournamentId, String userId) async {
    try {
      await _api.registerForTournament(tournamentId, userId);
      await fetchTournamentDetails(tournamentId);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
}
