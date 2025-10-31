import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:hub_fiscalizacao_mobile/services/secure_storage_service.dart';

class _MockStorage extends Mock implements FlutterSecureStorage {}

void main() {
  late _MockStorage storage;
  late SecureStorageService service;

  setUp(() {
    storage = _MockStorage();
    service = SecureStorageService(storage: storage);
  });

  test('persistTokens salva tokens no storage seguro', () async {
    when(() => storage.write(key: any(named: 'key'), value: any(named: 'value'))).thenAnswer((_) async {});

    await service.persistTokens(accessToken: 'token', refreshToken: 'refresh');

    verify(() => storage.write(key: 'auth_token', value: 'token')).called(1);
    verify(() => storage.write(key: 'refresh_token', value: 'refresh')).called(1);
  });

  test('clear remove tokens', () async {
    when(() => storage.delete(key: any(named: 'key'))).thenAnswer((_) async {});

    await service.clear();

    verify(() => storage.delete(key: 'auth_token')).called(1);
    verify(() => storage.delete(key: 'refresh_token')).called(1);
  });
}
