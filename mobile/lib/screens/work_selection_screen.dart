import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/activity.dart';
import '../models/worksite.dart';
import '../repositories/worksite_repository.dart';
import '../services/sync_service.dart';
import 'checklist_screen.dart';

class WorkSelectionScreen extends StatefulWidget {
  const WorkSelectionScreen({super.key});

  static const route = '/work-selection';

  @override
  State<WorkSelectionScreen> createState() => _WorkSelectionScreenState();
}

class _WorkSelectionScreenState extends State<WorkSelectionScreen> {
  late final WorksiteRepository _repository;
  Worksite? _selectedWorksite;
  Activity? _selectedActivity;
  List<Worksite> _worksites = const [];
  List<Activity> _activities = const [];

  @override
  void initState() {
    super.initState();
    final syncService = context.read<SyncService>();
    _repository = WorksiteRepository(syncService: syncService);
    _loadWorksites();
  }

  Future<void> _loadWorksites() async {
    final worksites = await _repository.fetchWorksites();
    setState(() {
      _worksites = worksites;
    });
  }

  Future<void> _loadActivities(String worksiteId) async {
    final activities = await _repository.fetchActivities(worksiteId);
    setState(() {
      _activities = activities;
      _selectedActivity = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Seleção de obra')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DropdownButtonFormField<Worksite>(
              value: _selectedWorksite,
              decoration: const InputDecoration(labelText: 'Obra'),
              items: _worksites
                  .map(
                    (worksite) => DropdownMenuItem(
                      value: worksite,
                      child: Text(worksite.name),
                    ),
                  )
                  .toList(),
              onChanged: (worksite) {
                setState(() => _selectedWorksite = worksite);
                if (worksite != null) {
                  _loadActivities(worksite.id);
                }
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<Activity>(
              value: _selectedActivity,
              decoration: const InputDecoration(labelText: 'Atividade'),
              items: _activities
                  .map(
                    (activity) => DropdownMenuItem(
                      value: activity,
                      child: Text(activity.name),
                    ),
                  )
                  .toList(),
              onChanged: (activity) => setState(() => _selectedActivity = activity),
            ),
            const Spacer(),
            FilledButton(
              onPressed: _selectedWorksite == null
                  ? null
                  : () {
                      Navigator.pushNamed(
                        context,
                        ChecklistScreen.route,
                        arguments: {
                          'worksite': _selectedWorksite!,
                          'activity': _selectedActivity,
                        },
                      );
                    },
              child: const Text('Avançar para checklist'),
            ),
          ],
        ),
      ),
    );
  }
}
