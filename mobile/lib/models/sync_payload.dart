import 'package:json_annotation/json_annotation.dart';

import 'activity.dart';
import 'checklist.dart';
import 'worksite.dart';

part 'sync_payload.g.dart';

@JsonSerializable(explicitToJson: true)
class SyncPayload {
  SyncPayload({
    required this.worksites,
    required this.activities,
    required this.checklists,
    required this.lastSync,
  });

  factory SyncPayload.fromJson(Map<String, dynamic> json) => _$SyncPayloadFromJson(json);

  final List<Worksite> worksites;
  final List<Activity> activities;
  final List<Checklist> checklists;
  final DateTime lastSync;

  Map<String, dynamic> toJson() => _$SyncPayloadToJson(this);
}
