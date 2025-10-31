// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_payload.dart';

SyncPayload _$SyncPayloadFromJson(Map<String, dynamic> json) => SyncPayload(
      worksites: (json['worksites'] as List<dynamic>)
          .map((e) => Worksite.fromJson(e as Map<String, dynamic>))
          .toList(),
      activities: (json['activities'] as List<dynamic>)
          .map((e) => Activity.fromJson(e as Map<String, dynamic>))
          .toList(),
      checklists: (json['checklists'] as List<dynamic>)
          .map((e) => Checklist.fromJson(e as Map<String, dynamic>))
          .toList(),
      lastSync: DateTime.parse(json['lastSync'] as String),
    );

Map<String, dynamic> _$SyncPayloadToJson(SyncPayload instance) => <String, dynamic>{
      'worksites': instance.worksites.map((e) => e.toJson()).toList(),
      'activities': instance.activities.map((e) => e.toJson()).toList(),
      'checklists': instance.checklists.map((e) => e.toJson()).toList(),
      'lastSync': instance.lastSync.toIso8601String(),
    };
