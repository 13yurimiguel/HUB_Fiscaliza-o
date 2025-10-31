import 'dart:async';

import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';

import '../models/activity.dart';
import '../models/checklist.dart';
import '../models/worksite.dart';

class CacheService {
  CacheService({Box<Map>? worksitesBox, Box<Map>? activitiesBox, Box<Map>? checklistsBox})
      : _worksitesBox = worksitesBox,
        _activitiesBox = activitiesBox,
        _checklistsBox = checklistsBox;

  static const _worksitesBoxName = 'worksites';
  static const _activitiesBoxName = 'activities';
  static const _checklistsBoxName = 'checklists';

  static Future<void> initialize() async {
    final dir = await getApplicationDocumentsDirectory();
    Hive.init(dir.path);
  }

  Box<Map>? _worksitesBox;
  Box<Map>? _activitiesBox;
  Box<Map>? _checklistsBox;

  Future<void> openBoxes() async {
    _worksitesBox ??= await Hive.openBox<Map>(_worksitesBoxName);
    _activitiesBox ??= await Hive.openBox<Map>(_activitiesBoxName);
    _checklistsBox ??= await Hive.openBox<Map>(_checklistsBoxName);
  }

  Future<void> cacheWorksites(List<Worksite> worksites) async {
    await openBoxes();
    await _worksitesBox!.clear();
    for (final worksite in worksites) {
      await _worksitesBox!.put(worksite.id, worksite.toJson());
    }
  }

  Future<void> cacheActivities(List<Activity> activities) async {
    await openBoxes();
    await _activitiesBox!.clear();
    for (final activity in activities) {
      await _activitiesBox!.put(activity.id, activity.toJson());
    }
  }

  Future<void> cacheChecklists(List<Checklist> checklists) async {
    await openBoxes();
    await _checklistsBox!.clear();
    for (final checklist in checklists) {
      await _checklistsBox!.put(checklist.id, checklist.toJson());
    }
  }

  Future<List<Worksite>> readWorksites() async {
    await openBoxes();
    return _worksitesBox!.values.map((json) => Worksite.fromJson(Map<String, dynamic>.from(json))).toList();
  }

  Future<List<Activity>> readActivities() async {
    await openBoxes();
    return _activitiesBox!.values.map((json) => Activity.fromJson(Map<String, dynamic>.from(json))).toList();
  }

  Future<List<Checklist>> readChecklists() async {
    await openBoxes();
    return _checklistsBox!.values.map((json) => Checklist.fromJson(Map<String, dynamic>.from(json))).toList();
  }
}
