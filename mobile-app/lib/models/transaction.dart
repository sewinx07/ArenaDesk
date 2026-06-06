class Transaction {
  final String id;
  final String sessionId;
  final double amount;
  final String paymentMethod;
  final DateTime timestamp;

  const Transaction({
    required this.id,
    required this.sessionId,
    this.amount = 0.0,
    this.paymentMethod = 'cash',
    required this.timestamp,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id']?.toString() ?? '',
      sessionId: json['sessionId']?.toString() ?? json['session_id']?.toString() ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      paymentMethod: json['paymentMethod']?.toString() ?? json['payment_method']?.toString() ?? 'cash',
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'].toString())
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sessionId': sessionId,
      'amount': amount,
      'paymentMethod': paymentMethod,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  String get formattedAmount {
    return '\$${amount.toStringAsFixed(2)}';
  }

  String get paymentMethodLabel {
    switch (paymentMethod) {
      case 'cash':
        return 'Cash';
      case 'card':
        return 'Card';
      case 'mobile':
        return 'Mobile Payment';
      default:
        return paymentMethod;
    }
  }
}
