import 'package:json_annotation/json_annotation.dart';

part 'worksite.g.dart';

@JsonSerializable()
class Worksite {
  Worksite({
    required this.id,
    required this.name,
    required this.location,
  });

  factory Worksite.fromJson(Map<String, dynamic> json) => _$WorksiteFromJson(json);

  final String id;
  final String name;
  final String location;

  Map<String, dynamic> toJson() => _$WorksiteToJson(this);
}
