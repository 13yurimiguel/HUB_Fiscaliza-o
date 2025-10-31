import 'package:json_annotation/json_annotation.dart';

part 'activity.g.dart';

@JsonSerializable()
class Activity {
  Activity({
    required this.id,
    required this.name,
    required this.worksiteId,
  });

  factory Activity.fromJson(Map<String, dynamic> json) => _$ActivityFromJson(json);

  final String id;
  final String name;
  final String worksiteId;

  Map<String, dynamic> toJson() => _$ActivityToJson(this);
}
