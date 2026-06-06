class Reservation {
  final String id;
  final String userId;
  final String userName;
  final String pcId;
  final String pcName;
  final DateTime timeSlot;
  final String status;
  final String notes;

  const Reservation({
    required this.id,
    required this.userId,
    this.userName = '',
    required this.pcId,
    this.pcName = '',
    required this.timeSlot,
    this.status = 'pending',
    this.notes = '',
  });

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      userName: json['userName']?.toString() ?? json['user_name']?.toString() ?? '',
      pcId: json['pcId']?.toString() ?? json['pc_id']?.toString() ?? '',
      pcName: json['pcName']?.toString() ?? json['pc_name']?.toString() ?? '',
      timeSlot: json['timeSlot'] != null
          ? DateTime.parse(json['timeSlot'].toString())
          : json['time_slot'] != null
              ? DateTime.parse(json['time_slot'].toString())
              : DateTime.now(),
      status: json['status']?.toString() ?? 'pending',
      notes: json['notes']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'userName': userName,
      'pcId': pcId,
      'pcName': pcName,
      'timeSlot': timeSlot.toIso8601String(),
      'status': status,
      'notes': notes,
    };
  }

  bool get isPending => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isCheckedIn => status == 'checked_in' || status == 'checked-in';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
  bool get isRejected => status == 'rejected';

  Reservation copyWith({
    String? id,
    String? userId,
    String? userName,
    String? pcId,
    String? pcName,
    DateTime? timeSlot,
    String? status,
    String? notes,
  }) {
    return Reservation(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      pcId: pcId ?? this.pcId,
      pcName: pcName ?? this.pcName,
      timeSlot: timeSlot ?? this.timeSlot,
      status: status ?? this.status,
      notes: notes ?? this.notes,
    );
  }
}
