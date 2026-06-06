import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../providers/reservation_provider.dart';
import '../widgets/reservation_card.dart';
import '../widgets/loading_indicator.dart';
import '../widgets/empty_state.dart';
import '../widgets/custom_app_bar.dart';
import 'reservation_detail_screen.dart';

class ReservationsScreen extends StatefulWidget {
  const ReservationsScreen({super.key});

  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  final List<_Segment> _segments = const [
    _Segment('Pending', 'pending'),
    _Segment('Confirmed', 'confirmed'),
    _Segment('Checked In', 'checked_in'),
    _Segment('All', 'all'),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReservationProvider>().fetchReservations();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Reservations',
        notificationCount: context.watch<ReservationProvider>().pendingCount,
        onNotificationTap: () {
          context.read<ReservationProvider>().setFilter('pending');
        },
      ),
      body: Consumer<ReservationProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.reservations.isEmpty) {
            return const LoadingIndicator(message: 'Loading reservations...');
          }

          return Column(
            children: [
              // Segmented control
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _segments.map((seg) {
                      final selected = provider.statusFilter == seg.value;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: GestureDetector(
                          onTap: () => provider.setFilter(seg.value),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                            decoration: BoxDecoration(
                              color: selected
                                  ? AppTheme.primary.withOpacity(0.2)
                                  : AppTheme.surfaceLight,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: selected
                                    ? AppTheme.primary.withOpacity(0.6)
                                    : AppTheme.cardBorder,
                              ),
                            ),
                            child: Text(
                              seg.label,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: selected ? AppTheme.primary : AppTheme.textSecondary,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

              // Reservation list
              Expanded(
                child: provider.filteredReservations.isEmpty
                    ? const EmptyState(
                        icon: Icons.calendar_today,
                        title: 'No reservations',
                        subtitle: 'Reservations will appear here',
                      )
                    : RefreshIndicator(
                        onRefresh: () => provider.fetchReservations(),
                        color: AppTheme.primary,
                        child: ListView.builder(
                          padding: const EdgeInsets.only(top: 4, bottom: 80),
                          itemCount: provider.filteredReservations.length,
                          itemBuilder: (context, index) {
                            final reservation = provider.filteredReservations[index];
                            return ReservationCard(
                              reservation: reservation,
                              onApprove: reservation.isPending
                                  ? () => provider.approveReservation(reservation.id)
                                  : null,
                              onReject: reservation.isPending
                                  ? () => provider.rejectReservation(reservation.id)
                                  : null,
                              onTap: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => ReservationDetailScreen(
                                      reservation: reservation,
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCreateDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _CreateReservationDialog(),
    );
  }
}

class _Segment {
  final String label;
  final String value;
  const _Segment(this.label, this.value);
}

class _CreateReservationDialog extends StatefulWidget {
  const _CreateReservationDialog();

  @override
  State<_CreateReservationDialog> createState() => _CreateReservationDialogState();
}

class _CreateReservationDialogState extends State<_CreateReservationDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _notesController = TextEditingController();
  DateTime _selectedDate = DateTime.now().add(const Duration(hours: 1));

  @override
  void dispose() {
    _nameController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('New Reservation'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Customer Name',
                prefixIcon: Icon(Icons.person),
              ),
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.schedule, color: AppTheme.primary),
              title: Text(
                '${_selectedDate.month}/${_selectedDate.day}/${_selectedDate.year} '
                '${_selectedDate.hour}:${_selectedDate.minute.toString().padLeft(2, '0')}',
              ),
              trailing: const Icon(Icons.edit, color: AppTheme.textSecondary),
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: _selectedDate,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 30)),
                );
                if (date != null) {
                  final time = await showTimePicker(
                    context: context,
                    initialTime: TimeOfDay.fromDateTime(_selectedDate),
                  );
                  if (time != null) {
                    setState(() {
                      _selectedDate = DateTime(
                        date.year,
                        date.month,
                        date.day,
                        time.hour,
                        time.minute,
                      );
                    });
                  }
                }
              },
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes (optional)',
                prefixIcon: Icon(Icons.notes),
              ),
              maxLines: 2,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              context.read<ReservationProvider>().createReservation(
                userId: 'new',
                pcId: '1',
                timeSlot: _selectedDate,
                notes: _notesController.text.trim(),
              );
              Navigator.pop(context);
            }
          },
          child: const Text('Create'),
        ),
      ],
    );
  }
}
