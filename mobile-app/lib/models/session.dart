class Session {
  final String id;
  final String pcId;
  final String pcName;
  final String userId;
  final String userName;
  final DateTime startTime;
  final DateTime? endTime;
  final double totalPrice;
  final String status;

  const Session({
    required this.id,
    required this.pcId,
    this.pcName = '',
    required this.userId,
    this.userName = '',
    required this.startTime,
    this.endTime,
    this.totalPrice = 0.0,
    this.status = 'active',
  });

  factory Session.fromJson(Map<String, dynamic> json) {
    return Session(
      id: json['id']?.toString() ?? '',
      pcId: json['pcId']?.toString() ?? json['pc_id']?.toString() ?? '',
      pcName: json['pcName']?.toString() ?? json['pc_name']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      userName: json['userName']?.toString() ?? json['user_name']?.toString() ?? '',
      startTime: json['startTime'] != null
          ? DateTime.parse(json['startTime'].toString())
          : json['start_time'] != null
              ? DateTime.parse(json['start_time'].toString())
              : DateTime.now(),
      endTime: json['endTime'] != null
          ? DateTime.parse(json['endTime'].toString())
          : json['end_time'] != null
              ? DateTime.parse(json['end_time'].toString())
              : null,
      totalPrice: (json['totalPrice'] ?? json['total_price'] ?? 0).toDouble(),
      status: json['status']?.toString() ?? 'active',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'pcId': pcId,
      'pcName': pcName,
      'userId': userId,
      'userName': userName,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'totalPrice': totalPrice,
      'status': status,
    };
  }

  Duration get duration {
    final end = endTime ?? DateTime.now();
    return end.difference(startTime);
  }

  String get formattedDuration {
    final d = duration;
    final hours = d.inHours.toString().padLeft(2, '0');
    final minutes = (d.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$hours:$minutes:$seconds';
  }

  bool get isActive => status == 'active';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';

  Session copyWith({
    String? id,
    String? pcId,
    String? pcName,
    String? userId,
    String? userName,
    DateTime? startTime,
    DateTime? endTime,
    double? totalPrice,
    String? status,
  }) {
    return Session(
      id: id ?? this.id,
      pcId: pcId ?? this.pcId,
      pcName: pcName ?? this.pcName,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      totalPrice: totalPrice ?? this.totalPrice,
      status: status ?? this.status,
    );
  }
}
