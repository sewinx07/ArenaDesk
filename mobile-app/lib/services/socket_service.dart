import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../config.dart';

enum SocketEvent {
  pcStatus,
  sessionUpdates,
  notifications,
  revenueUpdates,
  reservations,
}

class SocketService {
  WebSocketChannel? _channel;
  bool _isConnected = false;
  int _reconnectAttempts = 0;
  Timer? _reconnectTimer;
  StreamSubscription? _subscription;

  final _eventControllers = <SocketEvent, StreamController<Map<String, dynamic>>>{
    SocketEvent.pcStatus: StreamController<Map<String, dynamic>>.broadcast(),
    SocketEvent.sessionUpdates: StreamController<Map<String, dynamic>>.broadcast(),
    SocketEvent.notifications: StreamController<Map<String, dynamic>>.broadcast(),
    SocketEvent.revenueUpdates: StreamController<Map<String, dynamic>>.broadcast(),
    SocketEvent.reservations: StreamController<Map<String, dynamic>>.broadcast(),
  };

  Stream<Map<String, dynamic>> get pcStatus => _eventControllers[SocketEvent.pcStatus]!.stream;
  Stream<Map<String, dynamic>> get sessionUpdates => _eventControllers[SocketEvent.sessionUpdates]!.stream;
  Stream<Map<String, dynamic>> get notifications => _eventControllers[SocketEvent.notifications]!.stream;
  Stream<Map<String, dynamic>> get revenueUpdates => _eventControllers[SocketEvent.revenueUpdates]!.stream;
  Stream<Map<String, dynamic>> get reservations => _eventControllers[SocketEvent.reservations]!.stream;

  bool get isConnected => _isConnected;

  Future<void> connect(String token) async {
    if (_isConnected) return;

    try {
      final uri = Uri.parse('${AppConfig.wsUrl}?token=$token');
      _channel = WebSocketChannel.connect(uri);

      await _channel!.ready;
      _isConnected = true;
      _reconnectAttempts = 0;

      _subscription = _channel!.stream.listen(
        (data) {
          _handleMessage(data);
        },
        onError: (error) {
          _isConnected = false;
          _scheduleReconnect(token);
        },
        onDone: () {
          _isConnected = false;
          _scheduleReconnect(token);
        },
      );
    } catch (_) {
      _isConnected = false;
      _scheduleReconnect(token);
    }
  }

  void _handleMessage(dynamic data) {
    try {
      final Map<String, dynamic> message;
      if (data is String) {
        message = jsonDecode(data) as Map<String, dynamic>;
      } else if (data is Map) {
        message = data.cast<String, dynamic>();
      } else {
        return;
      }

      final type = message['type']?.toString() ?? '';
      final payload = message['data'] is Map
          ? (message['data'] as Map).cast<String, dynamic>()
          : <String, dynamic>{};

      switch (type) {
        case 'pc_status_changed':
        case 'pc_status':
        case 'pcStatus':
          _eventControllers[SocketEvent.pcStatus]!.add(payload);
          break;
        case 'session_started':
        case 'session_updated':
        case 'session_ended':
        case 'session_update':
        case 'sessionUpdates':
          _eventControllers[SocketEvent.sessionUpdates]!.add(payload);
          break;
        case 'notification':
          _eventControllers[SocketEvent.notifications]!.add(payload);
          break;
        case 'revenue_update':
        case 'revenueUpdates':
          _eventControllers[SocketEvent.revenueUpdates]!.add(payload);
          break;
        case 'reservation_created':
          _eventControllers[SocketEvent.reservations]!.add(payload);
          break;
      }
    } catch (_) {}
  }

  void _scheduleReconnect(String token) {
    if (_reconnectAttempts >= AppConfig.wsMaxReconnectAttempts) return;

    _reconnectTimer?.cancel();
    final delay = Duration(
      seconds: AppConfig.wsReconnectDelay.inSeconds * (_reconnectAttempts + 1),
    );

    _reconnectTimer = Timer(delay, () {
      _reconnectAttempts++;
      connect(token);
    });
  }

  void disconnect() {
    _reconnectTimer?.cancel();
    _subscription?.cancel();
    _channel?.sink.close();
    _isConnected = false;
  }

  void dispose() {
    disconnect();
    for (final controller in _eventControllers.values) {
      controller.close();
    }
  }
}
