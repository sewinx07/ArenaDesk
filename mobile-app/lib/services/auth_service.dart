import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _api = ApiService();

  Future<User> login(String email, String password) async {
    final response = await _api.login(email, password);
    final user = User.fromJson(response is Map ? response : {});
    if (user.token.isNotEmpty) {
      await _api.setToken(user.token);
    }
    return user;
  }

  Future<User> register(String name, String email, String password, String role) async {
    final response = await _api.register(name, email, password, role);
    final user = User.fromJson(response is Map ? response : {});
    if (user.token.isNotEmpty) {
      await _api.setToken(user.token);
    }
    return user;
  }

  Future<void> logout() async {
    await _api.clearToken();
  }

  Future<String?> getToken() async {
    return _api.getToken();
  }

  Future<void> setToken(String token) async {
    await _api.setToken(token);
  }

  Future<User?> getCurrentUser() async {
    try {
      final response = await _api.getProfile();
      if (response is Map && response.containsKey('id')) {
        return User.fromJson(response);
      }
      return null;
    } catch (_) {
      return null;
    }
  }
}
