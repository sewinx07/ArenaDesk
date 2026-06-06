class PC {
  final String id;
  final String name;
  final String status;
  final double hourlyRate;
  final Map<String, String> specs;

  const PC({
    required this.id,
    required this.name,
    required this.status,
    this.hourlyRate = 0.0,
    this.specs = const {},
  });

  factory PC.fromJson(Map<String, dynamic> json) {
    return PC(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      status: json['status']?.toString() ?? 'offline',
      hourlyRate: (json['hourlyRate'] ?? json['hourly_rate'] ?? 0).toDouble(),
      specs: json['specs'] is Map
          ? (json['specs'] as Map).map((k, v) => MapEntry(k.toString(), v.toString()))
          : {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'status': status,
      'hourlyRate': hourlyRate,
      'specs': specs,
    };
  }

  bool get isAvailable => status == 'available';
  bool get isInUse => status == 'in_use' || status == 'in-use';
  bool get isOffline => status == 'offline';
  bool get isMaintenance => status == 'maintenance';
  bool get isReserved => status == 'reserved';

  PC copyWith({
    String? id,
    String? name,
    String? status,
    double? hourlyRate,
    Map<String, String>? specs,
  }) {
    return PC(
      id: id ?? this.id,
      name: name ?? this.name,
      status: status ?? this.status,
      hourlyRate: hourlyRate ?? this.hourlyRate,
      specs: specs ?? this.specs,
    );
  }
}
