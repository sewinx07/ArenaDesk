class Tournament {
  final String id;
  final String name;
  final String game;
  final int participants;
  final int maxParticipants;
  final String status;
  final double prizePool;
  final String format;
  final DateTime startDate;
  final DateTime? endDate;
  final List<String> participantNames;
  final List<Map<String, dynamic>> matches;

  const Tournament({
    required this.id,
    required this.name,
    required this.game,
    this.participants = 0,
    this.maxParticipants = 16,
    this.status = 'registration',
    this.prizePool = 0.0,
    this.format = 'single_elimination',
    required this.startDate,
    this.endDate,
    this.participantNames = const [],
    this.matches = const [],
  });

  factory Tournament.fromJson(Map<String, dynamic> json) {
    return Tournament(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      game: json['game']?.toString() ?? '',
      participants: (json['participants'] ?? 0).toInt(),
      maxParticipants: (json['maxParticipants'] ?? json['max_participants'] ?? 16).toInt(),
      status: json['status']?.toString() ?? 'registration',
      prizePool: (json['prizePool'] ?? json['prize_pool'] ?? 0).toDouble(),
      format: json['format']?.toString() ?? 'single_elimination',
      startDate: json['startDate'] != null
          ? DateTime.parse(json['startDate'].toString())
          : json['start_date'] != null
              ? DateTime.parse(json['start_date'].toString())
              : DateTime.now(),
      endDate: json['endDate'] != null
          ? DateTime.parse(json['endDate'].toString())
          : json['end_date'] != null
              ? DateTime.parse(json['end_date'].toString())
              : null,
      participantNames: json['participantNames'] is List
          ? (json['participantNames'] as List).map((e) => e.toString()).toList()
          : json['participant_names'] is List
              ? (json['participant_names'] as List).map((e) => e.toString()).toList()
              : [],
      matches: json['matches'] is List
          ? (json['matches'] as List).cast<Map<String, dynamic>>()
          : [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'game': game,
      'participants': participants,
      'maxParticipants': maxParticipants,
      'status': status,
      'prizePool': prizePool,
      'format': format,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'participantNames': participantNames,
      'matches': matches,
    };
  }

  bool get isRegistration => status == 'registration';
  bool get isInProgress => status == 'in_progress' || status == 'in-progress';
  bool get isCompleted => status == 'completed';

  String get statusLabel {
    switch (status) {
      case 'registration':
        return 'Registration';
      case 'in_progress':
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }

  String get formatLabel {
    switch (format) {
      case 'single_elimination':
        return 'Single Elimination';
      case 'double_elimination':
        return 'Double Elimination';
      case 'round_robin':
        return 'Round Robin';
      case 'swiss':
        return 'Swiss System';
      default:
        return format;
    }
  }
}
