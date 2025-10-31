import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/activity.dart';
import '../models/checklist.dart';
import '../models/worksite.dart';
import '../services/checklist_service.dart';
import '../widgets/checklist_item_widget.dart';

class ChecklistScreen extends StatefulWidget {
  const ChecklistScreen({super.key, required this.worksite, this.activity});

  static const route = '/checklist';

  final Worksite worksite;
  final Activity? activity;

  @override
  State<ChecklistScreen> createState() => _ChecklistScreenState();
}

class _ChecklistScreenState extends State<ChecklistScreen> {
  Checklist? _checklist;
  final Map<String, ChecklistItem> _responses = {};

  @override
  void initState() {
    super.initState();
    _loadChecklist();
  }

  Future<void> _loadChecklist() async {
    final checklistService = context.read<ChecklistService>();
    final checklists = await checklistService.loadChecklistsFromAssets();
    setState(() {
      _checklist = checklists.firstWhere((element) => element.standard.contains('ISO'));
    });
  }

  void _toggleItem(ChecklistItem item, bool value) {
    setState(() {
      _responses[item.id] = item.toggle(value: value);
    });
  }

  void _updateNotes(ChecklistItem item, String notes) {
    setState(() {
      _responses[item.id] = item.toggle(value: item.completed, updatedNotes: notes);
    });
  }

  @override
  Widget build(BuildContext context) {
    final checklist = _checklist;
    if (checklist == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final merged = context.read<ChecklistService>().mergeWithResponses(checklist, _responses);

    return Scaffold(
      appBar: AppBar(
        title: Text('Checklist ${checklist.standard}'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(widget.worksite.name, style: Theme.of(context).textTheme.titleLarge),
          if (widget.activity != null) Text(widget.activity!.name),
          const SizedBox(height: 16),
          ...merged.items.map(
            (item) => ChecklistItemWidget(
              item: item,
              onChanged: (value) => _toggleItem(item, value),
              onNotesChanged: (notes) => _updateNotes(item, notes),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            icon: const Icon(Icons.check_circle),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Checklist salvo localmente.')),
              );
            },
            label: const Text('Salvar'),
          ),
        ],
      ),
    );
  }
}
