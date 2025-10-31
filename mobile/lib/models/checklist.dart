import 'package:collection/collection.dart';
import 'package:json_annotation/json_annotation.dart';

part 'checklist.g.dart';

@JsonSerializable(explicitToJson: true)
class Checklist {
  Checklist({
    required this.id,
    required this.title,
    required this.items,
    required this.standard,
  });

  factory Checklist.fromJson(Map<String, dynamic> json) => _$ChecklistFromJson(json);

  final String id;
  final String title;
  final List<ChecklistItem> items;
  final String standard;

  Map<String, dynamic> toJson() => _$ChecklistToJson(this);

  ChecklistItem? itemById(String itemId) => items.firstWhereOrNull((item) => item.id == itemId);
}

@JsonSerializable()
class ChecklistItem {
  ChecklistItem({
    required this.id,
    required this.description,
    this.completed = false,
    this.notes,
  });

  factory ChecklistItem.fromJson(Map<String, dynamic> json) => _$ChecklistItemFromJson(json);

  final String id;
  final String description;
  final bool completed;
  final String? notes;

  Map<String, dynamic> toJson() => _$ChecklistItemToJson(this);

  ChecklistItem toggle({bool? value, String? updatedNotes}) => ChecklistItem(
        id: id,
        description: description,
        completed: value ?? !completed,
        notes: updatedNotes ?? notes,
      );
}
