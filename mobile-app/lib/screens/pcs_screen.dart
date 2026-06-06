import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../providers/pc_provider.dart';
import '../widgets/pc_card.dart';
import '../widgets/loading_indicator.dart';
import '../widgets/custom_app_bar.dart';
import 'pc_detail_screen.dart';

class PCsScreen extends StatefulWidget {
  const PCsScreen({super.key});

  @override
  State<PCsScreen> createState() => _PCsScreenState();
}

class _PCsScreenState extends State<PCsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PCProvider>().fetchPCs();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'PCs'),
      body: Consumer<PCProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.pcs.isEmpty) {
            return const LoadingIndicator(message: 'Loading PCs...');
          }

          return Column(
            children: [
              // Status count chips
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterChip(
                        label: 'All',
                        count: provider.statusCounts['all'] ?? 0,
                        selected: provider.statusFilter == 'all',
                        onTap: () => provider.setFilter('all'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'Available',
                        count: provider.statusCounts['available'] ?? 0,
                        color: AppTheme.success,
                        selected: provider.statusFilter == 'available',
                        onTap: () => provider.setFilter('available'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'In Use',
                        count: provider.statusCounts['in_use'] ?? 0,
                        color: AppTheme.secondary,
                        selected: provider.statusFilter == 'in_use',
                        onTap: () => provider.setFilter('in_use'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'Offline',
                        count: provider.statusCounts['offline'] ?? 0,
                        color: AppTheme.error,
                        selected: provider.statusFilter == 'offline',
                        onTap: () => provider.setFilter('offline'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'Reserved',
                        count: provider.statusCounts['reserved'] ?? 0,
                        color: AppTheme.warning,
                        selected: provider.statusFilter == 'reserved',
                        onTap: () => provider.setFilter('reserved'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'Maintenance',
                        count: provider.statusCounts['maintenance'] ?? 0,
                        color: AppTheme.warning,
                        selected: provider.statusFilter == 'maintenance',
                        onTap: () => provider.setFilter('maintenance'),
                      ),
                    ],
                  ),
                ),
              ),

              // PC Grid
              Expanded(
                child: RefreshIndicator(
                  onRefresh: provider.fetchPCs,
                  color: AppTheme.primary,
                  child: provider.filteredPCs.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.desktop_windows_off,
                                  size: 48, color: AppTheme.textSecondary.withOpacity(0.5)),
                              const SizedBox(height: 8),
                              Text('No PCs found', style: Theme.of(context).textTheme.bodyMedium),
                            ],
                          ),
                        )
                      : GridView.builder(
                          padding: const EdgeInsets.all(16),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.85,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 10,
                          ),
                          itemCount: provider.filteredPCs.length,
                          itemBuilder: (context, index) {
                            final pc = provider.filteredPCs[index];
                            return PCCard(
                              pc: pc,
                              onTap: () {
                                provider.selectPC(pc);
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => const PCDetailScreen(),
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
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final int count;
  final Color? color;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.count,
    this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final chipColor = color ?? AppTheme.primary;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? chipColor.withOpacity(0.2) : AppTheme.surfaceLight,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? chipColor.withOpacity(0.6) : AppTheme.cardBorder,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: selected ? chipColor : AppTheme.textSecondary,
              ),
            ),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: selected ? chipColor.withOpacity(0.3) : AppTheme.surface,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: selected ? chipColor : AppTheme.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
