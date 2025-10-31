import 'dart:convert';

import 'package:flutter/services.dart';

import '../models/checklist.dart';

class ChecklistService {
  Future<List<Checklist>> loadChecklistsFromAssets() async {
    final manifest = await rootBundle.loadString('AssetManifest.json');
    final Map<String, dynamic> assets = jsonDecode(manifest) as Map<String, dynamic>;

    final checklistAssets = assets.keys.where((path) => path.startsWith('assets/checklists/') && path.endsWith('.json'));

    final futures = checklistAssets.map((path) async {
      final json = await rootBundle.loadString(path);
      return Checklist.fromJson(jsonDecode(json) as Map<String, dynamic>);
    });

    return Future.wait(futures);
  }

  Checklist mergeWithResponses(Checklist checklist, Map<String, ChecklistItem> responses) {
    final mergedItems = checklist.items.map((item) {
      final response = responses[item.id];
      if (response == null) {
        return item;
      }
      return item.toggle(value: response.completed, updatedNotes: response.notes);
    }).toList();

    return Checklist(
      id: checklist.id,
      title: checklist.title,
      items: mergedItems,
      standard: checklist.standard,
    );
  }
}
