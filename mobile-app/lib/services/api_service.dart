import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = http.Client();
  String? _token;

  String get baseUrl => AppConfig.apiBaseUrl;

  Map<String, String> get _headers {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_token != null && _token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Future<void> setToken(String? token) async {
    _token = token;
    if (token != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);
    }
  }

  Future<String?> getToken() async {
    if (_token != null) return _token;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    return _token;
  }

  Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<dynamic> get(String endpoint, {Map<String, String>? queryParams}) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
      final response = await _client.get(uri, headers: _headers)
          .timeout(AppConfig.requestTimeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on HttpException {
      throw ApiException('Server error');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: $e');
    }
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await _client.post(
        uri,
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(AppConfig.requestTimeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on HttpException {
      throw ApiException('Server error');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: $e');
    }
  }

  Future<dynamic> put(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await _client.put(
        uri,
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(AppConfig.requestTimeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on HttpException {
      throw ApiException('Server error');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: $e');
    }
  }

  Future<dynamic> delete(String endpoint) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await _client.delete(uri, headers: _headers)
          .timeout(AppConfig.requestTimeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection');
    } on HttpException {
      throw ApiException('Server error');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: $e');
    }
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode == 401) {
      clearToken();
      throw ApiException('Session expired. Please login again.', statusCode: 401);
    }

    dynamic data;
    try {
      data = jsonDecode(response.body);
    } catch (_) {
      data = response.body;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    }

    final message = data is Map ? (data['message'] ?? data['error'] ?? 'Request failed') : 'Request failed';
    throw ApiException(message.toString(), statusCode: response.statusCode);
  }

  // Auth endpoints
  Future<dynamic> login(String email, String password) {
    return post('/auth/login', body: {'email': email, 'password': password});
  }

  Future<dynamic> register(String name, String email, String password, String role) {
    return post('/auth/register', body: {
      'name': name,
      'email': email,
      'password': password,
      'role': role,
    });
  }

  Future<dynamic> getProfile() {
    return get('/auth/profile');
  }

  // PC endpoints
  Future<dynamic> getPCs() => get('/pcs');
  Future<dynamic> getPC(String id) => get('/pcs/$id');
  Future<dynamic> updatePCStatus(String id, String status) {
    return put('/pcs/$id/status', body: {'status': status});
  }

  // Session endpoints
  Future<dynamic> getActiveSessions() => get('/sessions/active');
  Future<dynamic> getSessionHistory() => get('/sessions/history');
  Future<dynamic> startSession(String pcId) {
    return post('/sessions/start', body: {'pcId': pcId});
  }
  Future<dynamic> endSession(String sessionId) {
    return put('/sessions/$sessionId/end');
  }

  // Reservation endpoints
  Future<dynamic> getReservations({String? status}) {
    final params = <String, String>{};
    if (status != null) params['status'] = status;
    return get('/reservations', queryParams: params.isNotEmpty ? params : null);
  }
  Future<dynamic> createReservation(Map<String, dynamic> data) {
    return post('/reservations', body: data);
  }
  Future<dynamic> updateReservationStatus(String id, String status) {
    return put('/reservations/$id/status', body: {'status': status});
  }

  // Tournament endpoints
  Future<dynamic> getTournaments() => get('/tournaments');
  Future<dynamic> getTournament(String id) => get('/tournaments/$id');
  Future<dynamic> registerForTournament(String tournamentId, String userId) {
    return post('/tournaments/$tournamentId/register', body: {'userId': userId});
  }

  // Dashboard / Analytics endpoints
  Future<dynamic> getDashboardStats() => get('/dashboard/stats');
  Future<dynamic> getRevenueAnalytics() => get('/analytics/revenue');
  Future<dynamic> getRevenueHistory() => get('/analytics/revenue/history');

  void dispose() {
    _client.close();
  }
}
