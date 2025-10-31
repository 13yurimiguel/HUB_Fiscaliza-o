import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:http/http.dart' as http;

import 'package:hub_fiscalizacao_mobile/models/activity.dart';
import 'package:hub_fiscalizacao_mobile/models/checklist.dart';
import 'package:hub_fiscalizacao_mobile/models/worksite.dart';
import 'package:hub_fiscalizacao_mobile/services/cache_service.dart';
import 'package:hub_fiscalizacao_mobile/services/secure_storage_service.dart';
import 'package:hub_fiscalizacao_mobile/services/sync_service.dart';

class _MockClient extends Mock implements http.Client {}

class _MockCacheService extends Mock implements CacheService {}

class _MockStorage extends Mock implements SecureStorageService {}

void main() {
  late _MockClient client;
  late _MockCacheService cacheService;
  late _MockStorage storage;
  late SyncService service;

  setUp(() {
    client = _MockClient();
    cacheService = _MockCacheService();
    storage = _MockStorage();
    service = SyncService(httpClient: client, cacheService: cacheService, storage: storage);
  });

  final payload = {
    'worksites': [
      {'id': '1', 'name': 'Obra 1', 'location': 'Local 1'},
    ],
    'activities': [
      {'id': 'a', 'name': 'Atividade', 'worksiteId': '1'},
    ],
    'checklists': [
      {
        'id': 'c',
        'title': 'Checklist ISO',
        'standard': 'ISO-9001',
        'items': [
          {'id': 'i', 'description': 'Item', 'completed': false},
        ],
      },
    ],
    'lastSync': DateTime.now().toIso8601String(),
  };

  test('performSync salva dados no cache', () async {
    when(() => storage.readAccessToken()).thenAnswer((_) async => 'token');
    when(() => client.post(any(), headers: any(named: 'headers'), body: any(named: 'body'))).thenAnswer(
      (_) async => http.Response(jsonEncode(payload), 200),
    );
    when(() => cacheService.cacheWorksites(any())).thenAnswer((_) async {});
    when(() => cacheService.cacheActivities(any())).thenAnswer((_) async {});
    when(() => cacheService.cacheChecklists(any())).thenAnswer((_) async {});

    final result = await service.performSync();

    expect(result.worksites.first, isA<Worksite>());
    expect(result.activities.first, isA<Activity>());
    expect(result.checklists.first, isA<Checklist>());
    verify(() => cacheService.cacheWorksites(any())).called(1);
    verify(() => cacheService.cacheActivities(any())).called(1);
    verify(() => cacheService.cacheChecklists(any())).called(1);
  });

  test('performSync lança exceção quando token ausente', () async {
    when(() => storage.readAccessToken()).thenAnswer((_) async => null);

    expect(() => service.performSync(), throwsA(isA<SyncException>()));
  });
}
