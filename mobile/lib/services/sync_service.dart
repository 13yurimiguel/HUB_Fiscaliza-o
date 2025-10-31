import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../models/activity.dart';
import '../models/checklist.dart';
import '../models/sync_payload.dart';
import '../models/worksite.dart';
import 'cache_service.dart';
import 'secure_storage_service.dart';

class SyncService extends ChangeNotifier {
  SyncService({http.Client? httpClient, CacheService? cacheService, SecureStorageService? storage})
      : _httpClient = httpClient ?? http.Client(),
        _cacheService = cacheService ?? CacheService(),
        _storage = storage ?? SecureStorageService();

  final http.Client _httpClient;
  final CacheService _cacheService;
  final SecureStorageService _storage;

  DateTime? _lastSync;
  bool _syncInProgress = false;

  DateTime? get lastSync => _lastSync;
  bool get syncInProgress => _syncInProgress;

  static const _baseUrl = 'https://api.example.com/sync';

  Future<SyncPayload> performSync({DateTime? since}) async {
    _setSyncInProgress(true);
    try {
      final token = await _storage.readAccessToken();
      if (token == null) {
        throw const SyncException('Token de acesso ausente. Faça login novamente.');
      }

      final response = await _httpClient.post(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'since': since?.toIso8601String()}),
      );

      if (response.statusCode != 200) {
        throw SyncException('Falha na sincronização: ${response.statusCode}');
      }

      final payload = SyncPayload.fromJson(jsonDecode(response.body) as Map<String, dynamic>);

      await Future.wait([
        _cacheService.cacheWorksites(payload.worksites),
        _cacheService.cacheActivities(payload.activities),
        _cacheService.cacheChecklists(payload.checklists),
      ]);

      _lastSync = payload.lastSync;
      notifyListeners();
      return payload;
    } on SyncException {
      rethrow;
    } catch (error, stackTrace) {
      debugPrint('Erro de sync: $error\n$stackTrace');
      throw const SyncException('Não foi possível sincronizar com o servidor.');
    } finally {
      _setSyncInProgress(false);
    }
  }

  Future<List<Worksite>> getCachedWorksites() => _cacheService.readWorksites();

  Future<List<Activity>> getCachedActivities() => _cacheService.readActivities();

  Future<List<Checklist>> getCachedChecklists() => _cacheService.readChecklists();

  void _setSyncInProgress(bool value) {
    _syncInProgress = value;
    notifyListeners();
  }
}

class SyncException implements Exception {
  const SyncException(this.message);

  final String message;

  @override
  String toString() => 'SyncException: $message';
}
