// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'checklist.dart';

Checklist _$ChecklistFromJson(Map<String, dynamic> json) => Checklist(
      id: json['id'] as String,
      title: json['title'] as String,
      items: (json['items'] as List<dynamic>)
          .map((e) => ChecklistItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      standard: json['standard'] as String,
    );

Map<String, dynamic> _$ChecklistToJson(Checklist instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'items': instance.items.map((e) => e.toJson()).toList(),
      'standard': instance.standard,
    };

ChecklistItem _$ChecklistItemFromJson(Map<String, dynamic> json) => ChecklistItem(
      id: json['id'] as String,
      description: json['description'] as String,
      completed: json['completed'] as bool? ?? false,
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$ChecklistItemToJson(ChecklistItem instance) => <String, dynamic>{
      'id': instance.id,
      'description': instance.description,
      'completed': instance.completed,
      'notes': instance.notes,
    };
